import { useRef, useState, useEffect } from "react";
import DOMPurify from "dompurify";

const MobilePreview = ({
  htmlContent,
  viewportWidth,
  finalUrl,
}: {
  htmlContent: string;
  viewportWidth: number;
  finalUrl: string;
}) => {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [safeHtml, setSafeHtml] = useState("");

  useEffect(() => {
    // 1. Fix relative URLs to absolute
    const baseUrl = new URL(finalUrl);
    let processedHtml = htmlContent.replace(
      /(href|src)=(["'])(?!https?:|\/\/)([^"']+)/g,
      `$1=$2${baseUrl.origin}/$3`
    );

    // 2. Remove problematic Next.js scripts and links
    processedHtml = processedHtml
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<link[^>]*_next[^>]*>/gi, "");

    // 3. Sanitize HTML
    const cleanHtml = DOMPurify.sanitize(processedHtml, {
      ADD_ATTR: ["target"],
      ADD_TAGS: ["iframe"],
      FORBID_TAGS: ["script", "style"],
      FORBID_ATTR: ["onload", "onerror"],
    });

    setSafeHtml(cleanHtml);
  }, [htmlContent, finalUrl]);

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
        width: `${viewportWidth}px`,
        margin: "0 auto",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "8px",
          textAlign: "center",
          borderBottom: "1px solid #ddd",
        }}
      >
        Mobile Preview ({viewportWidth}px)
      </div>
      <iframe
        ref={iframeRef}
        srcDoc={safeHtml}
        style={{
          width: "100%",
          height: "600px",
          border: "none",
          background: "white",
        }}
        sandbox="allow-same-origin"
        onLoad={() => setIframeLoaded(true)}
      />
      {!iframeLoaded && (
        <div
          style={{
            width: "100%",
            height: "600px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#f5f5f5",
          }}
        >
          Loading preview...
        </div>
      )}
    </div>
  );
};

export default MobilePreview;

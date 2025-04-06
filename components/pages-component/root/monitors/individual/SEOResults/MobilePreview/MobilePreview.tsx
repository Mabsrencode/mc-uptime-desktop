import Image from "next/image";

interface MobilePreviewProps {
  viewportWidth: number;
  simulatedDevice: string;
  contentWidth: number;
  issues: string[];
  screenshot?: string;
}

const MobilePreview: React.FC<{ rendering: MobilePreviewProps }> = ({
  rendering,
}) => {
  if (!rendering.screenshot) return null;

  return (
    <div
      className="border rounded-lg overflow-hidden shadow-lg mx-auto"
      style={{ width: `${rendering.viewportWidth}px`, maxWidth: "100%" }}
    >
      <div className="bg-gray-100 py-2 border-b border-black/20">
        <h4 className="text-center text-sm font-bold text-black">
          {rendering.simulatedDevice}
        </h4>
      </div>
      <div className="relative" style={{ height: "600px" }}>
        <Image
          src={rendering.screenshot}
          alt="Mobile preview screenshot"
          fill
          className="object-contain bg-white"
          unoptimized
        />
      </div>
      {rendering.issues.length > 0 && (
        <div className="bg-yellow-50 p-3 border-t">
          <h4 className="font-medium text-yellow-800">Mobile Issues:</h4>
          <ul className="list-disc pl-5 text-yellow-700 text-sm">
            {rendering.issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobilePreview;

import Content from "@/components/pages-component/root/monitors/individual/Content/Content";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return (
    <>
      <Content siteId={id} />
    </>
  );
};

export default page;

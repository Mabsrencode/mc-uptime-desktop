import React from "react";
import Content from "@/components/pages-component/root/incidents/individual/Content/Content";
const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return <Content incidentId={id} />;
};

export default page;

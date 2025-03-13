import React from "react";
import Content from "@/components/pages-component/root/incidents/individual/Content/Content";
const page = async ({
  params,
}: {
  params: { incidentId: string; siteId: string };
}) => {
  const { incidentId, siteId } = await params;
  return <Content incidentId={incidentId} siteId={siteId} />;
};

export default page;

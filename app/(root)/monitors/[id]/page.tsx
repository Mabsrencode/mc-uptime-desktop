import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return <div>page</div>;
};

export default page;

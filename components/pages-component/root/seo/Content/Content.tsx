import React from "react";

const Content = () => {
  return (
    <section className="py-3 px-4 container mx-auto w-full mt-6 text-white">
      <div className="mt-32 text-center w-full">
        <h3 className="manrope text-5xl font-bold">
          Analyze
          <span className="text-green-500"> Performance</span> with{" "}
          <span className="text-green-500">Ease</span>
        </h3>
        <p className="text-gray-400 text-lg mt-4 w-[75%] mx-auto">
          Ease Performance is a tool designed to monitor, evaluate, and optimize
          system or application performance. It collects key metrics such as
          speed, efficiency, and resource usage, providing real-time insights
          and detailed reports to enhance overall performance and reliability.
        </p>
        <button className="transition-all text-center gap-2 py-2 px-3 bg-green-700 hover:bg-green-700/70 rounded mt-8 cursor-pointer">
          Analyze Performance
        </button>
      </div>
    </section>
  );
};

export default Content;

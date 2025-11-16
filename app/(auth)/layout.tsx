import React from "react";
import Image from "next/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
      <section className="flex justify-between items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:pl-0 lg:py-0">
        {children}
      </section>
  );
};

export default Layout;

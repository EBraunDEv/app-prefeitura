import React, { ReactNode } from "react";

interface WrapperProps {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className=" min-[320px]:text-center max-[600px] fixed top-0 left-0 w-full h-full flex items-center justify-center  bg-opacity-70 ">
      <div className=" w-80 h-30 bg-transparent  flex items-center justify-center " style={{ backdropFilter: "blur(3px)" }}>
        <div className="w-full max-w-sm mx-auto bg-transparent backdrop-blur shadow-md text-white rounded mt-2" >
        <div style={{ width: "100%" }}>
          {children}
        </div>

        </div>
      </div>
    </div>
  );
};

export default Wrapper;
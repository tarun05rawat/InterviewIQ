// components/Loader.tsx
import React from "react";
import "./Loader.css";

const Loader: React.FC = () => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex justify-center z-50"
      style={{ paddingTop: "40vh" }}
    >
      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;

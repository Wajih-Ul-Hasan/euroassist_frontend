import React from "react";
import { Loader } from "lucide-react";

const LoadingIndicator = () => {
  return (
    <div className="d-flex justify-content-center align-items-center p-3">
      <Loader size={24} className="text-primary spin" />
    </div>
  );
};

export default LoadingIndicator;

import React, { useEffect } from "react";

const BootstrapLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    document.head.appendChild(link);
  }, []);

  return null;
};

export default BootstrapLoader;

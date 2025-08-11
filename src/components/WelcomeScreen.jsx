import React from "react";
import { MessageSquare } from "lucide-react";

const WelcomeScreen = () => {
  return (
    <div className="text-center p-4">
      <MessageSquare size={48} className="text-primary mb-3" />
      <h2>Welcome to EuroAssist.ai</h2>
      <p className="text-muted">
        Start chatting to get assistance with your queries.
      </p>
    </div>
  );
};

export default WelcomeScreen;

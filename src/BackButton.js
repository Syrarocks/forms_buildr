import React from "react";
import { Icon } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div
      style={{
        position: "fixed",
        left: "10px",
        zIndex: 1000, // Ensure it stays on top
        cursor: "pointer",
      }}
      onClick={handleBackClick}
    >
      <Icon name="arrow circle left" size="big" color="blue" />
    </div>
  );
};

export default BackButton;

import React from "react";
import { Menu, Button } from "semantic-ui-react";

function Navigation({ setCurrentView }) {
  return (
    <Menu pointing secondary>
      <Menu.Item
        name="Questions"
        onClick={() => setCurrentView("questions")}
        style={{ fontWeight: "bold", color: "black" }} // Bold font and custom color
      />
      <Menu.Item
        name="Create Survey Forms +"
        onClick={() => setCurrentView("survey")}
        style={{ fontWeight: "bold", color: "black" }} // Bold font and custom color
      />
      <Menu.Item
        name="Form Responses"
        onClick={() => setCurrentView("formResponses")} // Switch to Form Responses
        style={{ fontWeight: "bold", color: "black" }} // Bold font and custom color
      />
      <Menu.Item
        name="Survey Responses"
        onClick={() => setCurrentView("surveyResponses")} // Switch to Survey Responses
        style={{ fontWeight: "bold", color: "black" }} // Bold font and custom color
      />
      {/* Add Forms button with black color */}
      <Menu.Item>
        <Button
          color="blue"
          onClick={() => setCurrentView("forms")} // Switch to "forms" view
          style={{ fontWeight: "bold" }}
        >
          Forms
        </Button>
      </Menu.Item>
    </Menu>
  );
}

export default Navigation;

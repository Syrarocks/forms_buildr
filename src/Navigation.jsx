import React from "react";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <Menu pointing secondary>
      {/* Bold font for menu items */}
      <Menu.Item
        as={Link}
        to="/"
        name="Questions"
        style={{ fontWeight: "bold" }}
      />
      <Menu.Item
        as={Link}
        to="/survey-forms"
        name="Survey"
        style={{ fontWeight: "bold" }}
      />
      <Menu.Item
        as={Link}
        to="/form-responses"
        name="Form Responses"
        style={{ fontWeight: "bold" }}
      />
      <Menu.Item
        as={Link}
        to="/survey-responses"
        name="Survey Responses"
        style={{ fontWeight: "bold" }}
      />

      {/* Blue button for Forms */}
      <Menu.Item>
        <Button
          as={Link}
          to="/forms"
          primary
          style={{ fontWeight: "bold" }} // Makes the button text bold
        >
          Forms
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;

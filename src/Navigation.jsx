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
        name="Quiz Form"
        style={{ fontWeight: "bold" }}
      />

      {/* Position these buttons on the right */}
      <Menu.Item>
        <Button
          as={Link}
          to="/forms"
          primary
          style={{ fontWeight: "bold" }} // Makes the button text bold
        >
          Quiz Form
        </Button>
      </Menu.Item>

      {/* Add Survey Display Button */}
      <Menu.Item>
        <Button
          as={Link}
          to="/survey-forms-list"
          primary
          style={{ fontWeight: "bold" }} // Makes the button text bold
        >
          Survey Form
        </Button>
      </Menu.Item>
    </Menu>
  );
};

export default Navigation;

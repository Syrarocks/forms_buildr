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

      {/* Position these buttons on the right */}
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

      {/* Add Survey Display Button */}
      <Menu.Item>
        <Button
          as={Link}
          to="/survey-forms-list"
          primary
          style={{ fontWeight: "bold" }} // Makes the button text bold
        >
          Survey Forms List
        </Button>
      </Menu.Item>

      <Menu.Menu position="right">
        <Menu.Item>
          <Button
            as={Link}
            to="/form-responses"
            primary
            style={{ fontWeight: "bold" }}
          >
            Form Responses
          </Button>
        </Menu.Item>

        {/* Add Survey Responses Button */}
        <Menu.Item>
          <Button
            as={Link}
            to="/survey-responses"
            secondary
            style={{ fontWeight: "bold" }} // Makes the button text bold
          >
            Survey Responses
          </Button>
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};

export default Navigation;

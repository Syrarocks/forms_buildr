import React, { useEffect, useState } from "react";
import { List, Segment, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const Forms = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve forms from localStorage
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    setForms(storedForms);
  }, []);

  const handleViewForm = (form) => {
    // Navigate to the form display page, passing the form data as state
    navigate(`/forms/${form.form_id}`, { state: { form } });
  };

  const handleClearForms = () => {
    // Clear forms from localStorage and state
    localStorage.removeItem("forms");
    setForms([]);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Clear Forms button at the top right */}
      <Button
        color="red"
        onClick={handleClearForms}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          marginRight: "240px",
        }}
      >
        Clear Forms
      </Button>

      <h2 style={{ marginLeft: "240px" }}>All Created Forms</h2>
      <List>
        {forms.length > 0 ? (
          forms.map((form) => (
            <List.Item key={form.form_id}>
              <Segment
                style={{
                  maxWidth: "650px",
                  margin: "10px auto",
                  marginTop: "10px",
                }}
              >
                {/* Adjusted maxWidth and centered using margin */}
                <List.Header>{form.title}</List.Header>
                <List.Description>
                  <strong>Form ID: {form.form_id}</strong>
                </List.Description>
                <List.Description>{form.description}</List.Description>

                <Button
                  primary
                  onClick={() => handleViewForm(form)}
                  style={{ marginTop: "1em" }}
                >
                  View Form
                </Button>
              </Segment>
            </List.Item>
          ))
        ) : (
          <p>No forms available. Create one!</p>
        )}
      </List>
    </div>
  );
};

export default Forms;

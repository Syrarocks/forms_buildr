import React, { useEffect, useState } from "react";
import { List, Segment, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const Forms = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate(); // Access the navigate function from react-router

  useEffect(() => {
    // Retrieve forms from localStorage
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    setForms(storedForms);
  }, []);

  const handleViewForm = (form) => {
    // Navigate to the form display page, passing the form data as state
    navigate(`/forms/${form.id}`, { state: { form } });
  };

  return (
    <div>
      <h2>All Created Forms</h2>
      <List divided>
        {forms.length > 0 ? (
          forms.map((form) => (
            <List.Item key={form.id}>
              <Segment>
                <List.Header>{form.title}</List.Header>
                <List.Description>Form ID: {form.id}</List.Description>
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

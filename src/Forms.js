import React, { useEffect, useState } from "react";
import { Button, List, Segment } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import FormEditor from "./FormEditor"; // Import FormEditor component

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const navigate = useNavigate();

  useEffect(() => {
    // Load forms from localStorage
    const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
    setForms(storedForms);
  }, []);

  const handleViewForm = (form) => {
    navigate(`/forms/${form.form_id}`, { state: { form } });
  };

  const handleViewResponses = (form) => {
    // Retrieve all responses from localStorage
    const allResponses =
      JSON.parse(localStorage.getItem("formResponses")) || [];

    // Filter responses to get only the ones for the selected form
    const formResponses = allResponses.filter(
      (response) => response.form_id === form.form_id
    );

    // Navigate to the responses page, passing the form and its specific responses
    navigate(`/forms/${form.form_id}/responses`, {
      state: { form, responses: formResponses },
    });
  };

  const handleCreateNewForm = () => {
    setIsEditing(true); // Toggle to editing mode
  };

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <h2 style={{ marginLeft: "240px" }}>All Created Forms</h2>

      {/* Create New Form button placed above the segment */}
      <Button
        primary
        onClick={handleCreateNewForm}
        style={{
          position: "absolute",
          top: "10px",
          right: "237px", // Slightly away from the right edge
        }}
      >
        Create New Form
      </Button>

      {isEditing ? (
        <FormEditor
          onSubmit={(formData) => {
            // Add the new form to the state and exit edit mode
            setForms((prevForms) => [...prevForms, formData]);
            setIsEditing(false); // Exit editing mode after form is submitted
          }}
        />
      ) : (
        <List>
          {forms.length > 0 ? (
            forms.map((form) => (
              <List.Item key={form.form_id}>
                <Segment
                  style={{
                    maxWidth: "650px",
                    margin: "10px auto",
                    position: "relative",
                  }}
                >
                  {/* Form title */}
                  <List.Header>{form.title}</List.Header>
                  <List.Description>
                    <strong>Form ID: {form.form_id}</strong>
                  </List.Description>
                  <List.Description>{form.description}</List.Description>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "1em",
                    }}
                  >
                    {/* View Form Button */}
                    <Button primary onClick={() => handleViewForm(form)}>
                      View Form
                    </Button>
                    {/* View Responses Button */}
                    <Button secondary onClick={() => handleViewResponses(form)}>
                      View Form Responses
                    </Button>
                  </div>
                </Segment>
              </List.Item>
            ))
          ) : (
            <p>No forms available. Create one!</p>
          )}
        </List>
      )}
    </div>
  );
};

export default Forms;

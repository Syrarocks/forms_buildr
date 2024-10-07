import React, { useEffect, useState } from "react";
import { List, Segment, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const SurveyFormsList = () => {
  const [surveyForms, setSurveyForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve survey forms from localStorage
    const storedSurveyForms =
      JSON.parse(localStorage.getItem("surveyForms")) || [];
    setSurveyForms(storedSurveyForms);
  }, []);

  const handleViewForm = (form) => {
    // Navigate to the survey form display page, passing the form data as state
    navigate(`/survey-display`, { state: { form } });
  };

  const handleClearForms = () => {
    // Clear survey forms from localStorage and state
    localStorage.removeItem("surveyForms");
    setSurveyForms([]);
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
        Clear Survey Forms
      </Button>

      <h2 style={{ marginLeft: "240px" }}>All Created Survey Forms</h2>
      <List>
        {surveyForms.length > 0 ? (
          surveyForms.map((form) => (
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
                  View Survey Form
                </Button>
              </Segment>
            </List.Item>
          ))
        ) : (
          <p>No survey forms available. Create one!</p>
        )}
      </List>
    </div>
  );
};

export default SurveyFormsList;

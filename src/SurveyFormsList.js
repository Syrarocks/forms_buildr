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

  const handleCreateForm = () => {
    navigate("/create-survey-form");
  };

  const handleViewForm = (form) => {
    navigate(`/survey-display`, { state: { form } });
  };

  const handleViewResponses = (formId) => {
    navigate(`/survey-responses/${formId}`); // Navigate with formId as a parameter
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        class="ui green button"
        onClick={handleCreateForm}
        style={{ position: "absolute", top: 0, right: "230px", margin: "10px" }}
      >
        Create Forms +{" "}
      </button>

      <h2 style={{ marginLeft: "240px" }}>All Created Survey Forms</h2>
      <List>
        {surveyForms.length > 0 ? (
          surveyForms.map((form) => (
            <List.Item key={form.form_id}>
              <Segment
                style={{
                  maxWidth: "650px",
                  margin: "10px auto",
                  marginTop: "30px",
                }}
              >
                <List.Header>{form.title}</List.Header>
                <List.Description>
                  <strong>Form ID: {form.form_id}</strong>
                </List.Description>
                <List.Description>{form.description}</List.Description>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "10px",
                    marginTop: "1em",
                  }}
                >
                  <Button primary onClick={() => handleViewForm(form)}>
                    View Survey Form
                  </Button>
                  <Button
                    secondary
                    onClick={() => handleViewResponses(form.form_id)}
                  >
                    View Survey Responses
                  </Button>
                </div>
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

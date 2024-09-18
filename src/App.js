import React, { useState, useEffect } from "react";
import "semantic-ui-css/semantic.min.css";
import { Container, Button, Grid, Icon } from "semantic-ui-react";
import SurveyForms from "./SurveyForms";
import FormEditor from "./FormEditor";
import FormDisplay from "./FormDisplay";
import Navigation from "./Navigation";
import ViewForm from "./ViewForm";
import ViewSurveyForm from "./ViewSurveyForm";
import FormResponses from "./FormResponses";
import SurveyResponses from "./SurveyResponses";

function App() {
  const [currentView, setCurrentView] = useState("questions");
  const [showFormEditor, setShowFormEditor] = useState(false);
  const [formData, setFormData] = useState(null);
  const [surveyFormData, setSurveyFormData] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState([]);

  // Load saved survey responses from localStorage
  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem("surveyResponses"));
    if (savedResponses) {
      setSurveyResponses(savedResponses);
    }
  }, []);

  // Save survey responses to localStorage when they change
  useEffect(() => {
    localStorage.setItem("surveyResponses", JSON.stringify(surveyResponses));
  }, [surveyResponses]);

  const handleFormSubmit = (data) => {
    setFormData(data);
    setCurrentView("display");
  };

  const handleCreateFormsClick = () => {
    setShowFormEditor(!showFormEditor);
  };

  const handleSurveyFormSubmit = (data) => {
    setSurveyFormData(data);
    setCurrentView("viewSurveyForm");
  };

  const handleViewForm = (data) => {
    setSurveyFormData(data);
    setCurrentView("viewForm");
  };

  // Save the current form or survey form data to localStorage
  const handleSaveForm = () => {
    if (formData) {
      localStorage.setItem("savedFormData", JSON.stringify(formData));
      alert("Form saved successfully!");
    } else if (surveyFormData) {
      localStorage.setItem(
        "savedSurveyFormData",
        JSON.stringify(surveyFormData)
      );
      alert("Survey form saved successfully!");
    } else {
      alert("No form data to save.");
    }
  };

  return (
    <Container>
      <Navigation setCurrentView={setCurrentView} />

      {currentView === "questions" && (
        <>
          <Grid>
            <Grid.Column width={12}>
              <Button primary onClick={handleCreateFormsClick}>
                {showFormEditor ? "Close Form Editor" : "Create Forms +"}
              </Button>

              {showFormEditor && (
                <>
                  <Button
                    color="black"
                    onClick={() => setCurrentView("display")}
                    style={{ marginLeft: "10px" }}
                  >
                    View Form
                  </Button>

                  <Icon
                    name="save"
                    onClick={handleSaveForm} // Call handleSaveForm directly
                    color="blue"
                    size="large"
                    style={{ marginLeft: "10px" }}
                  />
                </>
              )}
            </Grid.Column>
          </Grid>

          {showFormEditor && (
            <div style={{ marginTop: "2em" }}>
              <FormEditor onSubmit={handleFormSubmit} />
            </div>
          )}
        </>
      )}

      {currentView === "survey" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              gap: "10px", // Add gap to space the buttons
              marginBottom: "1em",
            }}
          >
            {/* Back to Forms Button */}
            <Button
              basic
              icon
              labelPosition="left"
              onClick={() => setCurrentView("questions")}
              style={{
                boxShadow: "none",
              }}
            >
              <Icon name="arrow left" />
              Back to Forms
            </Button>

            {/* View Survey Form Button */}
            <Button
              color="black"
              onClick={() => setCurrentView("viewSurveyForm")}
              style={{ marginBottom: "1em" }}
            >
              View Survey Form
            </Button>
          </div>

          <SurveyForms
            onSubmit={handleSurveyFormSubmit}
            onViewForm={handleViewForm}
          />
        </>
      )}

      {currentView === "display" && formData && (
        <FormDisplay formData={formData} />
      )}

      {currentView === "viewForm" && surveyFormData && (
        <ViewForm formData={surveyFormData} />
      )}

      {currentView === "viewSurveyForm" && <ViewSurveyForm />}

      {currentView === "formResponses" && <FormResponses />}

      {currentView === "surveyResponses" && <SurveyResponses />}
    </Container>
  );
}

export default App;

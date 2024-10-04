import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import FormEditor from "./FormEditor";
import FormDisplay from "./FormDisplay";
import Navigation from "./Navigation";
import Forms from "./Forms";
import FormDetails from "./FormDetails";
import SurveyForms from "./SurveyForms";
import SurveyDisplay from "./SurveyFormDisplay"; // Import SurveyDisplay component
import FormResponses from "./FormResponses";
import AnswerKey from "./AnswerKey";
import SurveyFormsList from "./SurveyFormsList"; // Import the new component

import SurveyFormDisplay from "./SurveyFormDisplay";
import SurveyResponses from "./SurveyResponses";

function App() {
  const [formData, setFormData] = useState(null);
  const [surveyFormData, setSurveyFormData] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState([]);

  useEffect(() => {
    const savedResponses = JSON.parse(localStorage.getItem("surveyResponses"));
    if (savedResponses) {
      setSurveyResponses(savedResponses);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("surveyResponses", JSON.stringify(surveyResponses));
  }, [surveyResponses]);

  const handleFormSubmit = (data) => {
    setFormData(data);
  };

  const handleSurveyFormSubmit = (data) => {
    setSurveyFormData(data);
  };

  return (
    <Router>
      <Navigation />
      <Container>
        <Routes>
          <Route
            path="/"
            element={<FormEditor onSubmit={handleFormSubmit} />}
          />
          <Route path="/forms" element={<Forms />} />
          <Route path="/survey-display" element={<SurveyDisplay />} />
          <Route path="/forms/:id" element={<FormDisplay />} />
          <Route
            path="/survey-forms"
            element={<SurveyForms onSubmit={handleSurveyFormSubmit} />}
          />
          <Route path="/survey-display" element={<SurveyDisplay />} />{" "}
          {/* Add SurveyDisplay route */}
          <Route path="/form-responses" element={<FormResponses />} />
          <Route path="/forms/:id/details" element={<FormDetails />} />
          <Route path="/answer-key" element={<AnswerKey />} />
          <Route path="/survey-forms-list" element={<SurveyFormsList />} />
          <Route path="/survey-form-display" element={<SurveyFormDisplay />} />
          <Route path="/survey-responses" element={<SurveyResponses />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

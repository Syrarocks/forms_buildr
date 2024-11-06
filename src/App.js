import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";
import Navigation from "./Navigation";
import BackButton from "./BackButton";
import FormEditor from "./FormEditor";
import FormDisplay from "./FormDisplay";
import Forms from "./Forms";

import SurveyDisplay from "./SurveyFormDisplay";
import FormResponses from "./FormResponses";
import AnswerKey from "./AnswerKey";
import SurveyFormsList from "./SurveyFormsList";
import SurveyFormDisplay from "./SurveyFormDisplay";
import SurveyResponses from "./SurveyResponses";
import ResponseDetails from "./ResponseDetails";
import FormResponseDetails from "./FormResponseDetails";
import CreateSurveyForm from "./CreateSurveyForm";

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
        <BackButton />
        <Routes>
          <Route
            path="/"
            element={<FormEditor onSubmit={handleFormSubmit} />}
          />
          <Route path="/forms" element={<Forms />} />
          <Route path="/survey-display" element={<SurveyDisplay />} />
          <Route path="/forms/:id" element={<FormDisplay />} />
          <Route path="/form-responses" element={<FormResponses />} />
          <Route path="/answer-key" element={<AnswerKey />} />
          <Route path="/survey-forms-list" element={<SurveyFormsList />} />
          <Route path="/survey-form-display" element={<SurveyFormDisplay />} />
          <Route
            path="/survey-responses/:formId"
            element={<SurveyResponses />}
          />{" "}
          {/* Updated route */}
          <Route
            path="/form-responses/:formId"
            element={<FormResponseDetails />}
          />
          <Route path="/response-details" element={<ResponseDetails />} />
          <Route
            path="/create-survey-form"
            element={<CreateSurveyForm />}
          />{" "}
          {/* New route */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

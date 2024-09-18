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
import ViewForm from "./ViewForm";
import ViewSurveyForm from "./ViewSurveyForm";
import FormResponses from "./FormResponses";
import SurveyResponses from "./SurveyResponses";

function App() {
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
  };

  const handleSurveyFormSubmit = (data) => {
    setSurveyFormData(data);
  };

  return (
    <Router>
      <Navigation />
      <Container>
        <Routes>
          {/* Home route */}
          <Route
            path="/"
            element={<FormEditor onSubmit={handleFormSubmit} />}
          />

          {/* Forms list route */}
          <Route path="/forms" element={<Forms />} />

          {/* Form display route (using form ID) */}
          <Route path="/forms/:id" element={<FormDisplay />} />

          {/* Survey forms route */}
          <Route
            path="/survey-forms"
            element={<SurveyForms onSubmit={handleSurveyFormSubmit} />}
          />

          {/* View individual form */}
          <Route
            path="/view-form"
            element={<ViewForm formData={surveyFormData} />}
          />

          {/* View survey form */}
          <Route path="/view-survey-form" element={<ViewSurveyForm />} />

          {/* Form responses */}
          <Route path="/form-responses" element={<FormResponses />} />

          {/* Survey responses */}
          <Route path="/survey-responses" element={<SurveyResponses />} />

          {/* Form details route */}
          <Route path="/forms/:id/details" element={<FormDetails />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import {
  Container,
  Segment,
  Form,
  Checkbox,
  Rating,
  Button,
  Message,
} from "semantic-ui-react";

function ViewSurveyForm() {
  const [surveyData, setSurveyData] = useState(null);
  const [responses, setResponses] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const storedSurvey = localStorage.getItem("surveyFormData");
    if (storedSurvey) {
      setSurveyData(JSON.parse(storedSurvey));
    }
  }, []);

  // Update the form with responses
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  // Handle form submission
  const handleSubmitResponses = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setSubmitted(true);

    // Save responses to localStorage
    const storedResponses =
      JSON.parse(localStorage.getItem("surveyResponses")) || [];
    const newResponses = [...storedResponses, { responses }];
    localStorage.setItem("surveyResponses", JSON.stringify(newResponses));

    // Log the user responses
    console.log("User Responses: ", responses);
  };

  const renderQuestions = () =>
    surveyData?.questions?.map((question) => (
      <Segment key={question.id}>
        <h4>{question.questionText}</h4>
        {question.questionType === "checkboxes" &&
          question.checkboxOptions.map((option) => (
            <Form.Field key={option.id}>
              <Checkbox
                label={option.label}
                onChange={(e, { checked }) =>
                  handleResponseChange(`${question.id}-${option.id}`, checked)
                } // Corrected template literal
              />
            </Form.Field>
          ))}
        {question.questionType === "ratings" && (
          <Rating
            icon="star"
            maxRating={5}
            size="huge"
            style={{ color: "goldenrod" }}
            onRate={(e, { rating }) =>
              handleResponseChange(question.id, rating)
            }
          />
        )}
        {question.questionType === "text" && (
          <Form.Input
            placeholder="Your answer"
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
          />
        )}
      </Segment>
    ));

  const renderSubmittedResponses = () => (
    <Segment>
      <h3>Submitted Responses</h3>
      {surveyData?.questions?.map((question) => (
        <div key={question.id}>
          <h4>{question.questionText}</h4>
          {question.questionType === "checkboxes" &&
            question.checkboxOptions.map((option) => (
              <p key={option.id}>
                {option.label}:{" "}
                {responses[`${question.id}-${option.id}`]
                  ? "Selected"
                  : "Not Selected"}{" "}
                {/* Corrected template literal */}
              </p>
            ))}
          {question.questionType === "ratings" && (
            <p>Rating: {responses[question.id] || "No Rating"}</p>
          )}
          {question.questionType === "text" && (
            <p>Answer: {responses[question.id] || "No Answer"}</p>
          )}
        </div>
      ))}
    </Segment>
  );

  return (
    <Container>
      {surveyData ? (
        <Form onSubmit={handleSubmitResponses}>
          <h2>{surveyData.title}</h2>
          <p>{surveyData.description}</p>

          {!submitted && renderQuestions()}

          {!submitted && (
            <Button color="blue" type="submit">
              Submit Responses
            </Button>
          )}

          {submitted && renderSubmittedResponses()}

          {submitted && (
            <Message success header="Responses submitted successfully!" />
          )}
        </Form>
      ) : (
        <p>No Survey Form Available</p>
      )}
    </Container>
  );
}

export default ViewSurveyForm;

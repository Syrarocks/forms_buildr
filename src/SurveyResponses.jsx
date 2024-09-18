import React, { useState, useEffect } from "react";
import { Container, Header, Segment, Message } from "semantic-ui-react";
import "./SurveyResponses.css"; // Import your custom CSS file

function SurveyResponses() {
  const [surveyFormData, setSurveyFormData] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState([]);

  useEffect(() => {
    const storedFormData =
      JSON.parse(localStorage.getItem("surveyFormData")) || null;
    const storedResponses =
      JSON.parse(localStorage.getItem("surveyResponses")) || [];

    setSurveyFormData(storedFormData);
    setSurveyResponses(storedResponses);
  }, []);

  const renderResponses = () =>
    surveyResponses.map((response, index) => (
      <Segment key={index} className="survey-response-segment">
        <Header as="h3">Response {index + 1}</Header>
        {surveyFormData?.questions?.map((question) => (
          <div key={question.id}>
            <p>
              <strong>{question.questionText}</strong>
            </p>
            {question.questionType === "checkboxes" &&
              question.checkboxOptions.map((option) => (
                <p key={option.id}>
                  {option.label}:{" "}
                  {response.responses?.[`${question.id}-${option.id}`]
                    ? "Selected"
                    : "Not Selected"}
                </p>
              ))}
            {question.questionType === "ratings" && (
              <p>Rating: {response.responses?.[question.id] || "No Rating"}</p>
            )}
            {question.questionType === "text" && (
              <p>Answer: {response.responses?.[question.id] || "No Answer"}</p>
            )}
          </div>
        ))}
      </Segment>
    ));

  return (
    <Container className="survey-responses-container">
      <Header as="h2" textAlign="center">
        Survey Responses
      </Header>
      {surveyFormData &&
      surveyFormData.questions &&
      surveyResponses.length > 0 ? (
        renderResponses()
      ) : (
        <Message warning className="warning">
          <Message.Header>No survey responses available</Message.Header>
          <p>
            There are no responses to display at the moment. Please check back
            later.
          </p>
        </Message>
      )}
    </Container>
  );
}

export default SurveyResponses;

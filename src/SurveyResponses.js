import React, { useEffect, useState } from "react";
import { Container, Segment, Header, Button } from "semantic-ui-react";

function SurveyResponses() {
  const [groupedResponses, setGroupedResponses] = useState({});

  useEffect(() => {
    // Retrieve survey responses from localStorage
    const savedResponses =
      JSON.parse(localStorage.getItem("surveyResponses")) || [];

    // Group responses by form title
    const grouped = savedResponses.reduce((acc, response) => {
      const formTitle =
        response.formTitle && response.formTitle.trim() !== ""
          ? response.formTitle
          : "Untitled Survey Form";
      if (!acc[formTitle]) {
        acc[formTitle] = [];
      }
      acc[formTitle].push(response);
      return acc;
    }, {});

    setGroupedResponses(grouped);
  }, []);

  const handleClearResponses = () => {
    // Clear the survey responses from localStorage
    localStorage.removeItem("surveyResponses");

    // Clear the local state
    setGroupedResponses({});
  };

  return (
    <Container>
      {/* Clear Responses Button */}
      <Button
        color="red"
        onClick={handleClearResponses}
        style={{ marginLeft: "750px" }}
      >
        Clear Survey Responses
      </Button>

      {Object.keys(groupedResponses).length > 0 ? (
        Object.keys(groupedResponses).map((formTitle, index) => (
          <Segment
            key={index}
            style={{ maxWidth: "650px", margin: "20px auto" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Header as="h3" color="red">
                {formTitle}
              </Header>
              <span style={{ fontSize: "1.2em", color: "gray" }}>
                Total Responses: {groupedResponses[formTitle].length}
              </span>
            </div>
            {groupedResponses[formTitle].map((response, responseIndex) => (
              <Segment
                key={responseIndex}
                style={{ maxWidth: "650px", margin: "10px auto" }}
              >
                <Header as="h4">Response {responseIndex + 1}</Header>
                {Array.isArray(response.responses) ? (
                  response.responses.map((answerObj, idx) => (
                    <div key={idx}>
                      <p>
                        <strong>Question ID {answerObj.question_id}:</strong>{" "}
                        {Array.isArray(answerObj.answer)
                          ? answerObj.answer.join(", ")
                          : answerObj.answer || "No answer provided"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No answers available</p>
                )}
              </Segment>
            ))}
          </Segment>
        ))
      ) : (
        <p>No survey responses available</p>
      )}
    </Container>
  );
}

export default SurveyResponses;

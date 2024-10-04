import React, { useEffect, useState } from "react";
import { Container, Segment, Header, Button } from "semantic-ui-react";

function FormResponses() {
  const [groupedResponses, setGroupedResponses] = useState({});

  useEffect(() => {
    // Retrieve form responses from localStorage
    const savedResponses =
      JSON.parse(localStorage.getItem("formResponses")) || [];

    // Group responses by form title
    const grouped = savedResponses.reduce((acc, response) => {
      const formTitle =
        response.formTitle && response.formTitle.trim() !== ""
          ? response.formTitle
          : "Untitled Form"; // Use 'formTitle' to group responses
      if (!acc[formTitle]) {
        acc[formTitle] = [];
      }
      acc[formTitle].push(response);
      return acc;
    }, {});

    setGroupedResponses(grouped);
  }, []);

  const handleClearResponses = () => {
    // Clear the form responses from localStorage
    localStorage.removeItem("formResponses");

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
        Clear Responses
      </Button>

      {Object.keys(groupedResponses).length > 0 ? (
        Object.keys(groupedResponses).map((formTitle, index) => (
          <Segment
            key={index}
            style={{ maxWidth: "650px", margin: "20px auto" }}
          >
            {/* Display form title with red color and response count */}
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
                {/* Reduce the width of the inner segments */}
                <Header as="h4">Response {responseIndex + 1}</Header>

                {/* Display each question and its answer */}
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
        <p>No responses available</p>
      )}
    </Container>
  );
}

export default FormResponses;

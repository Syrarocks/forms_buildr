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
      const formTitle = response.formTitle || "Untitled Form";
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
      <Header as="h2" textAlign="center">
        Form Responses
      </Header>

      {/* Clear Responses Button */}
      <Button color="red" onClick={handleClearResponses}>
        Clear Responses
      </Button>

      {Object.keys(groupedResponses).length > 0 ? (
        Object.keys(groupedResponses).map((formTitle, index) => (
          <Segment key={index}>
            <Header as="h3">{formTitle}</Header>
            {groupedResponses[formTitle].map((response, responseIndex) => (
              <Segment key={responseIndex}>
                <Header as="h4">Response {responseIndex + 1}</Header>

                {/* Display each question and its answer */}
                {response.responses &&
                  response.responses.map((answerObj, idx) => (
                    <div key={idx}>
                      <p>
                        <strong>Question ID {answerObj.question_id}:</strong>{" "}
                        {Array.isArray(answerObj.answer)
                          ? answerObj.answer.join(", ")
                          : answerObj.answer || "No answer provided"}
                      </p>
                    </div>
                  ))}
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

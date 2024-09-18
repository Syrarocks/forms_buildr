import React, { useEffect, useState } from "react";
import { Container, Header, Segment } from "semantic-ui-react";
import "./FormResponses.css"; // Import your custom CSS file

function FormResponses() {
  const [groupedResponses, setGroupedResponses] = useState({});

  useEffect(() => {
    // Retrieve form responses from localStorage
    const savedResponses =
      JSON.parse(localStorage.getItem("formResponses")) || [];

    // Group responses by form title
    const grouped = savedResponses.reduce((acc, response) => {
      const formTitle = response.title || "Untitled Form";
      if (!acc[formTitle]) {
        acc[formTitle] = [];
      }
      acc[formTitle].push(response);
      return acc;
    }, {});

    setGroupedResponses(grouped);

    // Log the saved responses to the console
    console.log("Grouped Responses by Form Title:", grouped);
  }, []);

  const renderAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.join(", ");
    } else if (typeof answer === "object" && answer !== null) {
      return answer.name || JSON.stringify(answer);
    } else {
      return answer || "No response submitted";
    }
  };

  return (
    <Container className="form-responses-container">
      <Header as="h3" textAlign="center" className="form-responses-header">
        Form Responses
      </Header>

      {Object.keys(groupedResponses).length > 0 ? (
        Object.keys(groupedResponses).map((formTitle, index) => (
          <Segment key={index} className="form-response-card">
            <Header as="h4" textAlign="center" className="response-header">
              {formTitle}
            </Header>

            {groupedResponses[formTitle].map((response, responseIndex) => (
              <Segment key={responseIndex} className="individual-response">
                <Header as="h5" textAlign="center">
                  Response {responseIndex + 1}
                </Header>
                {response.questions?.map((question, qIndex) => (
                  <Segment key={qIndex} className="question-card">
                    <Header as="h6" className="question-header">
                      {question.text || "Untitled Question"}
                    </Header>
                    <p className="response-answer">
                      {renderAnswer(response.answers?.[question.id])}
                    </p>
                  </Segment>
                ))}
              </Segment>
            ))}
          </Segment>
        ))
      ) : (
        <p className="no-responses-message">No form responses available.</p>
      )}
    </Container>
  );
}

export default FormResponses;

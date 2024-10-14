import React, { useEffect, useState } from "react";
import {
  Container,
  Segment,
  Header,
  Button,
  Form,
  Checkbox,
} from "semantic-ui-react";

// Function to format date and time in the "Sep 19 2:21 PM" format
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short", // e.g., "Sep"
    day: "numeric", // e.g., "19"
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric", // e.g., "2"
    minute: "2-digit", // e.g., "21"
    hour12: true, // for AM/PM format
  });
  return `${formattedDate} ${formattedTime}`;
};

// StarRating component to display filled stars based on rating
const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      style={{
        color: index < rating ? "gold" : "lightgray",
        fontSize: "40px", // Increased size
        marginRight: "5px", // Optional: Add some space between stars
      }}
    >
      ★
    </span>
  ));
  return <div>{stars}</div>;
};

function SurveyResponses() {
  const [groupedResponses, setGroupedResponses] = useState({});
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    // Retrieve survey responses from localStorage
    const savedResponses =
      JSON.parse(localStorage.getItem("surveyResponses")) || [];

    // Group responses by form_id
    const grouped = savedResponses.reduce((acc, response) => {
      const formId = response.form_id || "No ID"; // Use form_id instead of formTitle
      if (!acc[formId]) {
        acc[formId] = [];
      }
      acc[formId].push(response);
      return acc;
    }, {});

    // Set the grouped responses to state
    setGroupedResponses(grouped);
  }, []);

  const handleClearResponses = () => {
    // Clear the survey responses from localStorage
    localStorage.removeItem("surveyResponses");

    // Clear the local state
    setGroupedResponses({});
    setSelectedResponse(null);
  };

  const handleViewResponse = (response) => {
    setSelectedResponse(response); // Set the selected response
  };

  // Render question options based on type
  const renderQuestionOptions = (response) => {
    return response.responses.map((answer, index) => (
      <Form.Field key={index} style={{ marginBottom: "1.5em" }}>
        <label>{answer.question_text}</label>
        {(() => {
          switch (answer.question_type) {
            case "text":
              return (
                <input
                  value={answer.answer}
                  readOnly
                  disabled
                  style={{
                    backgroundColor: "#d9efc8",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                />
              );
            case "checkboxes":
              return (
                <div>
                  {answer.options.map((option, index) => (
                    <Form.Field
                      key={index}
                      style={{
                        marginBottom: "0.5em",
                        backgroundColor: answer.answer.includes(option.label)
                          ? "#d9efc8" // Color for selected checkboxes
                          : "transparent",
                        padding: "5px", // Adding padding for visual separation
                        borderRadius: "5px", // Rounded corners for better UI
                        color: answer.answer.includes(option.label)
                          ? "#000"
                          : "#000", // Text color
                        fontWeight: answer.answer.includes(option.label)
                          ? "bold"
                          : "normal", // Make selected options bold
                      }}
                    >
                      <Checkbox
                        label={option.label}
                        checked={
                          Array.isArray(answer.answer) &&
                          answer.answer.includes(option.label)
                        }
                        readOnly
                        disabled
                      />
                    </Form.Field>
                  ))}
                </div>
              );

            case "rating":
              return <StarRating rating={answer.answer} />;
            default:
              return null;
          }
        })()}
      </Form.Field>
    ));
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

      {selectedResponse ? (
        // Display the selected response's details
        <Segment style={{ maxWidth: "650px", margin: "20px auto" }}>
          <Header as="h3" color="red">
            Form ID: {selectedResponse.form_id}
          </Header>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>
              <strong>Name:</strong> {selectedResponse.name}
            </p>
            <p>
              <strong>Submitted At:</strong>{" "}
              {formatDateTime(selectedResponse.submittedAt)}
            </p>
          </div>

          {/* Render the response details */}
          <Form>{renderQuestionOptions(selectedResponse)}</Form>
          <Button
            onClick={() => setSelectedResponse(null)}
            style={{ backgroundColor: "black", color: "white" }}
          >
            Back
          </Button>
        </Segment>
      ) : (
        // Display the list of survey responses
        <>
          {Object.keys(groupedResponses).length > 0 ? (
            Object.keys(groupedResponses).map((formId, index) => (
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
                    Form ID: {formId}
                  </Header>
                  <span style={{ fontSize: "1.2em", color: "gray" }}>
                    Total Responses: {groupedResponses[formId].length}
                  </span>
                </div>
                {groupedResponses[formId].map((response, responseIndex) => (
                  <Segment
                    key={responseIndex}
                    style={{ maxWidth: "650px", margin: "10px auto" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>
                        <strong>Name:</strong> {response.name}
                      </p>

                      <p style={{ color: "gray", fontSize: "1.1em" }}>
                        <strong>Submitted At:</strong>{" "}
                        {formatDateTime(response.submittedAt)}
                      </p>
                    </div>

                    <Button
                      onClick={() => handleViewResponse(response)}
                      style={{ marginTop: "1em" }}
                    >
                      View Response
                    </Button>
                  </Segment>
                ))}
              </Segment>
            ))
          ) : (
            <p>No survey responses available</p>
          )}
        </>
      )}
    </Container>
  );
}

export default SurveyResponses;

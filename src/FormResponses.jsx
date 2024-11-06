import React, { useEffect, useState } from "react";
import {
  Container,
  Segment,
  Header,
  Button,
  Form,
  Checkbox,
  Radio,
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

const FormResponses = () => {
  const [groupedResponses, setGroupedResponses] = useState({});
  const [selectedResponse, setSelectedResponse] = useState(null);

  useEffect(() => {
    // Retrieve form responses from localStorage
    const savedResponses =
      JSON.parse(localStorage.getItem("formResponses")) || [];

    // Group responses by form title
    const grouped = savedResponses.reduce((acc, response) => {
      const formTitle = response.form_id || "Untitled Form";
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
    setSelectedResponse(null);
  };

  const handleViewResponse = (response) => {
    // Set selected response and prevent it from being selected again
    setSelectedResponse(response);
  };

  const renderQuestionOptions = (question) => {
    switch (question.question_type) {
      case "multipleChoice":
        return (
          <div>
            {question.options.map((option, index) => (
              <Form.Field
                key={index}
                style={{
                  marginBottom: "0.5em",
                  backgroundColor:
                    question.answer === option.label
                      ? "#d9efc8"
                      : "transparent",
                  padding: "5px",
                  borderRadius: "5px",
                  color: question.answer === option.label ? "#000" : "#000",
                  fontWeight:
                    question.answer === option.label ? "bold" : "normal",
                }}
              >
                <Radio
                  label={option.label}
                  checked={question.answer === option.label}
                  readOnly
                  disabled
                />
              </Form.Field>
            ))}
          </div>
        );
      case "checkboxes":
        return (
          <div>
            {question.options.map((option, index) => (
              <Form.Field
                key={index}
                style={{
                  marginBottom: "0.5em",
                  backgroundColor: question.answer.includes(option.label)
                    ? "#d9efc8"
                    : "transparent",
                  padding: "5px",
                  borderRadius: "5px",
                  color: question.answer.includes(option.label)
                    ? "#000"
                    : "#000",
                  fontWeight: question.answer.includes(option.label)
                    ? "bold"
                    : "normal",
                }}
              >
                <Checkbox
                  label={option.label}
                  checked={
                    Array.isArray(question.answer) &&
                    question.answer.includes(option.label)
                  }
                  readOnly
                  disabled
                />
              </Form.Field>
            ))}
          </div>
        );
      case "dropdown":
        return (
          <Form.Select
            fluid
            selection
            options={question.options.map((option) => ({
              key: option.label,
              text: option.label,
              value: option.label,
            }))}
            value={question.answer}
            disabled
            style={{
              backgroundColor: "#d9efc8",
              color: "#000",
              fontWeight: "bold",
            }}
          />
        );
      case "text":
        return (
          <input
            value={question.answer}
            readOnly
            disabled
            style={{
              backgroundColor: "#d9efc8",
              color: "#000",
              fontWeight: "bold",
            }}
          />
        );
      case "date":
        return (
          <input
            type="date"
            value={question.answer}
            readOnly
            disabled
            style={{
              backgroundColor: "#d9efc8",
              color: "#000",
              fontWeight: "bold",
            }}
          />
        );
      default:
        return null;
    }
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
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>
              <strong>Roll No:</strong> {selectedResponse.rollNo}
            </p>
          </div>

          <div style={{ marginBottom: "20px" }}></div>

          <Form>
            {Array.isArray(selectedResponse.responses) &&
              selectedResponse.responses.map((question, idx) => (
                <Form.Field key={idx} style={{ marginBottom: "1.5em" }}>
                  <label style={{ color: "#000", fontWeight: "bold" }}>
                    {question.question_text}
                  </label>
                  {renderQuestionOptions(question)}
                </Form.Field>
              ))}
          </Form>
          <Button
            onClick={() => {
              // Reset the selected response when going back
              setSelectedResponse(null);
            }} // Set selectedResponse to null to go back
            style={{ backgroundColor: "black", color: "white" }}
          >
            Back
          </Button>
        </Segment>
      ) : (
        // Display the list of form responses grouped by form title
        <>
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
                  <span style={{ fontSize: "1em", color: "black" }}>
                    <strong>Total Responses:</strong>
                    <span
                      style={{
                        backgroundColor: "rgb(6 6 6)",
                        color: "rgb(251 250 250)",
                        borderRadius: "67%",
                        padding: "6px",
                        width: "30px",
                        height: "30px",
                        display: "inline-block",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {groupedResponses[formTitle]?.length || 0}
                    </span>
                  </span>
                </div>
                {groupedResponses[formTitle]?.map((response, responseIndex) => (
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

                      <p style={{ color: "black", fontSize: "1em" }}>
                        <strong>Submitted At:</strong>{" "}
                        {formatDateTime(response.submittedAt)}
                      </p>
                    </div>

                    <p>
                      <strong>Roll No:</strong> {response.rollNo}
                    </p>

                    <Button
                      onClick={() => handleViewResponse(response)} // Set selected response
                      style={{ marginTop: "1em" }}
                    >
                      View Response
                    </Button>
                  </Segment>
                ))}
              </Segment>
            ))
          ) : (
            <p>No responses available</p>
          )}
        </>
      )}
    </Container>
  );
};

export default FormResponses;

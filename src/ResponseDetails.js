import React from "react";
import {
  Container,
  Header,
  Segment,
  Button,
  Form,
  Checkbox,
} from "semantic-ui-react";
import { useLocation } from "react-router-dom";

// Function to format date and time
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
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
        fontSize: "30px",
        marginRight: "5px",
      }}
    >
      ★
    </span>
  ));
  return <div>{stars}</div>;
};

const ResponseDetails = () => {
  const location = useLocation(); // Use useLocation to access the location prop
  const response = location.state?.response; // Safely access response data

  // If response is not available, render a message
  if (!response) {
    return (
      <Container>
        <Header as="h3" color="red">
          Response Not Found
        </Header>
        <Button
          onClick={() => window.history.back()}
          style={{ backgroundColor: "lightgrey", color: "black" }}
        >
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Segment style={{ maxWidth: "650px", margin: "20px auto" }}>
        <Header as="h3" color="red">
          Response Details for {response.name}
        </Header>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>
            <strong>Name:</strong> {response.name}
          </p>
          <p>
            <strong>Submitted At:</strong>{" "}
            {formatDateTime(response.submittedAt)}
          </p>
        </div>
        <Form>
          {response.responses.map((answer, index) => (
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
                        {answer.options.map((option, optionIndex) => (
                          <Form.Field
                            key={optionIndex}
                            style={{
                              marginBottom: "0.5em",
                              backgroundColor: answer.answer.includes(
                                option.label
                              )
                                ? "#d9efc8"
                                : "transparent",
                              padding: "5px",
                              borderRadius: "5px",
                              color: answer.answer.includes(option.label)
                                ? "#000"
                                : "#000",
                              fontWeight: answer.answer.includes(option.label)
                                ? "bold"
                                : "normal",
                            }}
                          >
                            <Checkbox
                              label={option.label}
                              checked={answer.answer.includes(option.label)}
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
          ))}
        </Form>
        <Button
          onClick={() => window.history.back()} // Go back to the previous page
          style={{ backgroundColor: "lightgrey", color: "black" }}
        >
          Back
        </Button>
      </Segment>
    </Container>
  );
};

export default ResponseDetails;

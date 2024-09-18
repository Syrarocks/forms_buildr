import React, { useState, useEffect } from "react";
import {
  Container,
  Header,
  Divider,
  List,
  Checkbox,
  Form,
  Button,
  Rating,
  Message,
  Segment,
} from "semantic-ui-react";

function ViewForm({ formData, onSubmit }) {
  const [responses, setResponses] = useState({});
  const [error, setError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Initialize the responses state with appropriate default values
  useEffect(() => {
    if (formData && formData.questions) {
      const initialResponses = {};
      formData.questions.forEach((question) => {
        if (question.type === "checkboxes") {
          initialResponses[question.id] = []; // Initialize checkboxes with an empty array
        } else if (question.type === "ratings") {
          initialResponses[question.id] = 0; // Initialize ratings with 0
        } else {
          initialResponses[question.id] = ""; // Initialize text fields with an empty string
        }
      });
      setResponses(initialResponses);
    }
  }, [formData]);

  // Handle changes in response data
  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleCheckboxChange = (questionId, optionLabel) => {
    setResponses((prevResponses) => {
      const prevOptions = prevResponses[questionId] || [];
      const newOptions = prevOptions.includes(optionLabel)
        ? prevOptions.filter((option) => option !== optionLabel)
        : [...prevOptions, optionLabel];
      return {
        ...prevResponses,
        [questionId]: newOptions,
      };
    });
  };

  // Submit the responses and validate required fields
  const handleSubmitResponses = () => {
    let hasBlankOption = false;

    for (const question of formData.questions) {
      if (
        question.required &&
        (!responses[question.id] ||
          (Array.isArray(responses[question.id]) &&
            responses[question.id].length === 0))
      ) {
        setError("Please answer all required questions.");
        hasBlankOption = true;
        break;
      }
    }

    if (!hasBlankOption) {
      if (onSubmit) {
        onSubmit(responses);
      }
      setSubmissionSuccess(true); // Set success to true after submission
    }
  };

  // Render the questions based on their type
  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Form.Input
            fluid
            label={question.questionText}
            value={responses[question.id] || ""}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            placeholder="Your Answer"
            disabled={submissionSuccess}
          />
        );
      case "checkboxes":
        return (
          <>
            <Header as="h5" content={question.questionText} />
            <List>
              {question.checkboxOptions.map((option, index) => (
                <List.Item key={index}>
                  <Checkbox
                    label={option.label}
                    checked={(responses[question.id] || []).includes(
                      option.label
                    )}
                    onChange={() =>
                      handleCheckboxChange(question.id, option.label)
                    }
                    disabled={submissionSuccess}
                  />
                </List.Item>
              ))}
            </List>
            {submissionSuccess && (
              <p>
                <strong>Selected:</strong>{" "}
                {(responses[question.id] || []).join(", ")}
              </p>
            )}
          </>
        );
      case "ratings":
        return (
          <>
            <Header as="h5" content={question.questionText} />
            <Rating
              icon="star"
              defaultRating={responses[question.id] || 0}
              maxRating={5}
              onRate={(e, { rating }) =>
                handleResponseChange(question.id, rating)
              }
              disabled={submissionSuccess}
            />
            {submissionSuccess && (
              <p>
                <strong>Rating:</strong> {responses[question.id]}
              </p>
            )}
          </>
        );
      default:
        return null;
    }
  };

  // Render the submitted answers
  const renderSubmittedAnswers = () =>
    formData.questions.map((question) => (
      <Segment key={question.id}>
        <Header as="h5">{question.questionText}</Header>
        {renderQuestion(question)}
      </Segment>
    ));

  // Return the complete form UI
  return (
    <Container text>
      <Segment padded>
        <Header as="h2" dividing>
          {formData.title}
        </Header>
        <p>{formData.description}</p>
        <Divider />

        {submissionSuccess ? (
          <>
            <Message positive>
              <Message.Header>Your response has been submitted.</Message.Header>
            </Message>
            <Header as="h3">Your Responses</Header>
            {renderSubmittedAnswers()}
          </>
        ) : (
          <>
            {formData.questions.map((question) => (
              <Segment key={question.id}>{renderQuestion(question)}</Segment>
            ))}
            {error && <Message negative>{error}</Message>}
            <Button color="blue" onClick={handleSubmitResponses}>
              Submit Responses
            </Button>
          </>
        )}
      </Segment>
    </Container>
  );
}

export default ViewForm;

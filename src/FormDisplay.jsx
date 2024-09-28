import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  Message,
  Segment,
  Header,
} from "semantic-ui-react";
import { useLocation } from "react-router-dom";

function FormDisplay() {
  const location = useLocation();
  const formData = location.state?.form || {}; // Access the form data
  const [responses, setResponses] = useState({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formData && formData.questions) {
      const initialResponses = {};
      formData.questions.forEach((question) => {
        initialResponses[question.id] =
          question.type === "checkboxes" ? [] : "";
      });
      setResponses(initialResponses);
    }
  }, [formData]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmitResponses = (e) => {
    e.preventDefault();
    let hasBlankOption = false;

    // Check for any required fields that are not answered
    formData.questions.forEach((question) => {
      if (
        question.required &&
        (responses[question.id] === "" ||
          (Array.isArray(responses[question.id]) &&
            responses[question.id].length === 0))
      ) {
        setError("Please answer all required questions.");
        hasBlankOption = true;
      }
    });

    if (!hasBlankOption) {
      // Create an array of response objects directly
      const submissionData = {
        responses: formData.questions.map((question) => ({
          question_id: question.id,
          answer: responses[question.id],
        })),
      };

      // Retrieve existing responses from local storage or initialize an empty array
      const savedResponses =
        JSON.parse(localStorage.getItem("formResponses")) || [];

      // Add the new submission data
      savedResponses.push(submissionData);

      // Save the updated responses array back to local storage
      localStorage.setItem("formResponses", JSON.stringify(savedResponses));

      // Display the stored responses in the console
      console.log("Submitted Form Data:", submissionData);

      setSubmitted(true);
      setError("");
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            <input
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          </Form.Field>
        );
      case "multipleChoice":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            {question.options.map((option) => (
              <Form.Radio
                key={option.label}
                label={option.label}
                value={option.label}
                checked={responses[question.id] === option.label}
                onChange={(e, { value }) =>
                  handleResponseChange(question.id, value)
                }
              />
            ))}
          </Form.Field>
        );
      case "checkboxes":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            {question.options.map((option) => (
              <Form.Checkbox
                key={option.label}
                label={option.label}
                checked={(responses[question.id] || []).includes(option.label)}
                onChange={(e, { checked }) => {
                  const newResponses = checked
                    ? [...(responses[question.id] || []), option.label]
                    : (responses[question.id] || []).filter(
                        (item) => item !== option.label
                      );
                  handleResponseChange(question.id, newResponses);
                }}
              />
            ))}
          </Form.Field>
        );
      case "dropdown":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            <Form.Select
              options={question.options.map((option) => ({
                key: option.label,
                value: option.label,
                text: option.label,
              }))}
              value={responses[question.id] || ""}
              onChange={(e, { value }) =>
                handleResponseChange(question.id, value)
              }
              placeholder="Select an option"
            />
          </Form.Field>
        );
      case "date":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            <input
              type="date"
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          </Form.Field>
        );
      default:
        return null;
    }
  };

  return (
    <Container style={{ maxWidth: "750px", margin: "auto", marginTop: "50px" }}>
      <Segment style={{ maxWidth: "650px", margin: "20px auto" }}>
        {/* Reduced the width of the segment */}
        <Header as="h2">{formData.title}</Header>
        {formData.description && <p>{formData.description}</p>}
        <Form onSubmit={handleSubmitResponses}>
          {formData.questions &&
            formData.questions.map((question) => (
              <div key={question.id} style={{ marginBottom: "1.5em" }}>
                {renderQuestion(question)}
              </div>
            ))}
          {error && <Message error content={error} />}
          <Button type="submit" primary>
            Submit Responses
          </Button>
        </Form>
      </Segment>
      {submitted && (
        <Message positive>
          <Message.Header>
            Your response has been successfully submitted!
          </Message.Header>
        </Message>
      )}
    </Container>
  );
}

export default FormDisplay;

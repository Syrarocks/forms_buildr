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
  const location = useLocation(); // Get the form data passed through state
  const formData = location.state?.form || {}; // Access the form data
  const [responses, setResponses] = useState({});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Initialize responses with empty values or arrays for checkboxes
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

    // Validate required questions
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
      // Retrieve existing responses from localStorage
      const savedResponses =
        JSON.parse(localStorage.getItem("formResponses")) || [];

      // Store the new response
      savedResponses.push({
        formId: formData.id,
        formTitle: formData.title,
        questions: formData.questions,
        answers: responses,
      });

      // Save the updated responses to localStorage
      localStorage.setItem("formResponses", JSON.stringify(savedResponses));

      console.log("Submitted Responses:", responses);

      setSubmitted(true);
      setError(""); // Clear any previous error messages
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Form.Field key={question.id}>
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
          <Form.Field key={question.id}>
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
          <Form.Field key={question.id}>
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
      default:
        return null;
    }
  };

  return (
    <Container style={{ maxWidth: "600px", margin: "auto" }}>
      <Segment>
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

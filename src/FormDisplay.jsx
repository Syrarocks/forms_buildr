import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Form,
  Message,
  Radio,
  Select,
  TextArea,
  Container,
  Segment,
  Header,
} from "semantic-ui-react";

function FormDisplay({ formData, userResponses, onSubmit }) {
  const [responses, setResponses] = useState(userResponses || {});
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (formData && formData.questions) {
      const initialResponses = {};
      formData.questions.forEach((question) => {
        initialResponses[question.id] =
          question.type === "checkboxes" ? [] : "";
      });
      setResponses(userResponses || initialResponses);
    }
  }, [formData, userResponses]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmitResponses = (e) => {
    e.preventDefault(); // Prevent default form behavior
    let hasBlankOption = false;

    for (const question of formData.questions) {
      if (
        question.required &&
        (responses[question.id] === "" ||
          (Array.isArray(responses[question.id]) &&
            responses[question.id].length === 0))
      ) {
        setError("Please answer all required questions.");
        hasBlankOption = true;
        break;
      }
    }

    if (!hasBlankOption) {
      const savedResponses =
        JSON.parse(localStorage.getItem("formResponses")) || [];
      savedResponses.push({
        questions: formData.questions,
        answers: responses,
      });
      localStorage.setItem("formResponses", JSON.stringify(savedResponses));

      // Log the submitted responses to the console
      console.log("Submitted Responses:", responses);

      if (onSubmit) {
        onSubmit(responses);
      }
      setSubmitted(true);
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            <TextArea
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
              readOnly={!!userResponses}
            />
          </Form.Field>
        );
      case "multipleChoice":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            {question.options.map((option, index) => (
              <Form.Field key={index}>
                <Radio
                  label={option.label}
                  name={question.id}
                  value={option.label}
                  checked={responses[question.id] === option.label}
                  onChange={(e, { value }) =>
                    handleResponseChange(question.id, value)
                  }
                  readOnly={!!userResponses}
                />
              </Form.Field>
            ))}
          </Form.Field>
        );
      case "checkboxes":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            {question.options.map((option, index) => (
              <Form.Field key={index}>
                <Checkbox
                  label={option.label}
                  checked={(responses[question.id] || []).includes(
                    option.label
                  )}
                  onChange={(e, { checked }) => {
                    const newValue = checked
                      ? [...(responses[question.id] || []), option.label]
                      : (responses[question.id] || []).filter(
                          (item) => item !== option.label
                        );
                    handleResponseChange(question.id, newValue);
                  }}
                  readOnly={!!userResponses}
                />
              </Form.Field>
            ))}
          </Form.Field>
        );
      case "dropdown":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            <Select
              options={question.options.map((option) => ({
                key: option.label,
                text: option.label,
                value: option.label,
              }))}
              value={responses[question.id] || ""}
              onChange={(e, { value }) =>
                handleResponseChange(question.id, value)
              }
              disabled={!!userResponses}
            />
          </Form.Field>
        );
      case "fileUpload":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            <Button
              as="label"
              htmlFor={question.id}
              type="button"
              secondary
              style={{
                padding: "8px 16px",
                maxWidth: "150px",
                width: "100%",
                color: "white",
              }}
            >
              Upload File
            </Button>
            <input
              id={question.id}
              type="file"
              hidden
              onChange={(e) =>
                handleResponseChange(question.id, e.target.files[0])
              }
              disabled={!!userResponses}
            />
            {responses[question.id] && (
              <p>Uploaded file: {responses[question.id].name}</p>
            )}
          </Form.Field>
        );
      case "date":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            <input
              type="date"
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
              disabled={!!userResponses}
            />
            {responses[question.id] && (
              <p>Selected date: {responses[question.id]}</p>
            )}
          </Form.Field>
        );
      default:
        return null;
    }
  };

  return (
    <Container style={{ maxWidth: "600px", margin: "auto" }}>
      <Segment raised style={{ maxWidth: "600px", margin: "auto" }}>
        {!submitted && (
          <>
            <Header as="h2" textAlign="center">
              {formData.title}
            </Header>
            <p>{formData.description}</p>
          </>
        )}
        {submitted ? (
          <Message positive>
            <Message.Header>
              Your response has been successfully submitted!
            </Message.Header>
            <p>Here are your responses:</p>
            {formData.questions.map((question) => (
              <Segment key={question.id}>
                <Header as="h5">{question.text}</Header>
                <p>
                  <strong>Your answer:</strong>{" "}
                  {Array.isArray(responses[question.id])
                    ? responses[question.id].join(", ")
                    : responses[question.id]}
                </p>
              </Segment>
            ))}
          </Message>
        ) : (
          <Form onSubmit={handleSubmitResponses}>
            {formData.questions.map((question) => (
              <div key={question.id} style={{ marginBottom: "1.5em" }}>
                {renderQuestion(question)}
              </div>
            ))}
            {error && <Message error content={error} />}
            {!userResponses && (
              <Button type="submit" primary style={{ marginTop: "1.5em" }}>
                Submit Responses
              </Button>
            )}
          </Form>
        )}
      </Segment>
    </Container>
  );
}

export default FormDisplay;

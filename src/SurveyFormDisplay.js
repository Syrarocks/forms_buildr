import React, { useEffect, useState } from "react";
import {
  Container,
  Segment,
  Header,
  Form,
  Checkbox,
  Rating,
  Input,
  Button,
  Message,
} from "semantic-ui-react";
import { useLocation } from "react-router-dom";

function SurveyFormDisplay() {
  const location = useLocation();
  const formData = location.state?.form || {}; // Access the survey form data
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

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
      }, 5000); // 6000 milliseconds = 6 seconds

      // Cleanup timer if the component is unmounted or if submitted changes
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleResponseChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  const handleSubmitResponses = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    let hasBlankOption = false;
    let errorMessage = "Please fill out all fields before submitting."; // General error message

    // Check if any field is empty or unselected
    formData.questions.forEach((question) => {
      const answer = responses[question.id];

      // Handle check for empty fields across different question types
      if (question.type === "checkboxes" && Array.isArray(answer)) {
        if (answer.length === 0) {
          hasBlankOption = true;
        }
      } else if (!answer || answer.trim() === "") {
        hasBlankOption = true;
      }
    });

    if (hasBlankOption) {
      // Set the error message to inform the user that all fields must be filled
      setError(errorMessage);
    } else {
      // If all fields are filled, proceed with form submission
      const submissionData = {
        formTitle: formData.title || "Untitled Survey Form",
        responses: formData.questions.map((question) => ({
          question_id: question.id,
          answer: responses[question.id],
        })),
      };

      // Retrieve existing responses from local storage or initialize an empty array
      const savedResponses =
        JSON.parse(localStorage.getItem("surveyResponses")) || [];

      // Add the new submission data
      savedResponses.push(submissionData);

      // Save the updated responses array back to local storage
      localStorage.setItem("surveyResponses", JSON.stringify(savedResponses));

      // Display the stored responses in the console
      console.log("Submitted Survey Form Data:", submissionData);

      setSubmitted(true);
      setError(""); // Clear any existing error
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            <Input
              value={responses[question.id] || ""}
              onChange={(e) =>
                handleResponseChange(question.id, e.target.value)
              }
            />
          </Form.Field>
        );
      case "checkboxes":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            {question.options.map((option) => (
              <Checkbox
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
      case "rating":
        return (
          <Form.Field key={question.id} required={question.required}>
            <label>{question.text}</label>
            <Rating
              maxRating={5}
              rating={responses[question.id] || 0}
              onRate={(e, { rating }) =>
                handleResponseChange(question.id, rating)
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
            Submit Survey Responses
          </Button>
        </Form>
      </Segment>
      {submitted && (
        <Message positive style={{ maxWidth: "650px", margin: "20px auto" }}>
          <Message.Header>
            Your response has been successfully submitted!
          </Message.Header>
        </Message>
      )}
    </Container>
  );
}

export default SurveyFormDisplay;

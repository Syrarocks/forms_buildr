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
  const [name, setName] = useState(""); // State to track the user's name
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
      }, 5000); // 5000 milliseconds = 5 seconds

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
    let errorMessage = "Please fill out all required fields before submitting."; // General error message

    // Check if any required question is empty or unselected
    formData.questions.forEach((question) => {
      const answer = responses[question.id];

      if (question.required) {
        // Handle check for required fields across different question types
        if (question.type === "checkboxes" && Array.isArray(answer)) {
          if (answer.length === 0) {
            hasBlankOption = true;
          }
        } else if (typeof answer === "string" && answer.trim() === "") {
          hasBlankOption = true;
        } else if (typeof answer !== "string" && !answer) {
          // Handle cases where answer is not a string (e.g., for ratings)
          hasBlankOption = true;
        }
      }
    });

    if (!name.trim()) {
      // Check if the name is empty
      hasBlankOption = true;
      errorMessage = "Please enter your name.";
    }

    if (hasBlankOption) {
      // Set the error message to inform the user that all fields must be filled
      setError(errorMessage);
    } else {
      // If all fields are filled, proceed with form submission
      const submissionData = {
        form_id: formData.id || formData.form_id || "form-" + Date.now(),
        title: formData.title, // Include the title in the submission data
        name, // Include the name in the submission data
        submittedAt: new Date().toISOString(), // Store the submission timestamp
        responses: formData.questions.map((question) => ({
          question_id: question.id,
          question_text: question.text, // Add question text
          question_type: question.type, // Add question type
          options: question.options || [], // Include options if available
          answer: responses[question.id], // Store the answer
        })),
      };

      // Log the form ID and the submission data
      console.log("Submitted Survey Form Data:", submissionData);

      // Retrieve existing responses from local storage or initialize an empty array
      const savedResponses =
        JSON.parse(localStorage.getItem("surveyResponses")) || [];

      // Add the new submission data
      savedResponses.push(submissionData);

      // Save the updated responses array back to local storage
      localStorage.setItem("surveyResponses", JSON.stringify(savedResponses));

      // Reset the form state after submission
      setSubmitted(true);
      setError(""); // Clear any existing error
      setName(""); // Reset the name field
      // Reset responses to initial state
      const initialResponses = {};
      formData.questions.forEach((question) => {
        initialResponses[question.id] =
          question.type === "checkboxes" ? [] : "";
      });
      setResponses(initialResponses); // Reset the responses
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
            <label style={{ marginBottom: "10px" }}>{question.text}</label>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {question.options.map((option) => (
                <div key={option.label} style={{ marginBottom: "8px" }}>
                  <Checkbox
                    label={option.label}
                    checked={(responses[question.id] || []).includes(
                      option.label
                    )}
                    onChange={(e, { checked }) => {
                      const newResponses = checked
                        ? [...(responses[question.id] || []), option.label]
                        : (responses[question.id] || []).filter(
                            (item) => item !== option.label
                          );
                      handleResponseChange(question.id, newResponses);
                    }}
                  />
                </div>
              ))}
            </div>
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
              icon="star" // Change icon to star
              size="huge" // Increase the size of the stars
              style={{ color: "gold" }} // Change star color to golden yellow
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
          {/* Name Input Field */}
          <Form.Field required>
            <label>Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </Form.Field>

          {/* Render Survey Questions */}
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

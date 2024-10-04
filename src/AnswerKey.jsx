import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  Segment,
  Header,
  Icon,
  List,
} from "semantic-ui-react";
import { useLocation } from "react-router-dom";

function AnswerKey() {
  const location = useLocation();

  // Extract the form title and questions from the location's state
  const { questions: initialQuestions = [] } = location.state || {
    questions: [],
  };

  const [questions, setQuestions] = useState(initialQuestions || []);
  const [submitted, setSubmitted] = useState(false);
  const [savedAnswerKeys, setSavedAnswerKeys] = useState([]);

  // Load previously saved answer keys from localStorage on component mount
  useEffect(() => {
    const savedKeys = JSON.parse(localStorage.getItem("answerKeys")) || [];
    setSavedAnswerKeys(savedKeys);
  }, []);

  // Handle answer change for each question
  const handleSetCorrectAnswer = (questionId, value) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? { ...question, correctAnswer: value }
        : question
    );
    setQuestions(updatedQuestions);
  };

  // Save the answer key in the required format in localStorage
  const handleSaveAnswerKey = () => {
    // Format the answer key as per the required format
    const answerKeyObject = {
      answer_key: questions.map((question) => ({
        question_id: question.id,
        answer: Array.isArray(question.correctAnswer)
          ? question.correctAnswer // Handle multiple answers for checkboxes
          : question.correctAnswer || "No answer provided",
      })),
    };

    // Save answer key in localStorage
    const storedAnswerKeys =
      JSON.parse(localStorage.getItem("answerKeys")) || [];
    storedAnswerKeys.push(answerKeyObject);
    localStorage.setItem("answerKeys", JSON.stringify(storedAnswerKeys));

    // Update the saved answer keys state
    setSavedAnswerKeys(storedAnswerKeys);

    // Log the answer key object to the console
    console.log(answerKeyObject);

    setSubmitted(true);
    alert("Answer key saved!");

    // Hide the success message after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case "text":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            <Form.Input
              placeholder="Enter the correct answer"
              value={question.correctAnswer || ""}
              onChange={(e) =>
                handleSetCorrectAnswer(question.id, e.target.value)
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
                checked={question.correctAnswer === option.label}
                onChange={(e, { value }) =>
                  handleSetCorrectAnswer(question.id, value)
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
                checked={
                  question.correctAnswer?.includes(option.label) || false
                }
                onChange={(e, { checked }) => {
                  const newCorrectAnswer = checked
                    ? [...(question.correctAnswer || []), option.label]
                    : question.correctAnswer.filter(
                        (item) => item !== option.label
                      );
                  handleSetCorrectAnswer(question.id, newCorrectAnswer);
                }}
              />
            ))}
          </Form.Field>
        );
      case "dropdown":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            <Form.Select
              options={question.options.map((option) => ({
                key: option.label,
                value: option.label,
                text: option.label,
              }))}
              value={question.correctAnswer || ""}
              onChange={(e, { value }) =>
                handleSetCorrectAnswer(question.id, value)
              }
              placeholder="Select the correct answer"
            />
          </Form.Field>
        );
      case "date":
        return (
          <Form.Field key={question.id}>
            <label>{question.text}</label>
            <Form.Input
              type="date"
              value={question.correctAnswer || ""}
              onChange={(e) =>
                handleSetCorrectAnswer(question.id, e.target.value)
              }
            />
          </Form.Field>
        );
      default:
        return null;
    }
  };

  return (
    <Container style={{ maxWidth: "650px", margin: "auto" }}>
      {!submitted && ( // Conditionally render the "Answer Key" input form
        <Segment style={{ maxWidth: "650px", margin: "auto" }}>
          <Header as="h2">Answer Key</Header>
          <Form>
            {questions.length > 0 ? (
              questions.map((question) => (
                <div key={question.id} style={{ marginBottom: "1.5em" }}>
                  {renderQuestion(question)}
                </div>
              ))
            ) : (
              <p>No questions available.</p>
            )}
            <Button type="button" color="green" onClick={handleSaveAnswerKey}>
              Save Answer Key
            </Button>
          </Form>
        </Segment>
      )}

      {submitted && (
        <Segment
          style={{ maxWidth: "650px", margin: "20px auto" }}
          color="green"
          inverted
        >
          <Header as="h4">
            <Icon name="check" />
            The answer key has been successfully saved!
          </Header>
        </Segment>
      )}

      {savedAnswerKeys.length > 0 && (
        <Segment style={{ maxWidth: "650px", margin: "auto" }}>
          <Header as="h3">Stored Answer Keys</Header>
          <List divided>
            {savedAnswerKeys.map((savedKey, idx) =>
              savedKey.answer_key && Array.isArray(savedKey.answer_key) ? (
                <Segment
                  key={idx}
                  style={{ maxWidth: "600px", margin: "auto" }}
                >
                  <Header as="h4">Answer Key {idx + 1}</Header>
                  {savedKey.answer_key.map((item, index) => (
                    <List.Item key={`${idx}-${index}`}>
                      <strong>Question ID: {item.question_id}</strong>
                      <br />
                      Answer:{" "}
                      {Array.isArray(item.answer)
                        ? item.answer.join(", ")
                        : item.answer}
                    </List.Item>
                  ))}
                </Segment>
              ) : null
            )}
          </List>
        </Segment>
      )}
    </Container>
  );
}

export default AnswerKey;

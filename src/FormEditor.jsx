import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Button,
  List,
  Icon,
  Input,
  Segment,
  Header,
  Form as SemanticForm,
} from "semantic-ui-react";
import QuestionCard from "./QuestionCard";

function FormEditor({ onSubmit }) {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const lastQuestionRef = useRef(null);

  // Load the form data from localStorage when the component mounts
  useEffect(() => {
    const savedFormData = JSON.parse(localStorage.getItem("savedFormData"));
    if (savedFormData) {
      setFormTitle(savedFormData.title || "");
      setFormDescription(savedFormData.description || "");
      setQuestions(savedFormData.questions || []);
    }
  }, []);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      type: "",
      text: "",
      options: [],
      required: false,
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

    // Scroll to the new question after it's added
    setTimeout(() => {
      if (lastQuestionRef.current) {
        lastQuestionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== id)
    );
  };

  const handleQuestionChange = (id, updatedProps) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, ...updatedProps } : question
      )
    );
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (formTitle.trim() === "") {
      setError("Form title is required.");
      return;
    }

    if (questions.length === 0) {
      setError("Please add at least one question.");
      return;
    }

    let hasError = false;
    for (const question of questions) {
      if (!question.text || question.text.trim() === "") {
        setError("All questions must have text.");
        hasError = true;
        break;
      }

      if (!question.type) {
        setError("Please select a question type for each question.");
        hasError = true;
        break;
      }

      if (
        ["multipleChoice", "checkboxes", "dropdown"].includes(question.type)
      ) {
        for (const option of question.options) {
          if (option.label.trim() === "") {
            setError("Options cannot be empty.");
            hasError = true;
            break;
          }
        }
      }
    }

    if (!hasError) {
      setError("");
      const formId = `form-${Date.now()}`;

      const formData = {
        id: formId,
        title: formTitle,
        description: formDescription,
        questions,
      };

      // Get existing forms from localStorage
      const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
      // Add the new form
      const updatedForms = [...storedForms, formData];
      // Save back to localStorage
      localStorage.setItem("forms", JSON.stringify(updatedForms));

      if (onSubmit) {
        onSubmit(formData);
      }

      // Clear the form fields after submission
      setFormTitle("");
      setFormDescription("");
      setQuestions([]);
    }
  };

  // Function to manually save form data to localStorage
  const handleSaveForm = () => {
    const formData = {
      title: formTitle,
      description: formDescription,
      questions,
    };
    localStorage.setItem("savedFormData", JSON.stringify(formData));
    alert("Form data saved!");
  };

  // Function to clear text, type, and options fields in the form
  const handleClearTextFields = () => {
    setFormTitle(""); // Clear form title
    setFormDescription(""); // Clear form description
    setQuestions([]); // Clear questions completely (including required fields)
    setError(""); // Clear any existing error messages
    localStorage.removeItem("savedFormData"); // Remove saved form data
  };

  return (
    <Container style={{ maxWidth: "600px", margin: "auto" }}>
      <Segment
        raised
        style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}
      >
        <SemanticForm onSubmit={handleSubmitForm}>
          <div style={{ marginBottom: "1em" }}>
            <label style={{ marginBottom: "5px", fontWeight: "bold" }}>
              Form Title
            </label>
            <Input
              fluid
              placeholder="Form Title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              error={!!error}
            />
          </div>

          <div style={{ marginBottom: "1em" }}>
            <label style={{ marginBottom: "5px", fontWeight: "bold" }}>
              Form Description
            </label>
            <Input
              fluid
              placeholder="Form Description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </div>

          {error && (
            <Header as="h4" color="red">
              {error}
            </Header>
          )}

          <List divided>
            {questions.map((question, index) => (
              <div
                key={question.id}
                ref={index === questions.length - 1 ? lastQuestionRef : null}
                style={{ marginBottom: "1em" }}
              >
                <List.Item>
                  <QuestionCard
                    question={question}
                    onChange={handleQuestionChange}
                    onDelete={() => handleDeleteQuestion(question.id)}
                  />
                </List.Item>
              </div>
            ))}
          </List>

          {/* Buttons aligned in one line */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              type="button"
              onClick={handleAddQuestion}
              icon
              labelPosition="left"
              color="green"
              style={{ marginBottom: "1em" }}
            >
              <Icon name="add" />
              Add Question
            </Button>

            <Button
              type="button"
              onClick={handleClearTextFields}
              color="orange"
              icon
              labelPosition="left"
              style={{ marginBottom: "1em" }}
            >
              <Icon name="delete" />
              Clear All Fields
            </Button>

            {/* Save Form Icon Button */}
            <Button
              type="button"
              onClick={handleSaveForm}
              color="blue"
              style={{ marginBottom: "1em" }}
            >
              Save Form
            </Button>

            <Button
              type="submit"
              primary
              icon
              labelPosition="left"
              style={{ marginBottom: "1em" }}
            >
              <Icon name="paper plane" />
              Submit
            </Button>
          </div>
        </SemanticForm>
      </Segment>
    </Container>
  );
}

export default FormEditor;

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Button,
  List,
  Icon,
  Input,
  Segment,
  Header,
  Form,
  Grid,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

function FormEditor({ onSubmit }) {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const lastQuestionRef = useRef(null);
  const navigate = useNavigate();

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
      id: questions.length + 1, // Ensure 'id' is set sequentially
      type: "",
      text: "",
      options: [],
      required: false,
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

    setTimeout(() => {
      if (lastQuestionRef.current) {
        lastQuestionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = questions
      .filter((question) => question.id !== questionId)
      .map((question, index) => ({
        ...question,
        id: index + 1, // Re-sequence 'id' after deletion
      }));
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (questionId, updatedProps) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId ? { ...question, ...updatedProps } : question
      )
    );
  };

  const handleTypeChange = (questionId, value) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? { ...question, type: value, options: [] }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    const updatedQuestions = questions.map((question) => {
      if (question.id === questionId) {
        const updatedOptions = question.options.map((opt, idx) =>
          idx === optionIndex ? { ...opt, label: value } : opt
        );
        return { ...question, options: updatedOptions };
      }
      return question;
    });
    setQuestions(updatedQuestions);
  };

  const addOption = (questionId) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? { ...question, options: [...question.options, { label: "" }] }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionId, optionIndex) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            options: question.options.filter((_, idx) => idx !== optionIndex),
          }
        : question
    );
    setQuestions(updatedQuestions);
  };

  const renderOptions = (question) => {
    if (["multipleChoice", "checkboxes", "dropdown"].includes(question.type)) {
      return (
        <div style={{ marginTop: "1em" }}>
          {question.options.map((option, index) => (
            <Form.Field key={index}>
              <Form.Input
                placeholder={`Option ${index + 1}`}
                value={option.label}
                onChange={(e) =>
                  handleOptionChange(question.id, index, e.target.value)
                }
                style={{ maxWidth: "400px", marginBottom: "1em" }}
                action={
                  <Button
                    icon
                    color="red"
                    onClick={() => removeOption(question.id, index)}
                  >
                    <Icon name="delete" />
                  </Button>
                }
              />
            </Form.Field>
          ))}
          <Button
            icon
            color="blue"
            onClick={() => addOption(question.id)}
            style={{ marginTop: "1em" }}
          >
            <Icon name="add" />
            Add Option
          </Button>
        </div>
      );
    }
    return null;
  };

  const renderQuestionInput = (question) => {
    if (question.type === "fileUpload") {
      return (
        <Form.Input
          type="file"
          style={{ marginTop: "1em" }}
          label="Upload a file"
        />
      );
    }

    if (question.type === "date") {
      return (
        <Form.Input
          type="date"
          style={{ marginTop: "1em" }}
          label="Select a date"
        />
      );
    }

    return null;
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

      // Create the form data object in the required format
      const formData = {
        form_id: formId,
        title: formTitle,
        description: formDescription,
        questions: questions.map((q) => ({
          id: q.id, // Use 'id' field
          type: q.type,
          text: q.text,
          options: q.options,
          required: q.required,
        })),
        // This will be filled later during the answer key creation
      };

      const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
      const updatedForms = [...storedForms, formData];
      localStorage.setItem("forms", JSON.stringify(updatedForms));

      // Log the form object to the console
      console.log("Form Data:", formData);

      if (onSubmit) {
        onSubmit(formData);
      }

      navigate("/answer-key", {
        state: {
          title: formTitle,
          description: formDescription,
          questions: questions.map(({ id, ...rest }) => ({
            id,
            ...rest,
          })),
        },
      });

      setFormTitle("");
      setFormDescription("");
      setQuestions([]);
    }
  };

  const handleSaveForm = () => {
    const formData = {
      form_id: `form-${Date.now()}`,
      title: formTitle,
      description: formDescription,
      questions: questions.map((q) => ({
        id: q.id,
        type: q.type,
        text: q.text,
        options: q.options,
        required: q.required,
      })),
    };
    localStorage.setItem("savedFormData", JSON.stringify(formData));
    alert("Form data saved!");
  };

  const handleClearTextFields = () => {
    setFormTitle("");
    setFormDescription("");
    setQuestions([]);
    setError("");
    localStorage.removeItem("savedFormData");
  };

  const handleAnswerKey = () => {
    navigate("/answer-key", {
      state: {
        title: formTitle,
        description: formDescription,
        questions: questions.map(({ id, ...rest }) => ({
          id,
          ...rest,
        })),
      },
    });
  };

  return (
    <Container style={{ maxWidth: "600px", margin: "auto" }}>
      <Segment
        raised
        style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}
      >
        <Form onSubmit={handleSubmitForm}>
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
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={10}>
                        <label style={{ fontWeight: "bold" }}>{`Question ${
                          index + 1
                        }`}</label>
                        <Form.Input
                          fluid
                          placeholder="Enter your question"
                          value={question.text}
                          onChange={(e) =>
                            handleQuestionChange(question.id, {
                              text: e.target.value,
                            })
                          }
                          style={{ marginBottom: "1em" }}
                        />
                      </Grid.Column>
                      <Grid.Column width={6}>
                        <Form.Select
                          fluid
                          label="Question Type"
                          options={[
                            { key: "text", value: "text", text: "Text" },
                            {
                              key: "multipleChoice",
                              value: "multipleChoice",
                              text: "Multiple Choice",
                            },
                            {
                              key: "checkboxes",
                              value: "checkboxes",
                              text: "Checkboxes",
                            },
                            {
                              key: "dropdown",
                              value: "dropdown",
                              text: "Dropdown",
                            },
                            {
                              key: "fileUpload",
                              value: "fileUpload",
                              text: "File Upload",
                            },
                            { key: "date", value: "date", text: "Date" },
                          ]}
                          value={question.type || ""}
                          onChange={(e, { value }) =>
                            handleTypeChange(question.id, value)
                          }
                          placeholder="Select Type"
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  {renderOptions(question)}
                  {renderQuestionInput(question)}

                  <Grid style={{ marginTop: "1em" }} verticalAlign="middle">
                    <Grid.Row columns={2}>
                      <Grid.Column>
                        <Form.Checkbox
                          label="Required"
                          checked={question.required || false}
                          onChange={(e, { checked }) =>
                            handleQuestionChange(question.id, {
                              required: checked,
                            })
                          }
                        />
                      </Grid.Column>
                      <Grid.Column textAlign="right">
                        <Icon
                          name="trash"
                          color="red"
                          size="large"
                          onClick={() => handleDeleteQuestion(question.id)}
                          style={{ cursor: "pointer" }}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </List.Item>
              </div>
            ))}
          </List>

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
              style={{ marginBottom: "1em" }}
            >
              <Icon name="add" />
              Add Question
            </Button>

            <Button
              type="button"
              onClick={handleAnswerKey}
              color="green"
              style={{ marginBottom: "1em" }}
            >
              Answer Key
            </Button>

            <Button
              type="button"
              onClick={handleSaveForm}
              color="black"
              style={{ marginBottom: "1em" }}
            >
              Save Form
            </Button>

            <Button
              type="button"
              onClick={handleClearTextFields}
              color="orange"
              style={{ marginBottom: "1em" }}
            >
              Clear Responses
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
        </Form>
      </Segment>
    </Container>
  );
}

export default FormEditor;

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
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const questionRefs = useRef([]);
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
      id: questions.length + 1,
      type: "",
      text: "",
      options: [],
      required: false,
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

    setTimeout(() => {
      questionRefs.current[questions.length]?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = questions
      .filter((question) => question.id !== questionId)
      .map((question, index) => ({
        ...question,
        id: index + 1,
      }));
    setQuestions(updatedQuestions);
    setErrors({});
  };

  const handleQuestionChange = (questionId, updatedProps) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId ? { ...question, ...updatedProps } : question
      )
    );

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (updatedProps.text) {
        delete newErrors[questionId - 1];
      }
      return newErrors;
    });
  };

  const handleTypeChange = (questionId, value) => {
    const updatedQuestions = questions.map((question) =>
      question.id === questionId
        ? {
            ...question,
            type: value,
            options: ["multipleChoice", "checkboxes", "dropdown"].includes(
              value
            )
              ? [{ label: "" }]
              : [],
          }
        : question
    );
    setQuestions(updatedQuestions);

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`type${questionId - 1}`];
      return newErrors;
    });
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

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (value.trim() !== "") {
        delete newErrors[questionId - 1];
      }
      return newErrors;
    });
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

  const handleSubmitForm = (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const newErrors = {};
    let firstErrorIndex = null;

    if (formTitle.trim() === "") {
      newErrors.formTitle = "Form title is required.";
    }

    if (questions.length === 0) {
      newErrors.general = "Please add at least one question.";
    } else {
      questions.forEach((question, index) => {
        if (!question.text || question.text.trim() === "") {
          newErrors[index] = "Question text is required.";
          if (firstErrorIndex === null) firstErrorIndex = index;
        } else if (!question.type) {
          newErrors[`type${index}`] = "Question type is required.";
          if (firstErrorIndex === null) firstErrorIndex = index;
        } else if (
          ["multipleChoice", "checkboxes", "dropdown"].includes(question.type)
        ) {
          for (const option of question.options) {
            if (option.label.trim() === "") {
              newErrors[index] = "All options must have text.";
              if (firstErrorIndex === null) firstErrorIndex = index;
              break;
            }
          }
        }
      });
    }

    setErrors(newErrors);

    if (firstErrorIndex !== null) {
      questionRefs.current[firstErrorIndex]?.scrollIntoView({
        behavior: "smooth",
      });
    }

    if (Object.keys(newErrors).length === 0) {
      const formId = `${Date.now()}`;

      const formData = {
        form_id: formId,
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

      console.log("Form Submitted:", formData);

      const storedForms = JSON.parse(localStorage.getItem("forms")) || [];
      const updatedForms = [...storedForms, formData];
      localStorage.setItem("forms", JSON.stringify(updatedForms));

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
      setErrors({});
      setHasSubmitted(false);
    }
  };

  const handleClearTextFields = () => {
    setFormTitle("");
    setFormDescription("");
    setQuestions([]);
    setErrors({});
    setHasSubmitted(false);
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

  const isFormValid = () => {
    if (!formTitle.trim()) return false;
    return questions.some(
      (question) => question.text.trim() !== "" && question.type
    );
  };

  const renderOptions = (question, questionIndex) => {
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
                style={{
                  maxWidth: "247px",
                  marginBottom: "1em",
                }}
                action={
                  <>
                    <Button
                      icon
                      color="blue"
                      onClick={() => addOption(question.id)}
                      style={{ marginLeft: "5px" }}
                    >
                      <Icon name="plus" />
                    </Button>
                    <Button
                      icon
                      color="grey"
                      onClick={() => removeOption(question.id, index)}
                    >
                      <Icon name="delete" />
                    </Button>
                  </>
                }
              />
            </Form.Field>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Container style={{ maxWidth: "600px", margin: "auto" }}>
      <Segment
        raised
        style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}
      >
        <div style={{ marginBottom: "1em" }}>
          <Input
            fluid
            placeholder="Untitled Form"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            style={{
              fontSize: "1.5em",
              fontWeight: formTitle ? "bold" : "normal",
              width: "40%",
            }}
          />
          {hasSubmitted && errors.formTitle && (
            <Header as="h4" color="red">
              {errors.formTitle}
            </Header>
          )}
        </div>

        <div style={{ marginBottom: "1em" }}>
          <Input
            fluid
            placeholder="Add a form description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            style={{ fontSize: "1.2em", fontStyle: "italic" }}
          />
        </div>

        {hasSubmitted && errors.general && (
          <Header as="h4" color="red">
            {errors.general}
          </Header>
        )}

        <Form onSubmit={handleSubmitForm}>
          <List divided>
            {questions.map((question, index) => (
              <div
                key={question.id}
                ref={(el) => (questionRefs.current[index] = el)}
                style={{ marginBottom: "1em" }}
              >
                <List.Item>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={10} style={{ paddingTop: "1.5em" }}>
                        <div style={{ minHeight: "1.5em" }}>
                          {hasSubmitted && errors[index] && (
                            <Header as="h4" color="red">
                              {errors[index]}
                            </Header>
                          )}
                        </div>
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
                          style={{
                            marginBottom: "1em",
                            backgroundColor:
                              hasSubmitted && errors[index] ? "#ffcccc" : "",
                          }}
                        />
                      </Grid.Column>
                      <Grid.Column width={6} style={{ paddingTop: "1.5em" }}>
                        <div style={{ minHeight: "1.5em" }}>
                          {hasSubmitted && errors[`type${index}`] && (
                            <Header as="h4" color="red">
                              {errors[`type${index}`]}
                            </Header>
                          )}
                        </div>
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
                          style={{
                            backgroundColor:
                              hasSubmitted && errors[`type${index}`]
                                ? "#ffcccc"
                                : "",
                          }}
                        />
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>

                  {renderOptions(question, index)}

                  <Grid style={{ marginTop: "2em" }} verticalAlign="middle">
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
              flexWrap: "wrap",
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

            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="button"
                onClick={handleClearTextFields}
                color="orange"
                style={{ marginBottom: "1em", marginRight: "10px" }}
              >
                Clear
              </Button>

              {isFormValid() && (
                <>
                  <Button
                    type="button"
                    onClick={handleAnswerKey}
                    color="green"
                    style={{ marginBottom: "1em", marginRight: "180px" }}
                  >
                    Answer Key
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
                </>
              )}
            </div>
          </div>
        </Form>
      </Segment>
    </Container>
  );
}

export default FormEditor;

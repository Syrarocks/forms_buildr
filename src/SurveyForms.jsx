import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Button,
  Form,
  Input,
  TextArea,
  Segment,
  Message,
  Icon,
  Grid,
  Header,
} from "semantic-ui-react";

function SurveyForms({ onSubmit }) {
  const formId = `${Date.now()}`;
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const lastQuestionRef = useRef(null);

  useEffect(() => {
    const savedFormData = JSON.parse(
      localStorage.getItem("savedSurveyFormData")
    );
    if (savedFormData) {
      setFormTitle(savedFormData.title || "");
      setFormDescription(savedFormData.description || "");
      setQuestions(savedFormData.questions || []);
    }
  }, []);

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        setSubmitted(false);
        setError(""); // Clear error after successful submission
      }, 5000); // 6000 milliseconds = 6 seconds

      // Cleanup timer if the component is unmounted or if submitted changes
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  const handleClearFields = () => {
    setFormTitle("");
    setFormDescription("");
    setQuestions([]);
    setSubmitted(false);
    setError(""); // Clear error on fields clear
    localStorage.removeItem("savedSurveyFormData");
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleQuestionTypeChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].type = value;

    if (value === "checkboxes") {
      newQuestions[index].options = [{ label: "" }];
    } else {
      newQuestions[index].options = [];
    }

    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: prevQuestions.length + 1,
        text: "",
        type: "",
        required: false,
        options: [],
      },
    ]);

    setTimeout(() => {
      lastQuestionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDeleteQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleRequiredChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].required = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ label: "" });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleLabelChange = (questionIndex, optionIndex, label) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].label = label;

    // Clear the error if all options are filled after input
    const hasEmptyOption = newQuestions[questionIndex].options.some(
      (option) => !option.label.trim()
    );
    if (!hasEmptyOption && error === "All options must be filled out.") {
      setError(""); // Clear the error once all options are filled
    }

    setQuestions(newQuestions);
  };

  const validateForm = () => {
    if (!formTitle) {
      setError("Form title is required.");
      return false;
    }
    for (const question of questions) {
      if (question.type === "checkboxes") {
        const hasEmptyOption = question.options.some(
          (option) => !option.label.trim()
        );
        if (hasEmptyOption) {
          setError("All options must be filled out.");
          return false;
        }
        if (question.options.length < 2) {
          setError("At least two options are required for checkboxes.");
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    const formData = {
      form_id: formId,
      title: formTitle,
      description: formDescription,
      questions,
    };

    // Save survey form to localStorage
    const existingForms = JSON.parse(localStorage.getItem("surveyForms")) || [];
    existingForms.push(formData);
    localStorage.setItem("surveyForms", JSON.stringify(existingForms));

    setSubmitted(true);
    setFormTitle("");
    setFormDescription("");
    setQuestions([]);
    setError(""); // Clear error on successful submission
    onSubmit(formData);
  };

  const renderCheckboxOptions = (question, questionIndex) => (
    <Form.Group grouped>
      {question.options.map((option, optionIndex) => (
        <Form.Field
          key={optionIndex}
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <Input
            placeholder={`Option ${optionIndex + 1}`}
            value={option.label}
            onChange={(e) =>
              handleLabelChange(questionIndex, optionIndex, e.target.value)
            }
            style={{ marginRight: "10px", width: "250px" }}
          />
          <Button
            icon
            color="red"
            onClick={() => handleRemoveOption(questionIndex, optionIndex)}
            style={{ padding: "10px", marginRight: "5px" }}
          >
            <Icon name="close" />
          </Button>
        </Form.Field>
      ))}
      <Button
        type="button"
        icon
        color="blue"
        onClick={() => handleAddOption(questionIndex)}
        style={{ padding: "10px", marginTop: "5px" }}
      >
        <Icon name="plus" />
      </Button>
    </Form.Group>
  );

  const renderQuestions = () =>
    questions.map((question, index) => (
      <div
        key={question.id}
        style={{ marginBottom: "20px" }}
        ref={index === questions.length - 1 ? lastQuestionRef : null}
      >
        <Grid>
          <Grid.Row columns={2} verticalAlign="middle">
            <Grid.Column width={10}>
              <Header as="h4" style={{ marginBottom: "5px" }}>{`Question ${
                index + 1
              }`}</Header>
              <Form.Input
                fluid
                placeholder="Enter your question"
                value={question.text}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                style={{ marginBottom: "20px" }}
              />
            </Grid.Column>
            <Grid.Column width={6}>
              <Header as="h4" style={{ marginBottom: "5px" }}>
                Question Type
              </Header>
              <Form.Select
                fluid
                placeholder="Select Type"
                options={[
                  {
                    key: "checkboxes",
                    text: "Checkboxes",
                    value: "checkboxes",
                  },
                  { key: "text", text: "Text", value: "text" },
                  { key: "rating", text: "Rating", value: "rating" },
                ]}
                value={question.type}
                onChange={(e, { value }) =>
                  handleQuestionTypeChange(index, value)
                }
                style={{ marginBottom: "20px" }}
              />
            </Grid.Column>
          </Grid.Row>
          {question.type === "checkboxes" &&
            renderCheckboxOptions(question, index)}
          <Grid.Row columns={2} verticalAlign="middle">
            <Grid.Column width={8}>
              <Form.Checkbox
                label="Required"
                checked={question.required}
                onChange={(e, { checked }) =>
                  handleRequiredChange(index, checked)
                }
                style={{ marginRight: "10px" }}
              />
            </Grid.Column>
            <Grid.Column width={8} textAlign="right">
              <Button
                icon
                color="red"
                onClick={() => handleDeleteQuestion(index)}
                style={{ padding: "10px", marginTop: "5px" }}
              >
                <Icon name="trash" />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    ));

  // Check if form title is entered and there is at least one question with a type selected
  const isSubmitEnabled =
    formTitle && questions.length > 0 && questions.every((q) => q.type);

  return (
    <Container style={{ maxWidth: "600px", margin: "auto" }}>
      <Segment
        raised
        style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}
      >
        <Form onSubmit={handleSubmitForm}>
          <Form.Input
            fluid
            placeholder="Form Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            style={{
              fontSize: "1.5em",
              fontWeight: formTitle ? "bold" : "normal",
              marginBottom: "20px",
            }}
          />
          <TextArea
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          {renderQuestions()}
          {error && (
            <Message negative>
              <Message.Header>Error</Message.Header>
              <p>{error}</p>
            </Message>
          )}
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
                onClick={handleClearFields}
                color="orange"
                style={{ marginBottom: "1em", marginRight: "10px" }}
              >
                Clear Text Fields
              </Button>
              {isSubmitEnabled && (
                <Button
                  color="blue"
                  type="submit"
                  style={{ marginBottom: "1em" }}
                >
                  <Icon name="paper plane" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Segment>

      {submitted && (
        <Message positive style={{ maxWidth: "800px", margin: "20px auto" }}>
          <Message.Header>
            Your response has been successfully submitted!
          </Message.Header>
        </Message>
      )}
    </Container>
  );
}

export default SurveyForms;

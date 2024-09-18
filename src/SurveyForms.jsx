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
  Checkbox,
} from "semantic-ui-react";

function SurveyForms({ onSubmit }) {
  const formId = `form-${Date.now()}`; // Corrected template literal
  const [questions, setQuestions] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const lastQuestionRef = useRef(null); // Use a ref to point to the last added question

  // Load form data from localStorage when the component mounts
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

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const handleRequiredChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].required = value;
    setQuestions(newQuestions);
  };

  const handleQuestionTypeChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionType = value;

    if (value === "checkboxes") {
      newQuestions[index].checkboxOptions = [
        { id: Date.now(), label: "", checked: false },
      ];
    } else if (value === "ratings") {
      newQuestions[index].checkboxOptions = [];
      newQuestions[index].selectedRating = 0;
    } else if (value === "text") {
      newQuestions[index].checkboxOptions = [];
      newQuestions[index].textAnswer = "";
    }

    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: `${Date.now()}`,
        questionText: "",
        questionType: "",
        selectedRating: 0,
        checkboxOptions: [{ id: Date.now(), label: "", checked: false }],
        textAnswer: "",
        required: false,
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

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].checkboxOptions.push({
      id: Date.now(),
      label: "",
      checked: false,
    });
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].checkboxOptions.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const handleLabelChange = (questionIndex, optionIndex, label) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].checkboxOptions[optionIndex].label = label;
    setQuestions(newQuestions);
  };

  const handleSaveForm = () => {
    const formData = {
      formId,
      title: formTitle,
      description: formDescription,
      questions,
    };
    localStorage.setItem("savedSurveyFormData", JSON.stringify(formData));
    alert("Form saved successfully!");
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    let errors = {};

    if (formTitle.trim() === "") {
      errors.title = "Form title is required.";
    }

    if (questions.length === 0) {
      errors.questions = "Please add at least one question.";
    }

    let hasError = false;
    questions.forEach((question, index) => {
      if (!question.questionText || question.questionText.trim() === "") {
        errors[`questionText_${index}`] = "All questions must have text.";
        hasError = true;
        return;
      }

      if (!question.questionType) {
        errors[`questionType_${index}`] =
          "Please select a question type for each question.";
        hasError = true;
        return;
      }

      if (["checkboxes"].includes(question.questionType)) {
        question.checkboxOptions.forEach((option, optionIndex) => {
          if (option.label.trim() === "") {
            errors[`option_${index}_${optionIndex}`] =
              "Options cannot be empty.";
            hasError = true;
            return;
          }
        });
      }
    });

    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setError({}); // Reset error if no issues
    const formId = `form-${Date.now()}`;

    const formData = {
      formId,
      title: formTitle,
      description: formDescription,
      questions,
    };

    localStorage.setItem("surveyFormData", JSON.stringify(formData));
    console.log("Survey Form Data:", formData);

    setSnackbarOpen(true);
    setSubmitted(true);

    // Clear form data after submission
    setFormTitle("");
    setFormDescription("");
    setQuestions([]);
    onSubmit(formData);
  };

  const handleClearFields = () => {
    setFormTitle("");
    setFormDescription("");
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) => ({
        ...question,
        questionText: "",
        questionType: "",
        required: false,
        checkboxOptions: question.checkboxOptions.map((option) => ({
          ...option,
          label: "",
        })),
      }))
    );
  };

  const renderCheckboxOptions = (question, questionIndex) => (
    <Form.Group grouped>
      {question.checkboxOptions.map((option, optionIndex) => (
        <Form.Field
          key={option.id}
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
          {error[`option_${questionIndex}_${optionIndex}`] && (
            <div style={{ color: "red" }}>
              {error[`option_${questionIndex}_${optionIndex}`]}
            </div>
          )}
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
          <Grid.Row columns={2}>
            <Grid.Column width={12}>
              {error[`questionText_${index}`] && (
                <div style={{ color: "red" }}>
                  {error[`questionText_${index}`]}
                </div>
              )}
              <Form.Input
                fluid
                label="Question"
                placeholder="Type your question here..."
                value={question.questionText}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                style={{ marginBottom: "20px" }}
              />
            </Grid.Column>
            <Grid.Column width={4}>
              {error[`questionType_${index}`] && (
                <div style={{ color: "red" }}>
                  {error[`questionType_${index}`]}
                </div>
              )}
              <Form.Select
                fluid
                label="Question Type"
                options={[
                  {
                    key: "checkboxes",
                    text: "Checkboxes",
                    value: "checkboxes",
                  },
                  { key: "ratings", text: "Ratings", value: "ratings" },
                  { key: "text", text: "Text", value: "text" },
                ]}
                value={question.questionType}
                onChange={(e, { value }) =>
                  handleQuestionTypeChange(index, value)
                }
                style={{ marginBottom: "20px" }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>

        {question.questionType === "checkboxes" &&
          renderCheckboxOptions(question, index)}
      </div>
    ));

  return (
    <Container>
      <Segment raised style={{ maxWidth: "800px", margin: "0 auto" }}>
        <Form onSubmit={handleSubmitForm}>
          {error.title && <div style={{ color: "red" }}>{error.title}</div>}
          <Form.Input
            placeholder="Form Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
          />
          <TextArea
            placeholder="Form Description"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          {renderQuestions()}
          <Grid>
            <Grid.Row>
              <Grid.Column width={16}>
                <Button
                  onClick={handleAddQuestion}
                  style={{ marginTop: "20px" }}
                >
                  Add Question
                </Button>

                <Button
                  icon
                  labelPosition="left"
                  onClick={handleSaveForm}
                  color="olive"
                  style={{ marginLeft: "10px", marginTop: "20px" }}
                >
                  <Icon name="save" />
                  Save Form
                </Button>

                <Button
                  color="orange"
                  type="button"
                  onClick={handleClearFields}
                  style={{
                    marginLeft: "10px",
                    marginTop: "20px",
                  }}
                >
                  Clear Text Fields
                </Button>

                <Button
                  color="blue"
                  type="submit"
                  style={{ marginLeft: "210px", marginTop: "20px" }}
                >
                  <Icon name="paper plane" />
                  Submit
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Segment>

      {snackbarOpen && (
        <Message
          positive
          onDismiss={() => setSnackbarOpen(false)}
          header="Form submitted successfully!"
        />
      )}

      {submitted && (
        <Message success header="Survey form submitted successfully!" />
      )}
    </Container>
  );
}

export default SurveyForms;

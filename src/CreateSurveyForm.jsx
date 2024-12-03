import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  Slide,
} from "@mui/material";
import { AddCircle, DeleteOutline, Clear, Send } from "@mui/icons-material";
import "./SurveyForm.css";

const SurveyForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [trashAnim, setTrashAnim] = useState(false);
  const [addAnim, setAddAnim] = useState(false);
  const [clearAnim, setClearAnim] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate the entire form
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate title and description
    if (!formTitle.trim()) {
      newErrors.formTitle = "Form Title is required.";
      isValid = false;
    }
    if (!formDescription.trim()) {
      newErrors.formDescription = "Form Description is required.";
      isValid = false;
    }

    // Validate questions
    if (questions.length === 0) {
      newErrors.questions = "At least one question is required.";
      isValid = false;
    } else {
      const questionErrors = [];
      questions.forEach((q, index) => {
        const qError = {};
        if (!q.text.trim()) {
          qError.text = `Question ${index + 1} text is required.`;
          isValid = false;
        }
        if (!q.type) {
          qError.type = `Question ${index + 1} type is required.`;
          isValid = false;
        }
        questionErrors.push(qError);
      });
      newErrors.questionErrors = questionErrors;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddQuestion = () => {
    setAddAnim(true);
    setTimeout(() => setAddAnim(false), 500);

    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), text: "", type: "", options: [], required: false },
    ]);
  };

  const handleQuestionChange = (id, key, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [key]: value } : q))
    );
  };

  const handleDeleteQuestion = (id) => {
    setTrashAnim(true);
    setTimeout(() => {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      setTrashAnim(false);
    }, 800);
  };

  const handleClearForm = () => {
    setClearAnim(true);
    setTimeout(() => {
      setFormTitle("");
      setFormDescription("");
      setQuestions([]);
      setErrors({});
      setClearAnim(false);
    }, 500);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted successfully:", {
        formTitle,
        formDescription,
        questions,
      });
      alert("Form submitted successfully!");
    } else {
      console.log("Form validation failed.");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: "800px", margin: "auto" }}>
      <Card variant="outlined" sx={{ mb: 3, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Create Survey
        </Typography>
        <TextField
          label="Form Title"
          variant="outlined"
          fullWidth
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          error={!!errors.formTitle}
          helperText={errors.formTitle}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Form Description"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          value={formDescription}
          onChange={(e) => setFormDescription(e.target.value)}
          error={!!errors.formDescription}
          helperText={errors.formDescription}
          sx={{ mb: 2 }}
        />
      </Card>

      {questions.length === 0 && errors.questions && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.questions}
        </Typography>
      )}

      {questions.map((q, index) => (
        <Slide key={q.id} direction="up" in mountOnEnter unmountOnExit>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={8}>
                  <TextField
                    label={`Question ${index + 1}`}
                    variant="outlined"
                    fullWidth
                    value={q.text}
                    onChange={(e) =>
                      handleQuestionChange(q.id, "text", e.target.value)
                    }
                    error={!!errors.questionErrors?.[index]?.text}
                    helperText={errors.questionErrors?.[index]?.text}
                  />
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth error={!!errors.questionErrors?.[index]?.type}>
                    <InputLabel>Question Type</InputLabel>
                    <Select
                      value={q.type}
                      onChange={(e) =>
                        handleQuestionChange(q.id, "type", e.target.value)
                      }
                      label="Question Type"
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="checkboxes">Checkboxes</MenuItem>
                      <MenuItem value="rating">Rating</MenuItem>
                    </Select>
                    {errors.questionErrors?.[index]?.type && (
                      <Typography variant="caption" color="error">
                        {errors.questionErrors[index].type}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <IconButton
                color="error"
                className={trashAnim ? "trash-bin" : ""}
                onClick={() => handleDeleteQuestion(q.id)}
              >
                <DeleteOutline />
              </IconButton>
            </CardActions>
          </Card>
        </Slide>
      ))}

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircle />}
          className={addAnim ? "button-bounce" : ""}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
        <Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            className={clearAnim ? "button-shake" : ""}
            onClick={handleClearForm}
            sx={{ mr: 2 }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<Send />}
            onClick={handleSubmit}
            disabled
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyForm;

import React, { useState } from "react";
import { Form, Button, Icon, Grid } from "semantic-ui-react";

function QuestionCard({ question, onDelete, onChange }) {
  const [options, setOptions] = useState(question.options || []);

  const handleTypeChange = (event, { value }) => {
    const newType = value;
    onChange(question.id, { type: newType });
    if (["multipleChoice", "checkboxes", "dropdown"].includes(newType)) {
      if (options.length === 0) {
        addOption();
      }
    } else {
      setOptions([]);
      onChange(question.id, { options: [] });
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = options.map((opt, idx) =>
      idx === index ? { ...opt, label: value } : opt
    );
    setOptions(updatedOptions);
    onChange(question.id, { options: updatedOptions });
  };

  const addOption = () => {
    const newOption = { label: "" };
    setOptions([...options, newOption]);
    onChange(question.id, { options: [...options, newOption] });
  };

  const removeOption = (index) => {
    const updatedOptions = options.filter((_, idx) => idx !== index);
    setOptions(updatedOptions);
    onChange(question.id, { options: updatedOptions });
  };

  const toggleRequired = (event, { checked }) => {
    onChange(question.id, { required: checked });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onChange(question.id, { file });
  };

  const handleDateChange = (e) => {
    onChange(question.id, { date: e.target.value });
  };

  const renderOptions = () => {
    switch (question.type) {
      case "multipleChoice":
      case "checkboxes":
      case "dropdown":
        return (
          <div style={{ marginTop: "1em" }}>
            {options.map((option, index) => (
              <Form.Field key={index}>
                <Form.Input
                  placeholder={`Option ${index + 1}`}
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  style={{ maxWidth: "400px", marginBottom: "1em" }}
                  action={
                    <Button
                      icon
                      color="red"
                      onClick={() => removeOption(index)}
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
              onClick={addOption}
              style={{ marginTop: "1em" }}
            >
              <Icon name="add" />
              Add Option
            </Button>
          </div>
        );
      case "fileUpload":
        return (
          <Form.Input
            type="file"
            onChange={handleFileChange}
            style={{ marginTop: "1em" }}
          />
        );
      case "date":
        return (
          <Form.Input
            type="date"
            value={question.date || ""}
            onChange={handleDateChange}
            style={{ marginTop: "1em" }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ marginBottom: "1em" }}>
      <Grid>
        <Grid.Row>
          <Grid.Column width={12}>
            <Form.Input
              fluid
              label="Question"
              placeholder="Enter your question"
              value={question.text}
              onChange={(e) => onChange(question.id, { text: e.target.value })}
              style={{ marginBottom: "1em" }}
            />
          </Grid.Column>
          <Grid.Column width={4}>
            <Form.Select
              fluid
              label="Question Type"
              options={[
                { key: "select", value: "", text: "Select Type" }, // Default option
                { key: "text", value: "text", text: "Text" },
                {
                  key: "multipleChoice",
                  value: "multipleChoice",
                  text: "Multiple Choice",
                },
                { key: "checkboxes", value: "checkboxes", text: "Checkboxes" },
                { key: "dropdown", value: "dropdown", text: "Dropdown" },
                { key: "fileUpload", value: "fileUpload", text: "File Upload" },
                { key: "date", value: "date", text: "Date" },
              ]}
              value={question.type}
              onChange={handleTypeChange}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>

      {renderOptions()}

      <Grid style={{ marginTop: "1em" }} verticalAlign="middle">
        <Grid.Row columns={2}>
          <Grid.Column>
            <Form.Checkbox
              label="Required"
              checked={question.required || false}
              onChange={toggleRequired}
            />
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Icon
              name="trash"
              negative
              color="red"
              size="large" // Increased the size of the delete icon
              onClick={() => onDelete(question.id)}
              style={{ cursor: "pointer" }} // Added cursor pointer for better UX
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default QuestionCard;

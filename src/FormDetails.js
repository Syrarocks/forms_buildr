import React from "react";
import { useLocation } from "react-router-dom";
import { Container, List, Segment, Header } from "semantic-ui-react";

const FormDetails = () => {
  const location = useLocation();
  const { form } = location.state || {}; // Retrieve the form data from state

  if (!form) {
    return <p>No form details available.</p>;
  }

  return (
    <Container>
      <Segment raised>
        <Header as="h2">{form.title}</Header>
        <p>
          <strong>Description:</strong> {form.description}
        </p>

        <Header as="h3">Questions</Header>
        <List divided>
          {form.questions.map((question) => (
            <List.Item key={question.id}>
              <Segment>
                <p>
                  <strong>Question:</strong> {question.text}
                </p>
                <p>
                  <strong>Type:</strong> {question.type}
                </p>
                <p>
                  <strong>Required:</strong> {question.required ? "Yes" : "No"}
                </p>
              </Segment>
            </List.Item>
          ))}
        </List>
      </Segment>
    </Container>
  );
};

export default FormDetails;

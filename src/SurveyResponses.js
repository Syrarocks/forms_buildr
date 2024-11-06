import React, { useEffect, useState } from "react";
import { Container, Segment, Header, Button } from "semantic-ui-react";
import { useNavigate, useParams } from "react-router-dom";

const SurveyResponses = () => {
  const [responses, setResponses] = useState([]);
  const { formId } = useParams(); // Use formId from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const savedResponses =
      JSON.parse(localStorage.getItem("surveyResponses")) || [];

    // Filter responses by the specific formId
    const filteredResponses = savedResponses.filter(
      (response) => response.form_id === formId
    );
    setResponses(filteredResponses);
  }, [formId]);

  const handleResponseClick = (response) => {
    // Navigate to ResponseDetails with response data
    navigate(`/response-details`, {
      state: { response },
    });
  };

  const handleClearResponses = () => {
    localStorage.removeItem("surveyResponses");
    setResponses([]);
  };

  // Function to format date and time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Container>
      <Button
        color="red"
        onClick={handleClearResponses}
        style={{ marginLeft: "695px" }}
      >
        Clear Survey Responses
      </Button>

      <Segment style={{ maxWidth: "650px", margin: "20px auto" }}>
        {responses.length > 0 ? (
          responses.map((response, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Header as="h4" color="blue">
                  Form ID: {response.form_id} -{" "}
                  {response.title || "Untitled Form"}
                </Header>
                <span style={{ fontSize: "1em", color: "black" }}>
                  <strong>Submitted At:</strong>{" "}
                  {formatDateTime(response.submittedAt)}
                </span>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <p>
                  <strong>Name:</strong> {response.name}
                </p>
                <Button
                  onClick={() => handleResponseClick(response)}
                  basic
                  color="blue"
                  style={{ marginTop: "5px", display: "block" }} // Display as block for clarity
                >
                  View Response
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No responses available for this form</p>
        )}
      </Segment>
    </Container>
  );
};

export default SurveyResponses;

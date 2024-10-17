import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Segment, Header, Button } from "semantic-ui-react";

const FormResponseDetails = () => {
  const location = useLocation(); // Access state passed via navigate
  const navigate = useNavigate();
  const { responses, formId } = location.state || {};

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${formattedDate} ${formattedTime}`;
  };

  // Handle viewing individual response (navigates to detailed view)
  const handleViewResponse = (response) => {
    navigate("/response-details", { state: { response } });
  };

  return (
    <Container>
      <Segment style={{ maxWidth: "650px", margin: "20px auto" }}>
        <Header as="h3" color="red">
          Responses for Form ID: {formId}
        </Header>
        {responses ? (
          responses.map((response, index) => (
            <Segment
              key={index}
              style={{ margin: "10px auto", maxWidth: "600px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  <strong>Name:</strong> {response.name}
                </p>
                <p style={{ color: "black", fontSize: "1em" }}>
                  <strong>Submitted At:</strong>{" "}
                  {formatDateTime(response.submittedAt)}
                </p>
              </div>
              <Button
                onClick={() => handleViewResponse(response)}
                style={{ marginTop: "1em" }}
              >
                View Response
              </Button>
            </Segment>
          ))
        ) : (
          <p>No responses available for this form.</p>
        )}
      </Segment>
    </Container>
  );
};

export default FormResponseDetails;

import React, { useEffect, useState } from "react";
import { Container, Segment, Header, Button } from "semantic-ui-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for routing

const SurveyResponses = () => {
  const [groupedResponses, setGroupedResponses] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const savedResponses =
      JSON.parse(localStorage.getItem("surveyResponses")) || [];
    groupAndSetResponses(savedResponses);
  }, []);

  const groupAndSetResponses = (responses) => {
    const grouped = responses.reduce((acc, response) => {
      const formId = response.form_id || "No ID";
      if (!acc[formId]) {
        acc[formId] = {
          title: response.title || "Untitled Form",
          responses: [],
        };
      }
      acc[formId].responses.push(response);
      return acc;
    }, {});
    setGroupedResponses(grouped);
  };

  const handleFormIdClick = (formId) => {
    // Navigate to the new page with the formId and its responses
    navigate(`/form-responses/${formId}`, {
      state: { responses: groupedResponses[formId].responses, formId },
    });
  };

  const handleClearResponses = () => {
    localStorage.removeItem("surveyResponses");
    setGroupedResponses({});
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
        {Object.keys(groupedResponses).length > 0 ? (
          Object.keys(groupedResponses).map((formId, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              {/* Wrapper for title, form ID, and total responses count */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Header as="h4" color="blue">
                  Form ID: {formId} - {groupedResponses[formId].title}
                </Header>

                {/* Display Total Responses at the top right */}
                <span style={{ fontSize: "1em", color: "black" }}>
                  <strong>Total Responses:</strong>
                  <span
                    style={{
                      backgroundColor: "rgb(6, 6, 6)",
                      color: "rgb(251, 250, 250)",
                      borderRadius: "67%",
                      padding: "6px",
                      width: "30px",
                      height: "30px",
                      display: "inline-block",
                      textAlign: "center",
                      fontWeight: "bold",
                      marginLeft: "10px", // Add some space between the text and the count
                    }}
                  >
                    {groupedResponses[formId]?.responses.length || 0}
                  </span>
                </span>
              </div>

              {/* View Responses Button */}
              <Button
                onClick={() => handleFormIdClick(formId)}
                basic // Make the button background white
                color="blue" // Make the button text blue
                style={{ marginTop: "10px" }} // Add margin to separate from the title
              >
                View Responses
              </Button>
            </div>
          ))
        ) : (
          <p>No survey responses available</p>
        )}
      </Segment>
    </Container>
  );
};

export default SurveyResponses;

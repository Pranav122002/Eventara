import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { API_BASE_URL } from "../config";

const PermitPage = () => {
  const [committeeApprovals, setCommitteeApprovals] = useState([]);
  const [eventApprovals, setEventApprovals] = useState([]);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log(user);
    try {
      // Fetch committee approvals
      const committeeResponse = await fetch(
        `${API_BASE_URL}/api/admin-committees/${user._id}`
      );
      const committeeData = await committeeResponse.json();
      console.log(committeeData.admin.assigned_committees);
      setCommitteeApprovals(committeeData.admin.assigned_committees);

      // Fetch event approvals
      const eventResponse = await fetch(
        `${API_BASE_URL}/api/admin-events/${user._id}`
      );
      const eventData = await eventResponse.json();
      console.log(eventApprovals.admin.assigned_committees);
      setEventApprovals(eventApprovals.admin.assigned_committees);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };

  const handleCommitteeApproval = async (approvalId, status) => {
    try {
      // Send approval status update to backend
      await fetch(`${API_BASE_URL}/api/committee-approval/${approvalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      // Update local state after approval action
      setCommitteeApprovals(
        committeeApprovals.filter((approval) => approval._id !== approvalId)
      );
    } catch (error) {
      console.error("Error updating approval:", error);
    }
  };

  const handleEventApproval = async (approvalId, status) => {
    try {
      // Send approval status update to backend
      await fetch(`${API_BASE_URL}/api/event-approval/${approvalId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      // Update local state after approval action
      setEventApprovals(
        eventApprovals.filter((approval) => approval._id !== approvalId)
      );
    } catch (error) {
      console.error("Error updating approval:", error);
    }
  };

  return (
    <>
      <div className="ml-[23rem]">
        <Container>
          <h2 className="mt-4 text-2xl text-left mb-4">Committee Approvals</h2>
          <Row>
            {committeeApprovals.length > 0 &&
              committeeApprovals?.map((approval) => (
                <Col key={approval._id} md={4}>
                  <Card className="mb-4 shadow">
                    <Card.Body>
                      <Card.Title className="mb-2">
                        {approval?.committee_name}
                      </Card.Title>
                      <Card.Text className="mb-3">
                        {approval?.committee_desc}
                      </Card.Text>
                      <Button
                        variant="success"
                        onClick={() =>
                          handleCommitteeApproval(approval._id, "accepted")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleCommitteeApproval(approval._id, "rejected")
                        }
                        className="ml-5"
                      >
                        Reject
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
          <h2 className="mt-4 mb-4">Event Approvals</h2>
          <Row>
            {committeeApprovals.length > 0 &&
              eventApprovals?.map((approval) => (
                <Col key={approval._id} md={4}>
                  <Card className="mb-4 shadow">
                    <Card.Body>
                      <Card.Title className="mb-2">
                        {approval?.event_name}
                      </Card.Title>
                      <Card.Text className="mb-3">
                        {approval?.event_desc}
                      </Card.Text>
                      <Button
                        variant="success"
                        onClick={() =>
                          handleEventApproval(approval._id, "accepted")
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleEventApproval(approval._id, "rejected")
                        }
                      >
                        Reject
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default PermitPage;

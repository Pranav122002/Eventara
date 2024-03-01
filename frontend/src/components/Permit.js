import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
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
      console.log(eventData)
      console.log(eventData?.admin?.assigned_events);
      setEventApprovals(eventData?.admin?.assigned_events);
    } catch (error) {
      console.error("Error fetching approvals:", error);
    }
  };
  useEffect(() => {
    console.log(eventApprovals)
  }, [eventApprovals]);

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
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Name</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {committeeApprovals.length > 0 &&
                committeeApprovals?.map((approval, index) => (
                  <tr key={approval._id}>
                    <td className="w-20">{index + 1}</td>
                    <td>
                      <Card.Title className="mb-2">
                        {approval?.committee_name}
                      </Card.Title>
                      <Card.Text className="mb-3">
                        {approval?.committee_desc}
                      </Card.Text>
                    </td>
                    <td className="w-80">
                      <Button
                        variant="success"
                        onClick={() =>
                          handleCommitteeApproval(approval._id, 'accepted')
                        }
                      >
                        Approve
                      </Button>
                      
                      <Button
                        variant="danger"
                        onClick={() =>
                          handleCommitteeApproval(approval._id, 'rejected')
                        }
                        className="ml-2"
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>

          <h2 className="mt-4 text-left mb-4">Event Approvals</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Name</th>
                <th>Time</th>
                <th>Mode</th>
                <th>Buttons</th>
                
              </tr>
            </thead>
            <tbody>
              {eventApprovals.length > 0 &&
                eventApprovals?.map((approval, index) => (
                  <tr key={approval._id}>
                    <td>{index + 1}</td>
                    <td>
                      <Card.Title className="mb-2">{approval?.name}</Card.Title>
                      <Card.Text className="mb-3">
                        {approval?.event_desc}
                      </Card.Text>
                    </td>
                    <td>
                    <Card.Text className="mb-3">
                        {approval?.time}
                      </Card.Text>
                    </td>
                    <td>
                    <Card.Text className="mb-3">
                        {approval?.mode}
                      </Card.Text>
                    </td>
                    <td className="w-80">
                      <Button
                        variant="success"
                        onClick={() => handleEventApproval(approval._id, 'accepted')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleEventApproval(approval._id, 'rejected')}
                        className="ml-2"
                      >
                        Reject
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Container>
      </div>
    </>
  );
};

export default PermitPage;
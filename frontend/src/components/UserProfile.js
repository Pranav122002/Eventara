import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function UserProfie() {
  const { userid } = useParams();

  const [user, setUser] = useState("");
  const [committees, setCommittees] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUser(result.user);

        fetch(`${API_BASE_URL}/api/user/${userid}/committees`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((committeesData) => {
            console.log(committeesData);
            setCommittees(committeesData.committees);
          });
      });
  }, []);

  return (
    <>
      <div>
        <h1>{user.name}</h1>
        <h1>{user.email}</h1>
        <h2>Subscribed Committees:</h2>
        <ul>
          {committees.map((committee) => (
            <li key={committee._id}>
              <strong>{committee.committee_name}</strong>
              <ul>
                <li>
                  Events:
                  <ul>
                    {committee.events.map((event) => (
                      <li key={event._id}>{event.event_name}</li>
                    ))}
                  </ul>
                </li>
                <li>
                  Members:
                  <ul>
                    {committee.members.map((member) => (
                      <li key={member._id}>{member.name}</li>
                    ))}
                  </ul>
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const socket = io(`${API_BASE_URL}`);

export default function GroupChat() {
  const [userid, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const [userrole, setUserRole] = useState("");

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // require login
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/signin");
    } else {
      fetch(
        `${API_BASE_URL}/user/${JSON.parse(localStorage.getItem("user"))._id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setUserId(result.user._id);
          setUserName(result.user.name);
          setUserRole(result.user.role);
        });
    }
  }, []);

  useEffect(() => {
    fetch(`${API_BASE_URL}/all-group-messages`)
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendMessage = () => {
    socket.emit("message", {
      message: inputValue,
      sender_name: username,
      sender_id: userid,
      sender_role: userrole,
      createdAt: new Date().toISOString(),
    });

    fetch(`${API_BASE_URL}/save-group-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: inputValue,
        sender_name: username,
        sender_id: userid,
        sender_role: userrole,
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error saving message:", error);
      });

    setInputValue("");
  };

  return (
    <div className="container mt-5" style={{ width: "40%" }}>
      <div className="row">
        <div className="col">
          {messages.map((message, index) => (
            <div key={index} className="card mb-2">
              <div className="card-body">
                <div>
                  <span className="float-left" style={{ fontWeight: "bold" }}>
                    {message.sender_name}
                  </span>
                  <span className="float-right" style={{ color: message.sender_role === 'user' ? 'blue' : message.sender_role === 'admin' ? 'red' : 'green' }}>
                    {message.sender_role}
                  </span>
                </div>
                <div style={{ marginTop: '5px' }}>
                  <p className="card-text text-center">{message.message}</p>
                </div>
                <p className="card-text text-right">
                  <small className="text-muted">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </small>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="row">
        <div className="col d-flex">
          <input
            className="form-control mb-2"
            placeholder="Type your message here..."
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button className="btn btn-primary ml-2" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

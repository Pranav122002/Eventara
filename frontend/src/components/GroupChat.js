import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const socket = io(`${BASE_URL}`);

export default function GroupChat() {
  const [userid, setUserId] = useState("");
  const [username, setUserName] = useState("");

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
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error("Error saving message:", error);
      });

    setInputValue("");
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              <div>{message.sender_name}</div>
              <div>{message.message}</div>
              <span>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>
            </p>
          </div>
        ))}
      </div>
      <div>
        <input
          placeholder="Type your message here..."
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/PersonalChat.css";

const BASE_URL = "http://localhost:5000";
const API_BASE_URL = "http://localhost:5000/api";
const socket = io(`${BASE_URL}`);

const PersonalChat = () => {
  const [userid, setUserId] = useState("");
  const [username, setUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const messageContainerRef = useRef(null);

  // require login
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/signin");
    } else {
      fetch(
        `${API_BASE_URL}/api/user/${JSON.parse(localStorage.getItem("user"))._id}`,
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
    if (selectedUser) {
      fetch(
        `${API_BASE_URL}/api/all-personal-messages/${
          JSON.parse(localStorage.getItem("user"))._id
        }/${selectedUser._id}`
      )
        .then((response) => response.json())
        .then((data) => {
          setMessages(data);
        })
        .catch((error) => {
          console.error("Error fetching personal messages:", error);
        });

      socket.on("personal-message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.off("personal-message");
    };
  }, [selectedUser]);

  useEffect(() => {
    if (userid) {
      socket.emit("add-user", userid);
    }
  }, [userid]);

  useEffect(() => {
    fetch(
      `${API_BASE_URL}/api/all-users-except/${
        JSON.parse(localStorage.getItem("user"))._id
      }`
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("Error fetching personal users:", error);
      });
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleUserSelection = (user) => {
    setSelectedUser(user);
  };

  const sendPersonalMessage = () => {
    if (selectedUser) {
      const senderId = JSON.parse(localStorage.getItem("user"))._id;

      socket.emit("personal-message", {
        message: inputValue,
        sender_name: username,
        receiver_name: selectedUser.name,
        sender_id: senderId,
        receiver_id: selectedUser._id,
        createdAt: new Date().toISOString(),
      });

      fetch(`${API_BASE_URL}/api/save-personal-message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          sender_name: username,
          receiver_name: selectedUser.name,
          sender_id: senderId,
          receiver_id: selectedUser._id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {})
        .catch((error) => {
          console.error("Error saving personal message:", error);
        });

      setInputValue("");
    }
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <div className="ml-[30rem]">
        <div className="contain mt-5 w-5/6">
          <div className="row h-[35rem]">
            <div className="col-md-4 border d-flex flex-column">
              <div className="flex p-2">
                <img className="w-10" src="./profile.png" alt="" />
              <h2 className="text-xl ml-3 pt-1 text-left ">{username}</h2>
              </div>
              <div className="d-flex flex-column text-left">
                {users.map((user) => (
                  <button
                    key={user._id}
                    onClick={() => {
                      handleUserSelection(user);
                    }}
                    className={`user-item btn text-left w-full btn-light btn-block ${
                      selectedUser && selectedUser._id === user._id
                        ? "active"
                        : ""
                    }`}
                  >
                    {user.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-8 border d-flex flex-column">
              {selectedUser && (
                <>
                  <div  className="d-flex align-items-center">
                    <h3 className="text-xl p-2">{selectedUser.name}</h3>
                    <p
                      className={`role ${
                        selectedUser.role === "user"
                          ? "blue"
                          : selectedUser.role === "admin"
                          ? "red"
                          : "green"
                      }`}
                    >
                      {selectedUser.role}
                    </p>
                  </div>
                  <div
                    className="message-container overflow-auto"
                    ref={messageContainerRef}
                    style={{ flex: 1, maxHeight: "400px" }}
                  >
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`message-item ${
                          message.sender_id === userid ? "sent" : "received"
                        }`}
                      >
                        <div
                          className={`message-container ${
                            message.sender_id === userid ? "sent" : "received"
                          }`}
                        >
                          <div className="message-content">
                            {message.message}
                          </div>
                          <div className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="d-flex">
                    <input
                      placeholder="Type your message here.."
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                    <button
                      onClick={sendPersonalMessage}
                      disabled={!selectedUser}
                      className="btn btn-primary ml-2 align-self-end"
                    >
                      Send
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalChat;

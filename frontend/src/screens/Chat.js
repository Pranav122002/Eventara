import React from "react";

import { Link } from "react-router-dom";

export default function Chat() {
  return (
    <>
      <Link to="/personal-chat">
        <button role="button">Personal Chats</button>
      </Link>
      <Link to="/group-chat">
        <button role="button">Group Chat</button>
      </Link>
    </>
  );
}

import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./screens/Home";
import Chat from "./screens/Chat";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Navbar from "./components/Navbar";
import UserProfile from "./components/UserProfile";
import PersonalChat from "./components/PersonalChat";
import GroupChat from "./components/GroupChat";
import CommitteePage from "./screens/CommitteePage";
import Events from "./screens/Events";
import Venue from "./screens/Venue";
import CreateCom from "./components/CreateCom"
import { UserProvider } from "./components/UserContext";
import Permit from "./components/Permit";
import Signature from "./screens/Signature"
function App() {
  return (
    <BrowserRouter>
      <UserProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="/home" element={<Home />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/user/:userid" element={<UserProfile />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/personal-chat" element={<PersonalChat />}></Route>
          <Route path="/group-chat" element={<GroupChat />}></Route>
          <Route path="/committees" element={<CommitteePage />} ></Route>
          <Route path="/events" element={<Events />} ></Route>
          <Route path="/venue" element={<Venue />} ></Route>
          <Route path="/create-committee" element={<CreateCom/>}></Route>
          <Route path="/permit" element={<Permit/>}></Route>
          <Route path="/signature" element={<Signature/>}></Route>
          <Route></Route>
        </Routes>
        <ToastContainer />
      </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

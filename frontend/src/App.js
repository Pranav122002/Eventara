import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Chat from "./screens/Chat";

import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Navbar from "./components/Navbar";
import UserProfile from "./components/UserProfile";
import PersonalChat from "./components/PersonalChat";
import GroupChat from "./components/GroupChat";
import CommitteePage from "./screens/CommitteePage";
import { UserProvider } from "./components/UserContext";

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
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/personal-chat" element={<PersonalChat />}></Route>
          <Route path="/group-chat" element={<GroupChat />}></Route>
          <Route path="/committee" element={<CommitteePage />} ></Route>
          <Route path="/create-committee" element={<></>}></Route>
          <Route></Route>
        </Routes>
        <ToastContainer />
      </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

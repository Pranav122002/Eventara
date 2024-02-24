import React, { useEffect, useState } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // require login
  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/signin");
    }
  });

  return (
    <>
      <h1>Home</h1>
    </>
  );
}

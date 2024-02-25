import React, { useEffect, useState } from "react";
import "../css/Profile.css";
import { API_BASE_URL } from "../config";
export default function Profile() {
  const [user, setUser] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/user/${JSON.parse(localStorage.getItem("user"))._id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setUser(result.user);
        });
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <p>{user.name}</p>
      <p>{user.email}</p>
      <h1>Profile</h1>
    </>
  );
}

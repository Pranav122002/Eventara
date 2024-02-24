import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Toast functions
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  const postData = () => {
    //checking email syntax
    if (!emailRegex.test(email)) {
      notifyA("Invalid email");
      return;
    } else if (!passRegex.test(password)) {
      notifyA(
        "Password must contain at least 8 characters, including at least 1 number and 1 includes both lower and uppercase letters and special characters for example #,?,!"
      );
      return;
    }

    // Sending data to server
    fetch(`${API_BASE_URL}/api/signup`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        role: role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signin");
        }
      });
  };

  return (
    <>
      <div className="m-32 flex justify-content-center">
        <div>
          <img src="./iphone.png" className="h-[40rem]" alt="" />
        </div>
        <div className="-ml-32 w-96">
          <div className=" p-6 pt-1 border-2 mt-10 rounded-none ">
            <h1 className="font-Danc text-4xl italic text-gray-700 text-center mt-3 ">
              Campus Collab
            </h1>
            <div className="mt-10 ">
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  className="mt-2 w-5/6 bg-gray-100 border-1 p-2 rounded-md"
                  placeholder="Email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="name"
                  className="mt-2 w-5/6 bg-gray-100 border-1 p-2 rounded-md"
                  id="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>

              <div>
                <input
                  type="password"
                  name="password"
                  className="mt-2 w-5/6 bg-gray-100 border-1 p-2 rounded-md"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
              </div>
              <div id="roles">
                <select
                  required
                  placeholder="Choose your role"
                  name="role"
                  id="role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                >
                  <option className="selopt" value="" disabled selected>
                    Chooose your role{" "}
                  </option>
                  <option className="selopt" value="user">
                    user
                  </option>
                  <option className="selopt" value="admin">
                    admin
                  </option>
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 mb-10 w-5/6 bg-sky-300 text-white  p-2 rounded-md"
                id="submit-btn"
                onClick={() => {
                  postData();
                }}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="p-6 pt-3 border-2 mt-4 rounded-none  text-decoration-none">
            Already have an account?
            <Link to="/signin">
              <span className=" text-decoration-none"> Sign In</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

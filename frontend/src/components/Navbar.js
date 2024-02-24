import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const [onHome, setOnHome] = useState(false);
  const [onChat, setOnChat] = useState(false);
  const [onProfile, setOnProfile] = useState(false);
  const [onCreateCom, setOnCreateCom] = useState(false)
  // const [user, setUser] = useState("");
  const [showVNavbar, setShowVNavbar] = useState(false);

  var { user } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signin");
    }
  }, []);

  const handleShowVNavbar = () => {
    setShowVNavbar(!showVNavbar);
  };

  useEffect(() => {
    setOnHome(location.pathname === "/home");
    setOnChat(location.pathname === "/chat");
    setOnProfile(location.pathname === "/profile");
    setOnCreateCom(location.pathname === "/create-committee")

  }, [location]);

  const loginStatus = () => {
    // console.log("hello")
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      user = storedUser;
    }

    if (user?.role === "admin") {
      return (
        <>
          <Link className="borderrad" to="/analytics">
            <div className="navimgspace">
              <img className="navimg" src="./analytics.png" alt="" />
            </div>
            <li style={{ color: "black" }} className="navli">
              Analytics
            </li>
          </Link>
          
          <Link
            className="borderrad"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              // notifyB("Logout successfull.");
            }}
          >
            <div className="navimgspace">
              {" "}
              <img className="navimg" src="./logout3.png" alt="" />
            </div>
            <li style={{ color: "red" }} className="navli">
              Sign out
            </li>
          </Link>
        </>
      );
    } else if (user?.role === "volunteer") {
      return (
        <>
          <Link className="borderrad" to="/volunteer">
            <div className="navimgspace">
            </div>
            <li style={{ color: "black" }} className="navli">
              Volunteer
            </li>
          </Link>

          <Link className="borderrad" to="/chats">
            <div className="navimgspace">
              {" "}
              <img
                className="navimg"
                id="adce"
                src="./chat5.png"
                alt=""
                style={{ color: "none" }}
              />
            </div>
            <li style={{ color: "black" }} className="navli">
              Chats
            </li>
          </Link>

          <Link
            className="borderrad"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              // notifyB("Logout successfull.");
            }}
          >
            <div className="navimgspace">
              {" "}
              <img className="navimg" src="./logout3.png" alt="" />
            </div>
            <li style={{ color: "red" }} className="navli">
              Sign out
            </li>
          </Link>
        </>
      );
    } else if (user?.role === "user") {
      return (
        <>
          <Link className="borderrad" to="/donate-medicines">
            <div className="navimgspace">
            </div>
            <li style={{ color: "black" }} className="navli">
              Donate
            </li>
          </Link>

          <Link
            className="borderrad"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              // notifyB("Logout successfull.");
            }}
          >
            <div className="navimgspace">
              {" "}
              <img className="navimg" src="./logout3.png" alt="" />
            </div>
            <li style={{ color: "red" }} className="navli">
              Sign out
            </li>
          </Link>
        </>
      );
    } else if (user?.role === "doctor") {
      return (
        <>
          <Link className="borderrad" to="/donate-medicines">
            <div className="navimgspace">
            </div>
            <li style={{ color: "black" }} className="navli">
              Donate
            </li>
          </Link>

          <Link
            className="borderrad"
            to="/signin"
            onClick={() => {
              localStorage.clear();
              // notifyB("Logout successfull.");
            }}
          >
            <div className="navimgspace">
              {" "}
              <img className="navimg" src="./logout3.png" alt="" />
            </div>
            <li style={{ color: "red" }} className="navli">
              Sign out
            </li>
          </Link>
        </>
      );
    }
  };

  return (
    <div>
      {!["/signup", "/signin", "/", "/about-us"].includes(
        useLocation().pathname
      ) && (
        <div className={`mainnavss ${props.showvNavbar && "active"} `}>
          <div className={`navbar ${showVNavbar && "active"}`}>
            <div className="one" onClick={handleShowVNavbar}>
              <h1>Services</h1>
            </div>
            <div className="two" onClick={props.handleShowvNavbar}>
              <ul className="nav-menu">{loginStatus()}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

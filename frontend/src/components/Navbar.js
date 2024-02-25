import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Navbar as BootstrapNavbar, Nav, NavDropdown } from "react-bootstrap";

export default function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleSignOut = () => {
    localStorage.clear();
    // notifyB("Logout successfull.");
  };
  const storedUser = JSON.parse(localStorage.getItem("user"));
  user = storedUser;
  return (
    <div className="p-[0.1rem] " >
      {!["/signup", "/signin", "/", "/about-us"].includes(
        useLocation().pathname
      ) && (
        <>
          {user?.role === "admin" && (
            <div className="vnavbarr pt-0 min-w-[18rem] h-screen bg-white border-r-2 ">
               <div className="flex m-3 p-3 rounded ">
                  <img src="./lines2.png" className="liness h-7" alt="" />
                  <h1 className="font-Danc text-3xl italic text-gray-700">Eventara</h1>
                </div>

              <NavLink
                to="/permit"
                className="w-11/12 ml-3 flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "
              >
                <img className="h-8 m-3" src="./store.png" alt="" />
                <h1 className="text-xl text-gray-700  pt-3 pb-3 tracking-tight font-medium ">
                  Analytics
                </h1>
              </NavLink>
              <NavLink
                  to="/events"
                  className="w-11/12 ml-3 no-underline  flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "

                >
                  <img className="h-7 m-3 " src="./event.png" alt="" />
                  <h1 className="text-xl text-gray-700  pt-3 pb-3 tracking-tight font-medium ">
                    Events
                  </h1>
                </NavLink>
              <NavLink
                  to="/venue"
                  className="w-11/12  no-underline  ml-3 flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "

                >
                  <img className="h-7 m-3 " src="./event.png" alt="" />
                  <h1 className="text-xl text-gray-700  pt-3 pb-3 tracking-tight font-medium ">
                    Venue 
                  </h1>
                </NavLink>
                <NavLink
                  to="/Chat"
                  className="w-11/12 ml-3 flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "

                >
                  <img className="h-7 m-3 " src="./event.png" alt="" />
                  <h1 className="text-xl text-gray-700  pt-3 pb-3 tracking-tight font-medium ">
                    Chat
                  </h1>
                </NavLink>
              <div
                className="cursor-pointer w-11/12 ml-3 flex rounded hover:bg-gray-100 bottom-3 absolute "
                onClick={() => {
                  localStorage.clear();
                  navigate("/");
                }}
              >
                <img className="h-6 m-3" src="./logout2.png" alt="" />
                <h1 className="pl-1 pt-3 pb-3 font-medium text-red-500 text-base tracking-tight">
                  Logout
                </h1>
              </div>
            </div>
          )}
          {user?.role === "user" && (
            <>
              <div className="vnavbarr pt-0 min-w-[20rem] h-screen bg-white border-r-2 ">
                <div className="flex m-3 p-3 rounded ">
                  <img src="./lines2.png" className="liness h-7" alt="" />
                  <h1 className="font-Danc text-3xl italic text-gray-700">Eventara</h1>
                </div>

                <NavLink
                  to="/events"
                  className="w-11/12 ml-3 no-underline  flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "

                >
                  <img className="h-7 m-3 " src="./Home.png" alt="" />
                  <h1 className="font-Danc text-xl text-gray-700  pt-3 pb-3  font-medium ">
                    Home
                  </h1>
                </NavLink>

                <NavLink
                  to="/Chat"
                  className="w-11/12 ml-3 flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "

                >
                  <img className="h-7 m-3 " src="./event.png" alt="" />
                  <h1 className="text-xl text-gray-700  pt-3 pb-3 tracking-tight font-medium ">
                    Chat
                  </h1>
                </NavLink>
                <NavLink
                  to="/committees"
                  className="w-11/12 no-underline ml-3 flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "
                >
                  <img className="h-8 m-3" src="./people.png" alt="" />
                  <h1 className="text-xl  text-gray-700  pt-3 pb-3 tracking-tight font-medium ">
                    Committees
                  </h1>
                </NavLink>
                <NavLink
                  to="/create-committee"
                  className="w-11/12 no-underline ml-3 flex hover:pl-2 hover:mr-2 rounded hover:bg-gray-100 mt-1.5 "
                >
                  <img className="h-8 m-3" src="./add.png" alt="" />
                  <h1 className="text-xl text-gray-700  pt-3 pb-3 tracking-tight font-medium ">
                    New Committee
                  </h1>
                </NavLink>
               
                <div
                  className="cursor-pointer w-11/12 ml-3 flex rounded hover:bg-gray-100 bottom-3 absolute "
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                >
                  <img className="h-6 m-3" src="./logout2.png" alt="" />
                  <h1 className="pl-1 pt-3 pb-3 font-medium text-red-500 text-base tracking-tight">
                    Logout
                  </h1>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

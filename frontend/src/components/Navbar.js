import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import { Navbar as BootstrapNavbar, Nav, NavDropdown } from 'react-bootstrap';

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
                <ul className="nav-menu">
                  <BootstrapNavbar collapseOnSelect expand="lg">
                    <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" />
                    <BootstrapNavbar.Collapse id="responsive-navbar-nav">
                      <Nav className="mr-auto">
                        {user?.role === "admin" && (
                          <>
                            <Link to="/permit" className="nav-link">
                              Permit
                            </Link>
                            <Link to="/history" className="nav-link">
                              History
                            </Link>
                          </>
                        )}
                        {/* {user?.role === "volunteer" && (
                          <>
                            <Link to="/volunteer" className="nav-link">
                              Volunteer
                            </Link>
                            <Link to="/chats" className="nav-link">
                              Chats
                            </Link>
                          </>
                        )} */}
                        {user?.role === "user" && (
                          <>
                            <Link to="/events" className="nav-link">
                              Events
                            </Link>
                            <Link to="/committees" className="nav-link">
                              Committees
                            </Link>
                            <Link to="/create-committee" className="nav-link">
                              Create Committee
                            </Link>
                          </>
                        )}
                      </Nav>
                      <Nav>
                        <Link to="/signin" className="nav-link" onClick={handleSignOut}>
                          Sign out
                        </Link>
                      </Nav>
                    </BootstrapNavbar.Collapse>
                  </BootstrapNavbar>
                </ul>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

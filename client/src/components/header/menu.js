/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { logout } from "../../redux/reducer/auth";

function Menu() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const bfloginLink = [
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" },
  ];
  const afloginLink = [
    { label: "Home", path: "/homePage" },
    { label: "CreateBlog", path: "/createBlog" },
    { label: "Forum", path: "/forum" },
  ];
  const navLink = auth.token ? afloginLink : bfloginLink;

  const handleLogout = async (e) => {
    e.preventDefault();
    await dispatch(logout(dispatch));
    history.push("/");
  };
  return (
    <div>
      <ul className="navbar-nav ">
        {navLink.map((link, index) => (
          <li className="nav-item" key={index}>
            <Link
              to={link.path}
              className="nav-link active"
              aria-current="page"
            >
              {link.label}
            </Link>
          </li>
        ))}
        {auth.token && (
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle"
              id="navbarDropdownMenuLink"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                className="avatar-smaill"
                src={auth.user.avatar}
                alt={auth.user.avatar}
              />
              User Name
            </a>
            <ul
              className="dropdown-menu"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <li>
                <Link
                  className="dropdown-item"
                  to={`/profile/${auth.user._id}`}
                >
                  <i className="fa fa-user-circle" aria-hidden="true"></i>
                  Profile
                </Link>
              </li>
              <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                <a className="dropdown-item">
                  <i className="fas fa-sign-out-alt"></i>
                  Logout
                </a>
              </li>
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Menu;

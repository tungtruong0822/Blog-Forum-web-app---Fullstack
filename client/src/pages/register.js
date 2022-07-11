import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { validRegister } from "../utils/valid";
import { alertAction } from "../redux/reducer/alert";
import { register } from "../redux/reducer/auth";

function Register() {
  const initial = { name: "", account: "", password: "", cf_password: "" };
  const [userData, setUserData] = useState(initial);
  const { name, account, password, cf_password } = userData;
  const [showPassword, setShowPassword] = useState(false);
  const [showCfPassword, setShowCfPassword] = useState(false);

  const dispatch = useDispatch();

  const handleOnChage = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = validRegister(name, account, password, cf_password);
    if (res.errLength > 0) {
      dispatch(alertAction({ errors: res.errMsg }));
    } else {
      dispatch(register({ name, account, password }));
    }
  };

  return (
    <form
      className=" mx-auto form_login"
      onSubmit={handleSubmit}
      style={{ maxWidth: "500px" }}
    >
      <h6
        className="display-6 w-100"
        style={{ textAlign: "center", fontWeight: "900" }}
      >
        Register
      </h6>
      <div className="form-group my-3 position-relative">
        <label htmlFor="inputYourName">Your Name</label>
        <input
          type="text"
          className="form-control"
          id="inputYourName"
          defaultValue={name}
          name="name"
          onChange={handleOnChage}
          maxLength="20"
        />
        <span style={{ position: "absolute", top: "30px", right: "15px" }}>{`${
          name && name.length + "/20"
        }`}</span>
      </div>
      <div className="form-group my-3">
        <label htmlFor="exampleInputEmail1">Email /Phone Number</label>
        <input
          type="text"
          className="form-control"
          id="exampleInputEmail1"
          defaultValue={account}
          name="account"
          onChange={handleOnChage}
          aria-describedby="emailHelp"
        />
        <small id="emailHelp" className="form-text text-muted">
          We'll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group my-3 position-relative">
        <label htmlFor="imputPassword">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          id="imputPassword"
          defaultValue={password}
          name="password"
          onChange={handleOnChage}
        />
        <div
          className="position-absolute bg-secondary "
          style={{
            right: "1px",
            top: "25px",
            width: "20%",
            height: "57%",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            cursor: "pointer",
          }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <p
              className="center text-white"
              style={{ height: "100%", width: "100%" }}
            >
              hide
            </p>
          ) : (
            <p
              className="center text-white"
              style={{ height: "100%", width: "100%" }}
            >
              show
            </p>
          )}
        </div>
      </div>
      <div className="form-group my-3 position-relative">
        <label htmlFor="inputCfPassword">Comfirm Password</label>
        <input
          type={showCfPassword ? "text" : "password"}
          className="form-control"
          id="inputCfPassword"
          defaultValue={cf_password}
          name="cf_password"
          onChange={handleOnChage}
          aria-describedby="emailHelp"
        />
        <div
          className="position-absolute bg-secondary"
          style={{
            right: "1px",
            top: "25px",
            width: "20%",
            height: "57%",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            cursor: "pointer",
          }}
          onClick={() => setShowCfPassword(!showCfPassword)}
        >
          {showCfPassword ? (
            <p
              className="center text-white"
              style={{ height: "100%", width: "100%" }}
            >
              hide
            </p>
          ) : (
            <p
              className="center text-white"
              style={{ height: "100%", width: "100%" }}
            >
              show
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={userData.account && userData.name ? false : true}
      >
        Register
      </button>

      <p className="d-block">
        Already an account ?
        <Link to="login" className="text-danger mx-2">
          Login now ...
        </Link>
      </p>
    </form>
  );
}

export default Register;

import React, { useEffect, useState } from "react";

function LoginPass({ setUserData }) {
  const initial = { account: "", password: "" };
  const [user, setUser] = useState(initial);
  const { account, password } = user;
  const [showPassword, setShowPassword] = useState(false);

  const handleOnChage = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    setUserData(user);
  }, [user, setUserData]);

  return (
    <div>
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
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          className="form-control"
          id="exampleInputPassword1"
          defaultValue={password}
          name="password"
          onChange={handleOnChage}
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
    </div>
  );
}

export default LoginPass;

import React, { useEffect, useState } from "react";

function LoginSms({ setUserPhoneData }) {
  const initial = { account: "+84" };
  const [user, setUser] = useState(initial);

  const { account } = user;

  const handleOnChage = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  useEffect(() => {
    setUserPhoneData(user);
  }, [user, setUserPhoneData]);

  return (
    <div>
      <div className="form-group my-3">
        <label htmlFor="exampleInputEmail1">Phone Number</label>
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
    </div>
  );
}

export default LoginSms;

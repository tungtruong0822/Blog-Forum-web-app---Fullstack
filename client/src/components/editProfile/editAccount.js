import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { updateAccount } from "../../redux/reducer/profile";
import { refreshToken } from "../../redux/reducer/auth";

function EditAccount() {
  const [objectPass, setobjectPass] = useState({});
  const { cf_password_new, password_new, password_old } = objectPass;
  const [show1, setshow1] = useState(false);
  const [show2, setshow2] = useState(false);
  const [show3, setshow3] = useState(false);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setobjectPass({ ...objectPass, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      updateAccount({ cf_password_new, password_new, password_old, auth })
    );
    await dispatch(refreshToken());
    history.push(`/profile/${auth.user._id}`);
  };
  return (
    <form className="editProfile" onSubmit={handleSubmit}>
      <div className="mb-3 form-group position-relative">
        <label htmlFor="inputEditPasswordOld" className="form-label">
          Password Old
        </label>
        <input
          type={show1 ? "text" : "password"}
          name="password_old"
          className="form-control"
          id="inputEditPasswordOld"
          onChange={handleChangeInput}
          disabled={auth.user.type === "register" ? false : true}
        />
        <span className="text-danger">
          {auth.user.type !== "register" &&
            `Quick login ${auth.user.type} can't user this function`}
        </span>
        <div
          className="position-absolute bg-secondary"
          style={{
            right: "1px",
            top: "31px",
            width: "20%",
            height: "57%",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            cursor: "pointer",
          }}
          onClick={() => setshow1(!show1)}
        >
          {show1 ? (
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

      <div className="mb-3 form-group position-relative">
        <label htmlFor="inputEditPassword">New Password</label>
        <input
          type={show2 ? "text" : "password"}
          className="form-control "
          name="password_new"
          id="inputEditPassword"
          onChange={handleChangeInput}
          disabled={auth.user.type === "register" ? false : true}
        />
        <div
          className="position-absolute bg-secondary"
          style={{
            right: "1px",
            top: "26px",
            width: "20%",
            height: "57%",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            cursor: "pointer",
          }}
          onClick={() => setshow2(!show2)}
        >
          {show2 ? (
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

      <div className="mb-3 form-group position-relative">
        <label htmlFor="inputEditCFPassword">C-Firm New Password</label>
        <input
          type={show3 ? "text" : "password"}
          className="form-control "
          name="cf_password_new"
          id="inputEditCFPassword"
          onChange={handleChangeInput}
          disabled={auth.user.type === "register" ? false : true}
        />
        <div
          className="position-absolute bg-secondary"
          style={{
            right: "1px",
            top: "26px",
            width: "20%",
            height: "57%",
            borderTopRightRadius: "3px",
            borderBottomRightRadius: "3px",
            cursor: "pointer",
          }}
          onClick={() => setshow3(!show3)}
        >
          {show3 ? (
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

      <button type="submit" className="btn btn-primary">
        Update
      </button>
    </form>
  );
}

export default EditAccount;

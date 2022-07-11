import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { alertAction, loading } from "../redux/reducer/alert";
import { addaccount, verifySMS } from "../redux/reducer/auth";
import { postAPI } from "../utils/fetchData";

function SendCode() {
  const [count, setCount] = useState(60);
  const [codeOPT, setCodeOPT] = useState();

  const history = useHistory();
  const dispatch = useDispatch();

  const { auth } = useSelector((state) => state);

  const handleResend = async () => {
    if (count === 0) {
      setCount(60);
      dispatch(loading(true));

      await postAPI("loginSms", { account: auth.user.account })
        .then((res) => {
          dispatch(addaccount({ account: auth.user.account }));
          console.log(res);
          if (!res.data.valid) {
            history.push("/sendCode");
          }
        })
        .catch((err) =>
          dispatch(alertAction({ errors: [err.response.data.msg] }))
        );

      dispatch(loading(false));
    }
  };
  const handleOnChage = (e) => {
    setCodeOPT(e.target.value);
  };

  const handleSendCode = () => {
    dispatch(verifySMS({ account: auth.user.account, code: codeOPT }));
  };

  useEffect(() => {
    if (count > 0) {
      setTimeout(() => setCount(count - 1), 1000);
    } else {
      setCount(0);
    }
  }, [count]);
  return (
    <div>
      <div className="form-group my-3 position-relative">
        <label htmlFor="InputCodeOPT">
          Enter Your code form {`${auth.user.account}`}
        </label>
        <input
          type="text"
          className="form-control"
          id="InputCodeOPT"
          name="codeOTP"
          onChange={handleOnChage}
        />
        <small className="form-text text-muted">
          If you do not receive the code include 6 number, please click resend
        </small>
        <button
          className="btn btn-danger position-absolute "
          style={{ top: "23px", right: "2px" }}
          disabled={count === 0 ? false : true}
          onClick={handleResend}
        >
          {count === 0 ? "" : count + " "}
          Resend code
        </button>

        <button
          className="btn btn-success w-100 mt-3"
          style={{ top: "23px", right: "2px" }}
          onClick={handleSendCode}
        >
          Send code
        </button>
      </div>
    </div>
  );
}

export default SendCode;

import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginPass, addaccount } from "../redux/reducer/auth";
import { postAPI } from "../utils/fetchData";
import { loading, alertAction } from "../redux/reducer/alert";
import GoogleButton from "../components/login/googleLogin";
import FacebookButton from "../components/login/facebookLogin";
import LoginPass from "../components/login/loginPass";
import LoginSms from "../components/login/loginSms";

function Login() {
  const [userPassData, setUserPassData] = useState({});
  const [userPhoneData, setUserPhoneData] = useState({});

  const [sms, setSms] = useState(false);

  const history = useHistory();
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sms) {
      dispatch(loading(true));

      await postAPI("loginSms", userPhoneData)
        .then((res) => {
          dispatch(addaccount(userPhoneData));
          console.log(res);
          if (!res.data.valid) {
            history.push("/sendCode");
          }
        })
        .catch((err) =>
          dispatch(alertAction({ errors: [err.response.data.msg] }))
        );

      dispatch(loading(false));
    } else {
      dispatch(loginPass(userPassData));
    }
  };
  const handleOnChageSms = () => {
    setSms(!sms);
    setUserPassData({ ...userPassData, password: "" });
  };

  useEffect(() => {
    if (auth.token) {
      let url = history.location.search.replace("?", "/");
      return history.push(url);
    }
  });
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
        Login
      </h6>

      <GoogleButton />
      <FacebookButton />

      {sms ? (
        <LoginSms setUserPhoneData={setUserPhoneData} />
      ) : (
        <LoginPass setUserData={setUserPassData} />
      )}

      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={userPassData.account || userPhoneData.account ? false : true}
      >
        Login
      </button>

      <div className="contact_user d-flex justify-content-between w-100 my-2">
        <Link to="#" className="text-info">
          forget password ?
        </Link>
        <Link to="#" className="text-info" onClick={handleOnChageSms}>
          {sms ? "Login with password" : "login whith sms"}
        </Link>
      </div>
      <p className="d-block">
        You don't haave an Account ?
        <Link to="register" className="text-danger mx-2">
          Register now ...
        </Link>
      </p>
    </form>
  );
}

export default Login;

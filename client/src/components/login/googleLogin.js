import React from "react";
import { GoogleLogin } from "react-google-login-lite";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { loginGoogle } from "../../redux/reducer/auth";

function GoogleButton() {
  const history = useHistory();
  const dispatch = useDispatch();
  const responseGoogle = (googleUser) => {
    const tokenID = googleUser.getAuthResponse().id_token;
    dispatch(loginGoogle(tokenID));
    history.push("/");
  };
  return (
    <GoogleLogin
      client_id="230170976515-8ot8t1a420s81o6ustetio1imrosf3ef.apps.googleusercontent.com"
      onSuccess={responseGoogle}
      cookiepolicy={"single_host_origin"}
      className="w-100 bg-primary position-relative h-50"
      icon={false}
    ></GoogleLogin>
  );
}

export default GoogleButton;

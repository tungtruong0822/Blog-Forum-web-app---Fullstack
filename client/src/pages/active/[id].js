/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { showErrMsg, showSuccessMsg } from "../../components/alert/alert";
import { postAPI } from "../../utils/fetchData";

function Active() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();
  const history = useHistory();
  useEffect(() => {
    postAPI("active", { active_token: id })
      .then((res) => setSuccess(res.data.msg))
      .catch((err) => setError(err.response.data.msg));

    if (success) {
      setTimeout(() => {
        history.push("/login");
      }, 3000);
    }
  }, [id]);
  return (
    <div>
      {success && showSuccessMsg(success)}
      {error && showErrMsg(error)}
    </div>
  );
}

export default Active;

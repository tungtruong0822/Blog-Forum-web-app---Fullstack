import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { alertAction } from "../../redux/reducer/alert";

function Toast({ title, body, bgColor }) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const handleClose = () => {
    dispatch(alertAction({}));
  };

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2700);
    setTimeout(() => {
      dispatch(alertAction({}));
    }, 3000);
  });

  return (
    <div
      className={`toast show position-fixed toast-show ${show && "hide-toast"}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ top: "56px", right: "36px", zIndex: 50, minWidth: "170px" }}
      id="toast"
    >
      <div className={`toast-header bg-${bgColor}`}>
        <strong className="me-auto text-white">{title}</strong>
        <button
          type="button"
          className="btn-close"
          data-dismiss="toast"
          aria-label="Close"
          onClick={handleClose}
        >
          <span aria-hidden="true"></span>
        </button>
      </div>
      <div className="toast-body">
        <ul>
          {body.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Toast;

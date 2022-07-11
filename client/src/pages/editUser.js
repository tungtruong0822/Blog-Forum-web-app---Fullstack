import React, { useState } from "react";
import EditAccount from "../components/editProfile/editAccount";
import EditProfile from "../components/editProfile/editProfile";

function EditUser() {
  const [isMarkEdit, setIsMarkEdit] = useState(false);
  return (
    <div className="editProfile row my-3">
      <div className="col-md-3">
        <ul className="list-group">
          <li
            className="list-group-item"
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => setIsMarkEdit(false)}
          >
            Edit Profile
          </li>
          <li
            className="list-group-item"
            style={{ cursor: "pointer", textAlign: "center" }}
            onClick={() => setIsMarkEdit(true)}
          >
            Edit Account
          </li>
        </ul>
      </div>
      <div className="col-md-9">
        <ul className="list-group">
          <li className="list-group-item">
            {isMarkEdit ? <EditAccount /> : <EditProfile />}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default EditUser;

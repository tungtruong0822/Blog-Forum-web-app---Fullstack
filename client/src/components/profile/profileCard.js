import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../redux/reducer/profile";

function ProfileCard() {
  const [otherUer, setOtherUer] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();

  const { profile, auth } = useSelector((state) => state);

  useEffect(() => {
    if (auth.user._id !== id) {
      setOtherUer(true);
      dispatch(getUser({ id }));
    }
  }, [auth, id, otherUer, dispatch]);
  return (
    <div className="card-container">
      <img
        className="round"
        src={otherUer ? profile.user.avatar : auth.user.avatar}
        alt="user"
      />
      <h3>{otherUer ? profile.user.name : auth.user.name}</h3>
      <p>{otherUer ? profile.user.bio : auth.user.bio}</p>
      <div className="buttons">
        <button className="primary">Message</button>
        <button className="primary ghost">Following</button>
        {!otherUer && (
          <Link to="/editUser">
            <button className="warning">Edit Profile</button>
          </Link>
        )}
      </div>
      <div className="skills">
        <h6>Skills</h6>
        <ul>
          {otherUer
            ? profile.user.skill &&
              profile.user.skill.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))
            : auth.user.skill &&
              auth.user.skill.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
        </ul>
      </div>
    </div>
  );
}

export default ProfileCard;

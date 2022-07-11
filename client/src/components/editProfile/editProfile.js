import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { updateProfile } from "../../redux/reducer/profile";
import { refreshToken } from "../../redux/reducer/auth";

function EditProfile() {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();

  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState("");
  const { name, bio, skill } = user;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setUser({ ...user, [name]: value });
  };

  const handleChangeFile = (e) => {
    const file = e.target.files[0];

    console.log(file);

    if (file) {
      setAvatar(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile({ avatar, name, bio, skill, auth }));
    await dispatch(refreshToken());
    history.push(`/profile/${auth.user._id}`);
  };

  useEffect(() => {
    setUser(auth.user);
  }, [auth.user]);

  return (
    <form className="editProfile" onSubmit={handleSubmit}>
      <div className="mb-3">
        <img
          className="round"
          src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
          alt="user"
        />
        <span style={{ marginLeft: "10px" }}>
          <label htmlFor="inputAvatar" className="form-label">
            <span className="btn btn-primary">
              <i className="fas fa-camera" />
              Chage Avatar
            </span>
          </label>
          <input
            type="file"
            accept="image/*"
            name="avatar"
            id="inputAvatar"
            style={{ opacity: "0" }}
            onChange={handleChangeFile}
          />
        </span>
      </div>

      <div className="mb-3">
        <label htmlFor="inputEditName" className="form-label">
          Name
        </label>
        <input
          type="text"
          name="name"
          className="form-control"
          id="inputEditName"
          defaultValue={name}
          onChange={handleChangeInput}
          maxLength="20"
        />
        <span>{`${name && name.length + "/20"}`}</span>
      </div>

      <div className="mb-3">
        <label htmlFor="inputEditDeScription">DeScription</label>
        <textarea
          className="form-control "
          name="bio"
          id="inputEditDeScription"
          defaultValue={bio}
          onChange={handleChangeInput}
          maxLength="200"
        />
        <span>{`${bio && bio.length + "/200"}`}</span>
      </div>
      <div className="mb-3">
        <label htmlFor="inputEditSkill" className="form-label">
          Skill
        </label>
        <input
          type="text"
          name="skill"
          className="form-control"
          id="inputEditSkill"
          defaultValue={skill}
          onChange={handleChangeInput}
          maxLength="75"
        />
        <span>{`${skill && skill.toString().length + "/75"}`}</span>
        <span className="text-secondary">
          {"   "}
          Each skill is separated by a comma
        </span>
      </div>

      <button type="submit" className="btn btn-primary">
        Update
      </button>
    </form>
  );
}

export default EditProfile;

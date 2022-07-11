import React from "react";
import ProfileCard from "../../components/profile/profileCard";
import Post from "../../components/profile/post";

function Profile() {
  return (
    <div className="profile row my-3">
      <div className="col-md-5">
        <ProfileCard />
      </div>
      <div className="col-md-7 ">
        <Post />
      </div>
    </div>
  );
}

export default Profile;

import React from "react";
import "./ProfileCard.css";

const ProfileCard = ({ icon, name, description }) => {
  return (
    <div className="profile-card">
      <div className="icon-box">
        <img src={icon} alt={name} />
      </div>
      <h4 className="profile-name">{name}</h4>
      <p className="profile-description">{description}</p>
    </div>
  );
};

export default ProfileCard;

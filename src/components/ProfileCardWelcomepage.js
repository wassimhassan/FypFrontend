import React from "react";
import "./ProfileCard.css";

const ProfileCardWelcomepage = ({ icon, name, description }) => {
  return (
    <div className="profile-cardd">
      <div className="icon-boxx">
        <img src={icon} alt={name} />
      </div>
      <h4 className="profile-namee">{name}</h4>
      <p className="profile-descriptionn">{description}</p>
    </div>
  );
};

export default ProfileCardWelcomepage;
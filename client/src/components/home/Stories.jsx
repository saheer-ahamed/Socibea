import React from "react";
import profile1 from '../../images/profile-1.jpg' 
import profile2 from '../../images/profile-2.jpg' 
import profile3 from '../../images/profile-3.jpg' 
import profile4 from '../../images/profile-4.jpg' 
import profile5 from '../../images/profile-5.jpg' 
import profile6 from '../../images/profile-6.jpg' 

export default function Stories() {
  return (
    <>
      {/* ================ STORIES ================== */}
      <div className="stories">
        <div className="story">
          <div className="profile-picture">
            <img src={profile1} alt="" />
          </div>
          <p className="name">Your Story</p>
        </div>
        <div className="story">
          <div className="profile-picture">
            <img src={profile2} alt="" />
          </div>
          <p className="name">Lilla James</p>
        </div>
        <div className="story">
          <div className="profile-picture">
            <img src={profile3} alt="" />
          </div>
          <p className="name">Winnie Hale</p>
        </div>
        <div className="story">
          <div className="profile-picture">
            <img src={profile4} alt="" />
          </div>
          <p className="name">Daniel Bale</p>
        </div>
        <div className="story">
          <div className="profile-picture">
            <img src={profile5} alt="" />
          </div>
          <p className="name">Jane Doe</p>
        </div>
        <div className="story">
          <div className="profile-picture">
            <img src={profile6} alt="" />
          </div>
          <p className="name">Danish Khan</p>
        </div>
      </div>
      {/* ================ END OF STORIES ================== */}
    </>
  );
}

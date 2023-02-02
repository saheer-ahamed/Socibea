export default function Friends({ title, name, picture, id, handleFollow }) {
  return (
    <div className="friend-requests">
      <div className="request">
        {title === "Friends" ? (
          <div className="info">
            <div className="profile-picture">
              <img
                src={
                  picture
                    ? picture
                    : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
                }
                alt=""
              />
            </div>
            <div className="infoName">
              <h5>{name}</h5>
              {/* <h6 className="text-muted">8 mutual friends</h6> */}
            </div>

            <div className="follow">
              <span
                className="btn-follow btn-primary unfollow"
                onClick={() => handleFollow(id, "unfollow")}
              >
                <i className="uil uil-check" style={{ fontSize: "1rem" }}></i>{" "}
                <span id="following">Following</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="info">
            <div className="profile-picture">
              <img
                src={
                  picture
                    ? picture
                    : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
                }
                alt=""
              />
            </div>
            <div className="infoName">
              <h5>{name}</h5>
              {/* <h6 className="text-muted">8 mutual friends</h6> */}
            </div>

            <div className="follow">
              <span
                className="btn-follow btn-primary"
                onClick={() => handleFollow(id, "follow")}
              >
                <i className="uil uil-plus" style={{ fontSize: "1rem" }}></i>{" "}
                Follow
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

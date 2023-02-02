import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { user } = useSelector((state) => ({ ...state }));
  const location = useLocation();

  return (
    <>
      <div className="left">
        <Link className="profile">
          <div className="profile-picture">
            <img
              src={
                user.picture
                  ? user.picture
                  : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
              }
              alt="dp"
            />
          </div>
          <div className="handle">
            <h4>
              {user.firstname} {user.lastname}
            </h4>
            <h6 className="text-muted" style={{ marginTop: ".1rem" }}>
              @{user.username}
            </h6>
          </div>
        </Link>
        {/* ================ SIDEBAR ================== */}
        <div className="sidebar">
          <Link
            className={
              location.pathname === "/"
                ? "menu-item active home"
                : "menu-item home"
            }
            to="/"
          >
            <span>
              <i className="uil uil-home"></i>
            </span>
            <h3>Home</h3>
          </Link>
          {/* <Link className="menu-item" id="notifications">
            <span>
              <i className="uil uil-bell">
                <small className="notification-count" data-count="9"></small>
              </i>
            </span>
            <h3>Notifications</h3>
            
            <div className="notifications-popup">
              <div>
                <div className="profile-picture">
                  <img src="./images/profile-2.jpg" alt="DP2" />
                </div>
                <div className="notification-body">
                  <b>Keke Benjamin</b> accepted your friend request.
                  <small className="text-muted">2 DAYS AGO</small>
                </div>
              </div>
              <div>
                <div className="profile-picture">
                  <img src="./images/profile-3.jpg" alt="DP2" />
                </div>
                <div className="notification-body">
                  <b>John Doe</b> commented on your post.
                  <small className="text-muted">1 HOUR AGO</small>
                </div>
              </div>
              <div>
                <div className="profile-picture">
                  <img src="./images/profile-4.jpg" alt="DP2" />
                </div>
                <div className="notification-body">
                  <b>Mary Oppong</b> and <b>283 others</b> liked your post.
                  <small className="text-muted">4 MINUTES AGO</small>
                </div>
              </div>
              <div>
                <div className="profile-picture">
                  <img src="./images/profile-5.jpg" alt="DP2" />
                </div>
                <div className="notification-body">
                  <b>Doris Y.Lartey</b> commented on a post you are tagged.
                  <small className="text-muted">2 DAYS AGO</small>
                </div>
              </div>
              <div>
                <div className="profile-picture">
                  <img src="./images/profile-6.jpg" alt="DP2" />
                </div>
                <div className="notification-body">
                  <b>Donald Trump</b> commented on your post.
                  <small className="text-muted">1 HOUR AGO</small>
                </div>
              </div>
              <div>
                <div className="profile-picture">
                  <img src="./images/profile-7.jpg" alt="DP2" />
                </div>
                <div className="notification-body">
                  <b>John Doe</b> commented on your post.
                  <small className="text-muted">1 HOUR AGO</small>
                </div>
              </div>
            </div>
          </Link> */}
          <Link className="menu-item" id="messages-notification">
            <span>
              <i className="uil uil-envelope-alt">
                {/* <small className="notification-count" data-count="6"></small> */}
              </i>
            </span>
            <h3>Message</h3>
          </Link>
          <Link
            className={
              location.pathname === "/bookmarks"
                ? "menu-item active"
                : "menu-item"
            }
            to="/bookmarks"
          >
            <span>
              <i className="uil uil-bookmark" />
            </span>
            <h3>Bookmarks</h3>
          </Link>
          <Link className="menu-item" id="theme">
            <span>
              <i className="uil uil-palette" />
            </span>
            <h3>Theme</h3>
          </Link>
          <Link
            className={
              location.pathname === "/profile"
                ? "menu-item active"
                : "menu-item"
            }
            to={`/profile/${user.id}`}
          >
            <span>
            <i className="uil uil-user"></i>
            </span>
            <h3>User Profile</h3>
          </Link>
        </div>
        {/* ================= END OF SIDEBAR ================ */}
        <label htmlFor="create-post" className="btn btn-primary">
          Create Post
        </label>
      </div>
    </>
  );
}

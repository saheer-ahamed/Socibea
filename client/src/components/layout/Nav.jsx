import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const handleLogout = () => {
    Cookies.set("user", "", { expires: -1 });
    dispatch({ type: "LOGOUT" });
  };
  return (
    <>
      <nav>
        <div className="container">
          <h2 className="log" onClick={() => navigate('/')} style={{cursor:"pointer"}}>Socibea</h2>
          <div className="search-bar">
            <i className="uil uil-search"></i>
            <input
              type="search"
              placeholder="Search for creators, inspirations and projects"
            />
          </div>
          <div className="create">
            {/* <label htmlFor="create-post" className="btn btn-primary">
              Create
            </label> */}
            <h5>Hi, {user.firstname}</h5>
            <div className="profile-picture navuser" onClick={handleLogout}>
              <img
                src={
                  user.picture
                    ? user.picture
                    : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
                }
                alt="dp"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";

export default function Nav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.set("user", "", { expires: -1 });
    dispatch({ type: "LOGOUT" });
  };
  return (
    <>
      <nav>
        <div className="container">
          <div className="navLogo">
            <img src={logo} alt="" style={{ width: "3rem" }} onClick={() => navigate("/")}/>
            <h2 className="log">Socibea</h2>
          </div>
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
            <h5>Logout</h5>
            <div className="navuser" onClick={handleLogout}>
              <i className="uil uil-signout"></i>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

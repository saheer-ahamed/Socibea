import "./Auth.css";
import AuthSvg from "../../svg/auth.svg";
import { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import BeatLoader from "react-spinners/BeatLoader";

export default function Auth() {
  const [containerClass, setContainerClass] = useState("containerAuth");
  const [loading, setLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const emailRef = useRef();
  const signupEmailRef = useRef();
  const passwordRef = useRef();
  const signupPasswordRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const confirmPassRef = useRef();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e) => {
    e.preventDefault();

    const signupData = {
      first_name: firstnameRef.current?.value,
      last_name: lastnameRef.current?.value,
      email: signupEmailRef.current?.value,
      password: signupPasswordRef.current?.value,
      confirmPassword: confirmPassRef.current?.value,
    };
    setRegLoading(true);
    await axios
      .post(`${BACKEND_URL}/register`, signupData)
      .then((res) => {
        setRegLoading(false);
        toast.success("Registration Successful!");
        const { message, ...rest } = res.data;
        setTimeout(() => {
          dispatch({ type: "LOGIN", payload: rest });
          Cookies.set("user", JSON.stringify(rest));
        }, 2000);
        navigate("/");
      })
      .catch((error) => {
        setRegLoading(false);
        toast.error(error.response.data.message);
      });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    setLoading(true);
    await axios
      .post(`${BACKEND_URL}/login`, loginData)
      .then((res) => {
        setLoading(false);
        toast.success("Login Successful!");
        setTimeout(() => {
          dispatch({ type: "LOGIN", payload: res.data });
          Cookies.set("user", JSON.stringify(res.data));
        }, 500);
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error(error.response?.data?.message);
      });
  };
  return (
    <div className={containerClass}>
      <div className="forms-container">
        <div className="signin-signup">
          <form className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign in</h2>
            <div className="auth-input-field">
              <i className="fas fa-user"></i>
              <input type="email" placeholder="Email" ref={emailRef} />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password" ref={passwordRef} />
            </div>
            {loading && <BeatLoader color="var(--color-primary)"/>}
            <input type="submit" value="Login" className="auth-btn solid" />
            <Link to='#' className="auth-forgot">Forgot Password?</Link>
          </form>
          <form className="sign-up-form" onSubmit={handleSignup}>
            <h2 className="title">Sign up</h2>
            <div className="auth-input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Firstname" ref={firstnameRef} />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Lastname" ref={lastnameRef} />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" ref={signupEmailRef} />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                ref={signupPasswordRef}
              />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Confirm Password"
                ref={confirmPassRef}
              />
            </div>
            {regLoading && <BeatLoader color="var(--color-primary)"/>}
            <input type="submit" className="auth-btn" value="Sign up" />
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="contentAuth">
            <h3>New here ?</h3>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Debitis,
              ex ratione. Aliquid!
            </p>
            <button
              className="auth-btn transparent"
              id="sign-up-btn"
              onClick={() => setContainerClass("containerAuth sign-up-mode")}
            >
              Sign up
            </button>
          </div>
          <img src={AuthSvg} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="contentAuth">
            <h3>One of us ?</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
              laboriosam ad deleniti.
            </p>
            <button
              className="auth-btn transparent"
              id="sign-in-btn"
              onClick={() => setContainerClass("containerAuth")}
            >
              Sign in
            </button>
          </div>
          <img src={AuthSvg} className="image" alt="" />
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Error.css";
import ErrorGIF from "./error.gif";

export default function Error() {
  const navigate = useNavigate();
  return (
    <div className="error-body">
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <div class="error-container">
        <img src={ErrorGIF} alt="" />
        <h2>Hmmm...</h2>
        <p>It looks like you're lost...</p>
        <p>That's a trouble?</p>
        <button type="button" onClick={() => navigate(-1)} class="btn">
          Go Back
        </button>
      </div>
    </div>
  );
}

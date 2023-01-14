import moment from 'moment'

export default function Messages({ message, own }) {
  return (
    <div className={own ? "message-container own" : "message-container"}>
      <div className="profile-picture">
        <img
          src="https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
          alt=""
        />
      </div>
      <div style={{ maxWidth: "80%" }}>
        <div className="eachMessage">
          <p style={{ wordWrap: "break-word", inlineSize: "100%" }}>
            {message.text}
          </p>
        </div>
        <p
          className="text-muted"
          style={{ fontSize: ".6rem", marginLeft: ".2rem" }}
        >
          {moment(message.createdAt).fromNow()}
        </p>
      </div>
    </div>
  );
}

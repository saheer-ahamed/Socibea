import axios from "axios";
import { useEffect, useState } from "react";

export default function Messages({ conversation, currentUser, currentChat }) {
  const [user, setUser] = useState({});

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser.id);

    const getFriend = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/${friendId}`);
        setUser(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    getFriend();

  }, [conversation, BACKEND_URL, currentUser]);

  return (
    <>
      <div className="message" onClick={() => currentChat(conversation)}>
        <div className="profile-picture">
          <img
            src={
              user?.picture
                ? user?.picture
                : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
            }
            alt=""
          />
        </div>
        <div className="message-body">
          <h5>{user?.username}</h5>
          {/* <p className="text-muted">Just woke up bro!</p> */}
        </div>
      </div>
    </>
  );
}

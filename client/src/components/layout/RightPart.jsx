import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Friends from "./Friends";
import Conversation from "./Conversation";
import ChatBox from "./ChatBox";
import { io } from "socket.io-client";

export default function RightPart() {
  const { user } = useSelector((state) => ({ ...state }));
  const [currentUser, setCurrentUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [notFriends, setNotFriends] = useState([]);
  // const [onlineUsers, setOnlineUsers] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  // const socket = useRef();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const socket = io.connect("ws://localhost:8000");
  const handleFollow = async (id, title) => {
    await axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/${id}/handleFollow`, {
        userId: user.id,
      })
      .then((res) => {
        if (title === "follow") {
          setNotFriends((prev) => [...prev].filter((f) => f._id !== id));
          setFriends((prev) => [res.data, ...prev]);
        } else {
          setFriends((prev) => [...prev].filter((f) => f._id !== id));
          setNotFriends((prev) => [res.data, ...prev]);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    const getUserDetails = async () => {
      await axios
        .get(`${BACKEND_URL}/user/${user.id}`)
        .then((res) => setCurrentUser(res.data));
    };

    getUserDetails();
  }, [user.id, BACKEND_URL]);

  useEffect(() => {
    socket.emit("addUser", user.id);
    socket.on("getUsers", (users) => {
      console.log(users);
    });
  }, [conversations, currentUser, user, socket]);

  const showChat = (data) => {
    setCurrentChat(data);
  };

  useEffect(() => {
    const fetchOtherUsers = async () => {
      await axios
        .get(`${BACKEND_URL}/${user.id}/otherUsers`)
        .then((response) => {
          setFriends(response.data.myFollowings);
          setNotFriends(response.data.notMyFollowings);
        })
        .catch((error) => console.log(error));
    };
    fetchOtherUsers();
  }, [user.id, BACKEND_URL, setFriends, setNotFriends]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/conversations/${user.id}`
        );
        setConversations(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversations();
  }, [user.id, BACKEND_URL]);

  return (
    <>
      <div className="right">
        <div className="messages">
          <div className="heading">
            <h4>Messages</h4>
            <i className="uil uil-edit" />
          </div>
          {/* ========== MESSAGES CATEGORY ========== */}
          <div className="category">
            <h5 className="active">Primary Conversations</h5>
          </div>
          {/* ========== MESSAGE ========== */}
          <div className="messagesContainer">
            {conversations.map((c, id) => (
              <Conversation
                conversation={c}
                key={id}
                currentChat={showChat}
                currentUser={user}
              />
            ))}
          </div>
        </div>
        {/* =============== END OF MESSAGES =============== */}
        {/* =============== FRIEND REQUESTS =============== */}
        {friends.length !== 0 && (
          <h4 style={{ marginTop: ".8rem" }}>Friends</h4>
        )}
        {friends.map((eachFriend, id) => (
          <Friends
            title="Friends"
            name={eachFriend.username}
            picture={eachFriend.picture}
            key={eachFriend._id}
            id={eachFriend._id}
            handleFollow={handleFollow}
          />
        ))}
        {notFriends.length !== 0 && (
          <h4 style={{ marginTop: ".8rem" }}>People You May Know</h4>
        )}
        {notFriends.map((eachNotFriend, id) => (
          <Friends
            title="People you may know"
            name={eachNotFriend.username}
            picture={eachNotFriend.picture}
            key={eachNotFriend._id}
            id={eachNotFriend._id}
            handleFollow={handleFollow}
          />
        ))}
      </div>
      {currentChat && (
        <ChatBox
          showChat={showChat}
          currentChat={currentChat}
          socket={socket}
        />
      )}
    </>
  );
}

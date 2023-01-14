import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Friends from "./Friends";
import Conversation from "./Conversation";
import ChatBox from "./ChatBox";
import { io } from "socket.io-client";

export default function RightPart() {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch()
  const [currentUser, setCurrentUser] = useState({});
  const [friends, setFriends] = useState([]);
  const [notFriends, setNotFriends] = useState([]);
  // const [onlineUsers, setOnlineUsers] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const socket = useRef();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleFollow = async (id, title) => {
    await axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/${id}/handleFollow`, {
        userId: user.id,
      })
      .then((res) => {
          if(title === 'follow'){
            dispatch({ type: "FOLLOW", payload: id })
          } else {
            dispatch({ type: "UNFOLLOW", payload: id })
          }
      }).catch(error => console.log(error))
  };

  useEffect(() => {
    const getUserDetails = async () => {
      await axios
        .get(`${BACKEND_URL}/user/${user.id}`)
        .then((res) => setCurrentUser(res.data));
    };

    socket.current = io("ws://localhost:7000");
    getUserDetails();
  }, [user.id, BACKEND_URL]);

  useEffect(() => {
    socket.current.emit("addUser", user.id);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [conversations, currentUser, user]);

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
          {/* ========== SEARCH BAR ========== */}
          {/* <div className="search-bar">
            <i className="uil uil-search"></i>
            <input
              type="search"
              placeholder="Search Conversations"
              id="message-search"
            />
          </div> */}
          {/* ========== MESSAGES CATEGORY ========== */}
          <div className="category">
            <h5 className="active">Primary Conversations</h5>
          </div>
          {/* ========== MESSAGE ========== */}
          {conversations.map((c, id) => (
            <Conversation
              conversation={c}
              key={id}
              currentChat={showChat}
              currentUser={user}
            />
          ))}
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
            key={id}
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
            key={id}
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
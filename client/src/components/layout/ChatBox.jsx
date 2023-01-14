import axios from "axios";
import { useRef } from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Messages from "./Messages";

export default function ChatBox({ currentChat, showChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [friend, setFriend] = useState({});
  const { user } = useSelector((state) => ({ ...state }));
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const scrollRef = useRef();

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, [socket]);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_URL}/messages/${currentChat?._id}`
        );
        setMessages(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessages();
  }, [currentChat, BACKEND_URL]);

  useEffect(() => {
    const friendId = currentChat.members.find((m) => m !== user.id);

    const getFriend = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/${friendId}`);
        setFriend(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFriend();
  }, [currentChat, user.id, BACKEND_URL]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatSubmit = async () => {
    const message = {
      sender: user.id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find((member) => member !== user.id);

    socket.current.emit("sendMessage", {
      text: newMessage,
      senderId: user.id,
      receiverId,
    });

    try {
      const res = await axios.post(`${BACKEND_URL}/messages`, message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-container">
        <div className="chatNav">
          <div className="friendUser">
            <div className="profile-picture">
              <img
                src="https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
                alt=""
              />
            </div>
            <h5>{friend.username}</h5>
          </div>
          <i
            className="uil uil-multiply"
            style={{ cursor: "pointer" }}
            onClick={() => showChat(null)}
          ></i>
        </div>
        <hr />
        <div className="chatArea">
          {messages.map((m, id) => (
            <div ref={scrollRef} key={id}>
              <Messages message={m} own={m.sender === user.id} />
            </div>
          ))}
        </div>
        <div className="chatInputArea user">
          <div className="chat-bar">
            <input
              type="text"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            />
          </div>
          <i
            className="uil uil-message"
            style={{ cursor: "pointer" }}
            onClick={chatSubmit}
          ></i>
        </div>
      </div>
    </div>
  );
}

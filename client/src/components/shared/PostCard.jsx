import axios from "axios";
import { Image } from "cloudinary-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Comments from "../home/Comments";

export default function PostCard({ eachFeed, setPosts }) {
  const { user } = useSelector((state) => ({ ...state }));
  const navigate = useNavigate();
  const params = useParams();
  const [liked, setLiked] = useState(eachFeed.likes.includes(user.id));
  const [likes, setLikes] = useState(eachFeed.likes.length);
  const [allComments, setAllComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [bookmarked, setBookmarked] = useState(
    eachFeed.savedBy.includes(user.id)
  );
  const commentRef = useRef();
  const BaseUrl = process.env.REACT_APP_BACKEND_URL;

  const getComments = async () => {
    try {
      setShowComments(!showComments);
      await axios.get(`${BaseUrl}/${eachFeed._id}/comment`).then((response) => {
        setAllComments(response.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const postComment = async () => {
    try {
      const commentInput = commentRef.current.value;
      await axios
        .put(`${BaseUrl}/${eachFeed._id}/comment`, {
          userId: user.id,
          comment: commentInput,
        })
        .then((response) => {
          console.log(response.data);
          console.log(setAllComments);
          setAllComments((prev) => [response.data, ...prev]);
          resetComment();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const resetComment = () => {
    commentRef.current.value = "";
  };

  const handleLike = async () => {
    try {
      setLiked((prev) => !prev);
      await axios
        .put(`${BaseUrl}/${eachFeed._id}/like`, {
          userId: user.id,
        })
        .then((response) => {
          console.log(response);
          liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmark = async () => {
    try {
      await axios
        .put(`${BaseUrl}/${eachFeed._id}/save`, {
          userId: user.id,
        })
        .then((response) => {
          setBookmarked((prev) => !prev);
          if (bookmarked === true) {
            setPosts((prev) => [...prev].filter((f) => f._id !== eachFeed._id));
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      console.log(user.id);
      await axios
        .delete(`${BaseUrl}/${eachFeed._id}`, {
          data: { userId: user.id },
        })
        .then((response) => {
          setPosts((prev) => [...prev].filter((f) => f._id !== eachFeed._id));
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="feed">
        <div className="head">
          <div
            className="user"
            onClick={() => navigate(`/profile/${eachFeed.userId}`)}
          >
            <div className="profile-picture">
              <Image
                cloudName="ryzoxxsw"
                publicId={
                  eachFeed.picture
                    ? eachFeed?.picture
                    : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
                }
                width="300"
                height="300"
                crop="fit"
                alt="sample image"
              />
            </div>
            <div className="info">
              <h3>
                {eachFeed.first_name} {eachFeed.last_name}
              </h3>
              <h6 className="text-muted">@{eachFeed.username}</h6>
            </div>
          </div>
          {params?.id === user.id ? (
            <div className="customBtn">
              <span className="edit">
                <i className="uil uil-ellipsis-h" />
              </span>
              <ul className="dropdown" onClick={handleDelete}>
                <li>Delete</li>
              </ul>
            </div>
          ) : (
            ""
          )}
        </div>
        <h3 style={{ margin: ".5rem" }}>{eachFeed.desc}</h3>
        <div className="photo">
          {eachFeed?.image ? (
            <Image
              cloudName="ryzoxxsw"
              publicId={eachFeed?.image}
              alt="sample image"
              className="feedImage"
            />
          ) : eachFeed?.video ? (
            <video
              controls
              muted
              src={eachFeed?.video}
              alt="sample video"
              className="feedVideo"
            />
          ) : (
            ""
          )}
        </div>
        <div className="action-buttons">
          <div className="interaction-buttons">
            <span onClick={() => handleLike()}>
              <i
                className="uil uil-heart"
                style={{ color: liked ? "red" : "var(--color-dark)" }}
              />
            </span>
            <span onClick={getComments}>
              <i className="uil uil-comment-dots" />
            </span>
            <span>
              <i className="uil uil-share-alt" />
            </span>
          </div>
          <div className="bookmark">
            <span onClick={handleBookmark}>
              <i
                className="uil uil-bookmark-full"
                style={{ color: bookmarked ? "green" : "var(--color-dark)" }}
              />
            </span>
          </div>
        </div>
        {likes !== 0 ? (
          <div className="liked-by">
            {likes === 0 ? (
              ""
            ) : likes === 1 ? (
              <p>
                Liked by <b>{likes} person.</b>
              </p>
            ) : (
              <p>
                Liked by <b>{likes} persons.</b>
              </p>
            )}
          </div>
        ) : (
          ""
        )}
        <div className="caption text-muted">
          <p>
            <b>@{eachFeed.username}</b>
          </p>
        </div>
        {eachFeed?.comments && eachFeed?.comments.length !== 0 ? (
          <div className=" comments text-muted">View all comments</div>
        ) : (
          ""
        )}
        {showComments && (
          <div className="comment-section">
            <h3>Comments</h3>
            <div className="user comment-user">
              <div className="comment-picture">
                <Image
                  cloudName="ryzoxxsw"
                  publicId={
                    user.picture
                      ? user?.picture
                      : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
                  }
                  width="300"
                  height="300"
                  crop="fit"
                  alt="sample image"
                  className="cloudinary-img"
                />
              </div>

              <div className="comment-bar">
                <input
                  ref={commentRef}
                  type="text"
                  placeholder={`Comment as @${user.username}`}
                />
              </div>
              <i
                className="uil uil-message"
                onClick={postComment}
                style={{ cursor: "pointer" }}
              ></i>
            </div>
            <div className="comments-feed">
              {allComments &&
                allComments.map((each, id) => (
                  <Comments
                    key={id}
                    eachComments={each}
                    setAllComments={setAllComments}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

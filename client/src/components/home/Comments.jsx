import axios from "axios";
import { Image } from "cloudinary-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Comments({ eachComments, setAllComments }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [ownComment, setOwnComment] = useState(eachComments.userId === user.id);
  const [showEdit, setShowEdit] = useState(false);
  const [editedComment, setEditedComment] = useState(eachComments.edited);

  const editCommentRef = useRef();

  const deleteComment = async (commentId) => {
    const confirm = window.confirm("Really want to delete this comment?");
    if (confirm === true) {
      await axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/${commentId}/deleteComment`,
          {
            userId: user.id,
          }
        )
        .then((response) => {
          setAllComments((prev) =>
            [...prev].filter((f) => f._id !== commentId)
          );
        }).catch((error) => console.log(error))
    }
  };
  const editComment = async (commentId) => {
    await axios
      .put(`${process.env.REACT_APP_BACKEND_URL}/${commentId}/editComment`, {
        userId: user.id,
        newComment: editCommentRef.current.value,
      })
      .then((response) => {
        console.log(response);
        setEditedComment(true);
      });
  };
  return (
    <div className="feeds">
      <div className="eachComment">
        <div className="comments-head">
          <div className="user">
            <div className="comment-picture">
              <Image
                cloudName="ryzoxxsw"
                publicId={
                  eachComments?.userData?.picture
                    ? eachComments?.userData?.picture
                    : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
                }
                width="300"
                height="300"
                crop="fit"
                alt="sample image"
              />
            </div>
          </div>
          <div className="comment-info">
            <h5 className="text-muted">
              <i>@{eachComments?.userData?.username}</i>
            </h5>
            {!showEdit ? (
              <div className="comments">{eachComments.comments}</div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="comment-bar">
                  <input
                    ref={editCommentRef}
                    type="text"
                    placeholder={eachComments.comments}
                  />
                </div>
                <i
                  className="uil uil-message"
                  onClick={() => editComment(eachComments._id)}
                  style={{ cursor: "pointer" }}
                ></i>
              </div>
            )}
            {/* <small>Dubai, 15 MINUTES AGO</small> */}
            <div className="comment-actions">
              {ownComment && (
                <div style={{ display: "flex", gap: ".5rem" }}>
                  <Link
                    className="text-muted"
                    onClick={() => setShowEdit(true)}
                  >
                    Edit
                  </Link>
                  <Link
                    className="text-muted"
                    onClick={() => deleteComment(eachComments._id)}
                  >
                    Delete
                  </Link>
                </div>
              )}
              {editedComment ? (
                <p
                  className="text-muted"
                  style={{
                    fontSize: ".7rem",
                    marginLeft: "auto",
                    marginRight: "1rem",
                  }}
                >
                  Edited
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

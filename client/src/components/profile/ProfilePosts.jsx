import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { SkeletonStyle } from "../loader/SkeletonStyle";
import PostCard from "../shared/PostCard";
import coverPic from "../../images/coverPicture.png";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { user } = useSelector((state) => ({ ...state }));
  const params = useParams();
  const profileRef = useRef();
  const coverRef = useRef();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/${params?.id}/userPosts`)
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    };
    fetchPosts();
  }, [user.id, setPosts, params.id]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await axios
          .get(`${process.env.REACT_APP_BACKEND_URL}/user/${params?.id}`)
          .then((response) => {
            setUserData(response.data);
          })
          .catch((error) => console.log(error));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserData();
  }, [userData, params.id]);

  const onCoverChange = async (e) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (
          file.type === "image/jpg" ||
          file.type === "image/jpeg" ||
          file.type === "image/png"
        ) {
          await updateImage(file, "Cover");
        } else {
          toast.error("Uploaded File is not valid.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onProfileChange = async (e) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (
          file.type === "image/jpg" ||
          file.type === "image/jpeg" ||
          file.type === "image/png"
        ) {
          await updateImage(file, "Profile");
        } else {
          toast.error("Uploaded File is not valid.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateImage = async (file, title) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ryzoxxsw");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dl88sskyv/upload",
        formData
      );

      await uploadUpdatedImage(response.data.secure_url, title);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadUpdatedImage = async (url, title) => {
    switch (title) {
      case "Profile":
        try {
          await axios
            .put(
              `${process.env.REACT_APP_BACKEND_URL}/${user.id}/updateProfile`,
              {
                picture: url,
              }
            )
            .then((res) => {
              setUserData((prevState) => {
                return Object.assign({}, prevState, {
                  [prevState.picture]: res.data.picture,
                });
              });
              toast.success("Profile picture successfully updated!", {
                style: {
                  borderRadius: "10px",
                  background: "var(--color-primary)",
                  color: "#fff",
                },
              });
            })
            .catch((error) =>
              toast.error(error, {
                style: {
                  borderRadius: "10px",
                  background: "var(--color-primary)",
                  color: "#fff",
                },
              })
            );
        } catch (error) {
          console.log(error);
        }
        break;
      case "Cover":
        try {
          await axios
            .put(
              `${process.env.REACT_APP_BACKEND_URL}/${user.id}/updateCover`,
              {
                picture: url,
              }
            )
            .then((res) => {
              setUserData((prevState) => {
                return Object.assign({}, prevState, {
                  [prevState.cover]: res.data.cover,
                });
              });
              toast.success("Cover picture successfully updated!", {
                style: {
                  borderRadius: "10px",
                  background: "var(--color-primary)",
                  color: "#fff",
                },
              });
            })
            .catch((error) =>
              toast.error(error, {
                style: {
                  borderRadius: "10px",
                  background: "var(--color-primary)",
                  color: "#fff",
                },
              })
            );
        } catch (error) {
          console.log(error);
        }
        break;
      default:
    }
  };

  return (
    <>
      <div className="ProfileCard">
        <div className="ProfileImages">
          <img
            src={userData?.cover ? userData?.cover : coverPic}
            alt="Cover pic"
            onClick={() => {
              coverRef.current.click();
            }}
          />
          <img
            src={
              userData?.picture
                ? userData?.picture
                : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
            }
            alt="DP"
            onClick={() => {
              profileRef.current.click();
            }}
          />
        </div>

        <div className="ProfileName">
          <span>
            {userData?.first_name} {userData?.last_name}
          </span>
        </div>

        <div className="followStatus">
          <hr />
          <div>
            <div className="follow">
              <span>{userData?.following.length}</span>
              <span>Followings</span>
            </div>
            <div className="vl"></div>
            <div className="follow">
              <span>{userData?.followers.length}</span>
              <span>Followers</span>
            </div>

            <>
              <div className="vl"></div>
              <div className="follow">
                <span>{posts?.length}</span>
                <span>Total Posts</span>
              </div>
            </>
          </div>
          <hr />
        </div>
        <span></span>
        <div style={{ display: "none" }}>
          <input
            type="file"
            name="myImage"
            ref={profileRef}
            onChange={onProfileChange}
          />
        </div>
        <div style={{ display: "none" }}>
          <input
            type="file"
            name="myImage"
            ref={coverRef}
            onChange={onCoverChange}
          />
        </div>
      </div>
      {/* ================ FEED 1 ================== */}
      {loading && (
        <div>
          <SkeletonStyle style={{ margin: "1rem" }} />
          <SkeletonStyle style={{ margin: "1rem" }} />
        </div>
      )}
      {posts.map((eachFeed) => (
        <PostCard eachFeed={eachFeed} key={eachFeed._id} setPosts={setPosts} />
      ))}
    </>
  );
}

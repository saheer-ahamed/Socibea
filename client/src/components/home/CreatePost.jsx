import axios from "axios";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import RingLoader from "react-spinners/RingLoader";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

export default function CreatePost({ setPost }) {
  const { user } = useSelector((state) => ({ ...state }));
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const desc = useRef();
  const imageRef = useRef();
  const isTabletOrMobile = useMediaQuery({ query: "(min-width: 568px)" });

  const [loading, setLoading] = useState(false);

  const reset = () => {
    setImage(null);
    setVideo(null);
    desc.current.value = "";
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === "video/mp4") {
        setVideo(file);
      } else if (
        file.type === "image/jpg" ||
        file.type === "image/jpeg" ||
        file.type === "image/png"
      ) {
        setImage(file);
      } else {
        toast.error("Uploaded File is not valid.");
      }
    }
  };

  const uploadPost = async (postData) => {
    try {
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/post`, postData)
        .then((res) => {
          setLoading(false);
          setPost((prevState) => [res.data, ...prevState]);
          toast.success("Post Successfully uploaded!", {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newPost = {
      userId: user.id,
      desc: desc.current.value,
    };

    if (image !== null && video === null) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "ryzoxxsw");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUDNAME}/upload`,
        formData
      );
      newPost.image = response.data.secure_url;
    } else if (image === null && video !== null) {
      const formData = new FormData();
      formData.append("file", video);
      formData.append("upload_preset", "ryzoxxsw");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUDNAME}/upload`,
        formData
      );
      newPost.video = response.data.secure_url;
    }

    reset();

    if (!newPost.image && newPost.desc.trim().length === 0 && !newPost.video) {
      setLoading(false);
      toast("Provide content or file to make a post.", {
        duration: 4000,
        position: "top-center",
        style: {},
        className: "",
        iconTheme: {
          primary: "#000",
          secondary: "#fff",
        },
        ariaProps: {
          role: "status",
          "aria-live": "polite",
        },
      });
    } else {
      // setPosts(newPost);
      await uploadPost(newPost);
    }
  };

  return (
    <>
      <form className="create-post" onSubmit={handleSubmit}>
        <div className="input-data">
          <div className="profile-picture">
            <img
              src={
                user.picture
                  ? user.picture
                  : "https://res.cloudinary.com/dl88sskyv/image/upload/v1673098428/user-icon-person-icon-client-symbol-login-head-sign-icon-design-vector_f9aypr.jpg"
              }
              alt=""
            />
          </div>
          <input
            ref={desc}
            type="text"
            placeholder={`What's on your mind, ${user.firstname}?`}
            id="create-post"
          />
          <input type="submit" value="Post" className="btn btn-primary" />
        </div>
        <div className="postOptions">
          <div
            className="option"
            onClick={() => {
              imageRef.current.click();
            }}
            style={{ color: "var(--color-success)" }}
          >
            <span>
              <i className="uil uil-image-v"></i>
            </span>
            {isTabletOrMobile && "Photo"}
          </div>
          <div
            className="option"
            style={{ color: "var(--color-yellow)" }}
            onClick={() => {
              imageRef.current.click();
            }}
          >
            <span>
              <i className="uil uil-presentation-play"></i>
            </span>
            {isTabletOrMobile && "Video"}
          </div>
          <div className="option" style={{ color: "var(--color-danger)" }}>
            <span>
              <i className="uil uil-schedule"></i>
            </span>
            {isTabletOrMobile && "Schedule"}
          </div>
          <div style={{ display: "none" }}>
            <input
              type="file"
              name="myImage"
              ref={imageRef}
              onChange={onFileChange}
            />
          </div>
        </div>

        <RingLoader
          color="var(--color-primary)"
          loading={loading}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />

        <div className="previewImage">
          {image ? (
            <span
              onClick={() => {
                setImage(null);
                setVideo(null);
              }}
            >
              <i className="uil uil-multiply"></i>
            </span>
          ) : video ? (
            <span
              onClick={() => {
                setImage(null);
                setVideo(null);
              }}
            >
              <i className="uil uil-multiply"></i>
            </span>
          ) : (
            ""
          )}
          {image ? (
            <img src={URL.createObjectURL(image)} alt="" />
          ) : video ? (
            <video controls>
              <source src={URL.createObjectURL(video)} />
            </video>
          ) : (
            ""
          )}
        </div>
      </form>
    </>
  );
}

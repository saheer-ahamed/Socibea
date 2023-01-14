import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { SkeletonStyle } from "../Loader/SkeletonStyle";
import PostCard from "../shared/PostCard";

export default function Feeds({post, setPost}) {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  // const [likes, setLikes] = useState()
  useEffect(() => {
    setLoading(true);
    // setTimeout(() => {
      
    // }, 3000);
    const fetchPosts = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/${user.id}/timeline`)
        .then((response) => {
          setPost(response.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    };
    fetchPosts()
  }, [user.id, setPost]);

  return (
    <>
      {/* ================ FEED 1 ================== */}
      {loading && (
        <div>
          <SkeletonStyle style={{ margin: "1rem" }} />
          <SkeletonStyle style={{ margin: "1rem" }} />
        </div>
      )}
      {post.map((eachFeed, id) => (
        <PostCard eachFeed={eachFeed} key={id} />
      ))}
    </>
  );
}

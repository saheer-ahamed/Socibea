/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SkeletonStyle } from "../Loader/SkeletonStyle";
import PostCard from "../shared/PostCard";

export default function bookmarkPosts() {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setLoading(true);
    // setTimeout(() => {
    //   ;
    // }, 3000);
    const fetchPosts = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/${user.id}/savedPosts`)
        .then((response) => {
          setPosts(response.data);
          setLoading(false);
        })
        .catch((error) => console.log(error));
    };
    fetchPosts();
  }, [user.id, setPosts]);

  return (
    <>
      <span className="bookmark_title">
        <i className="uil uil-bookmark-full" style={{fontSize: "2rem", color: "green"}}/>
        <h2 className="text-muted" style={{textDecoration: "underline"}}>
          BOOKMARKS
        </h2>
      </span>
      {/* ================ FEED 1 ================== */}
      {loading && (
        <div>
          <SkeletonStyle style={{ margin: "1rem" }} />
          <SkeletonStyle style={{ margin: "1rem" }} />
        </div>
      )}
      {posts.map((eachFeed) => (
        <PostCard eachFeed={eachFeed} key={eachFeed._id} setPosts={setPosts}/>
      ))}
    </>
  );
}

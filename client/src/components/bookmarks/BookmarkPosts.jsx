/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SkeletonStyle } from "../loader/SkeletonStyle";
import PostCard from "../shared/PostCard";

export default function bookmarkPosts() {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setLoading(true);
    const fetchPosts = async () => {
      await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/${user.id}/savedPosts`)
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => console.log(error)).finally(() => setLoading(false))
    };
    fetchPosts();
  }, [user.id, setPosts]);

  return (
    <>
      <span className="bookmark_title">
        <i
          className="uil uil-bookmark-full"
          style={{ fontSize: "2rem", color: "green" }}
        />
        <h2 className="text-muted" style={{ textDecoration: "underline" }}>
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
        <PostCard eachFeed={eachFeed} key={eachFeed._id} setPosts={setPosts} />
      ))}
    </>
  );
}

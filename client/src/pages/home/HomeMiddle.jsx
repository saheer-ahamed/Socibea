import Feeds from "../../components/home/Feeds";
import CreatePost from "../../components/home/CreatePost";
import { useState } from "react";

export default function HomeMiddle() {
  const [post, setPost] = useState([]);

  return (
    <>
      {/* ================ MIDDLE ================== */}
      <div className="middle">
        <CreatePost setPost={setPost} />
        <div className="feeds">
          <Feeds post={post} setPost={setPost} />
        </div>
      </div>
    </>
  );
}

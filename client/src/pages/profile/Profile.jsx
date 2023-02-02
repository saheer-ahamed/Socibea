import ProfilePosts from "../../components/profile/ProfilePosts";

export default function Profile() {
  return (
    <>
      <div className="middle">
        <div className="feeds">
          <ProfilePosts />
        </div>
      </div>
    </>
  )
}
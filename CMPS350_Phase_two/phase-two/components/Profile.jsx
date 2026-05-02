'use client';
import {useRouter} from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Settings from "./Settings";


export default function Profile({user, currentUserId}) {

    const router =  useRouter();
    const [activeTab, setActiveTab] = useState("image");
    const [isFollowing, setIsFollowing] = useState(
        user.followers?.some((f) => f.followerId === currentUserId)
    );
    const [followersCount, setFollowersCount] = useState(user.followers?.length ?? 0);
    const isOwnProfile = user.id === currentUserId;
    const imagePosts = user.posts?.filter((p) => p.type === "image") ?? [];
    const textPosts = user.posts?.filter((p) => p.type === "text") ?? [];
    const displayedPosts = activeTab === "image" ? imagePosts : textPosts;

    async function handleFollow() {
        const res = await fetch(`/api/users/${user.id}/follow`, {method:"POST"})
        const data = await res.json()
        setIsFollowing(data.following)
        setFollowersCount((prev)=> data.following ? prev + 1 : prev - 1)
    }

    return (
        <>
        <div className="profile-body">
        <header className="profile-header">
            <div className="header-row">
                <img src="/images/logo.png" alt="AR squared logo" className="logo" />
                {isOwnProfile && <Settings />}
            </div>
        </header>
       
        <main className="profile-card">

<div className="profile-background"></div>

<div className="profile-img-wrapper">
  <img src={user.profilePicture} alt="profile photo" className="profile-img" />
</div>

<div className="profile-content">

  <div className="profile-top-row">
    <div className="user-info">
      <h3 className="profile-username">{user.username}</h3>
      <p className="bio">{user.bio}</p>
    </div>

    <div className="stats-and-btn">

      <div className="profile-stats">

        <div className="posts-number">
          <span className="count">{user.posts?.length??0}</span>
          <span className="label">Posts</span>
        </div>

        <div className="followers">
          <span className="count">{followersCount}</span>
          <span className="label">Followers</span>
        </div>

        <div className="following">
          <span className="count">{user.following?.length?? 0}</span>
          <span className="label">Following</span>
        </div>

      </div>
{isOwnProfile? (
      <button className="edit-btn" onClick={()=>router.push("/edit")}>Edit Profile</button>
) :
(
    <button className="edit-btn" onClick={handleFollow}>{isFollowing? "Unfollow" : "Follow"}</button>
)}




    </div>

  </div>




</div>
<section className="posts-section">
  <div className="posts-tab">
    <button className={`tab-btn ${activeTab === "image" ? "active": ""}`} data-tab="image" onClick={()=>setActiveTab("image")}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      Posts
    </button>
    <button className={`tab-btn ${activeTab === "text" ? "active": ""}`} data-tab="text" onClick={()=>setActiveTab("text")}>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2">
        <path d="M4 7h16M4 12h16M4 17h10"></path>
      </svg>
      Text
    </button>
  </div>
  <div className="posts" id="posts-container">
    {displayedPosts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", padding: "2rem" }}>
        No {activeTab} posts yet.
    </p>
    ) :
    (
        displayedPosts.map(post => (
            <Link href={`/post/${post.id}`} key={post.id}>
                <div className="post-profile">
                    {post.type === "image" ? (
                        <img src={post.content} alt="post" />
                    ) : (
                        <div><p>{post.content}</p></div>
                    )}
                </div>
            </Link>
        ))
    )
}

  </div>
</section>
</main>
</div>


        </>

    );
}
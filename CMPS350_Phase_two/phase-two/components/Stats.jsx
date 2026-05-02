'use client';

import { useState, useEffect } from 'react';

const Icons = {
  followers: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" fill="#185FA5" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="19" cy="7" r="2.5" fill="#185FA5" opacity=".5" />
      <path d="M21.5 18c0-2.5-1.8-4.5-4-5" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity=".5" />
    </svg>
  ),
  following: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3.5" fill="#534AB7" />
      <path d="M2 20c0-4 3.1-7 7-7s7 3 7 7" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="17" y1="9" x2="21" y2="9" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" opacity=".6" />
      <line x1="19" y1="7" x2="19" y2="11" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" opacity=".6" />
    </svg>
  ),
  posts: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" fill="#BA7517" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" fill="#BA7517" opacity=".55" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" fill="#BA7517" opacity=".55" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" fill="#BA7517" />
    </svg>
  ),
  activeUser: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <polygon points="12,3 14.5,9 21,9.5 16.5,14 18,20.5 12,17 6,20.5 7.5,14 3,9.5 9.5,9" fill="#1D9E75" />
    </svg>
  ),
  likes: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 3 14.5 3 8.5A5 5 0 0 1 12 6a5 5 0 0 1 9 2.5C21 14.5 12 21 12 21Z" fill="#D4537E" />
    </svg>
  ),
  comments: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8l-4 4V5a1 1 0 0 1 1-1Z" fill="#D85A30" />
      <line x1="8" y1="9" x2="16" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="13" y2="12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load stats');
        return res.json();
      })
      .then((data) => {
        const fixed = {
          avgFollowers: Number(data.avgFollowers),
          avgFollowing: Number(data.avgFollowing),
          avgPosts: Number(data.avgPosts),
          mostActiveUser: data.mostActiveUser
            ? { ...data.mostActiveUser.user, postCount: data.mostActiveUser.postCount }
            : null,
          mostLikedPost: data.mostLikedPost
            ? { ...data.mostLikedPost, likeCount: data.mostLikedPost._count?.likes || 0 }
            : null,
          mostCommentedPost: data.mostCommentedPost
            ? { ...data.mostCommentedPost, commentCount: data.mostCommentedPost._count?.comments || 0 }
            : null,
        };
        setStats(fixed);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="stats-loading">Loading stats…</div>;
  if (error) return <div className="stats-error">Error: {error}</div>;

  return (
    <div className="stats-page">
      <div className="stats-grid">
        <NumberCard label="Avg Followers / User" value={stats.avgFollowers} icon={Icons.followers} iconBg="stat-icon-blue" />
        <NumberCard label="Avg Following / User" value={stats.avgFollowing} icon={Icons.following} iconBg="stat-icon-purple" />
        <NumberCard label="Avg Posts / User" value={stats.avgPosts} icon={Icons.posts} iconBg="stat-icon-amber" />

        <UserCard
          label="Most Active User"
          user={stats.mostActiveUser}
          metricLabel="posts"
          metricValue={stats.mostActiveUser?.postCount}
          icon={Icons.activeUser}
          iconBg="stat-icon-teal"
        />
        <PostCard
          label="Most Liked Post"
          post={stats.mostLikedPost}
          metricLabel="likes"
          metricValue={stats.mostLikedPost?.likeCount}
          icon={Icons.likes}
          iconBg="stat-icon-pink"
        />
        <PostCard
          label="Most Commented Post"
          post={stats.mostCommentedPost}
          metricLabel="comments"
          metricValue={stats.mostCommentedPost?.commentCount}
          icon={Icons.comments}
          iconBg="stat-icon-coral"
        />
      </div>
    </div>
  );
}

function NumberCard({ label, value, icon, iconBg }) {
  const formatted = typeof value === 'number' ? value.toFixed(1) : '—';
  return (
    <div className="stat-card stat-card-number">
      <div className={`stat-icon-circle ${iconBg}`}>{icon}</div>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{formatted}</p>
    </div>
  );
}

function UserCard({ label, user, metricLabel, metricValue, icon, iconBg }) {
  if (!user) {
    return (
      <div className="stat-card stat-card-user">
        <div className={`stat-icon-circle ${iconBg}`}>{icon}</div>
        <p className="stat-label">{label}</p>
        <p className="stat-empty">No data yet</p>
      </div>
    );
  }
  return (
    <div className="stat-card stat-card-user">
      <div className={`stat-icon-circle ${iconBg}`}>{icon}</div>
      <p className="stat-label">{label}</p>
      <div className="stat-user-row">
        <img
          src={user.profilePicture || '/images/prof1.png'}
          alt={user.username}
          className="stat-avatar"
        />
        <div>
          <p className="stat-username">@{user.username}</p>
          <p className="stat-metric">{metricValue} {metricLabel}</p>
        </div>
      </div>
    </div>
  );
}

function PostCard({ label, post, metricLabel, metricValue, icon, iconBg }) {
  if (!post) {
    return (
      <div className="stat-card">
        <div className={`stat-icon-circle ${iconBg}`}>{icon}</div>
        <p className="stat-label">{label}</p>
        <p className="stat-empty">No data yet</p>
      </div>
    );
  }
  return (
    <div className="stat-card">
      <div className={`stat-icon-circle ${iconBg}`}>{icon}</div>
      <p className="stat-label">{label}</p>
      <div className="stat-post-preview">
        {post.type === 'image' ? (
          <img src={post.content} alt="Post" className="stat-post-image" />
        ) : (
          <p className="stat-post-text">{post.content}</p>
        )}
      </div>
      <p className="stat-metric">
        {metricValue} {metricLabel} · @{post.user?.username}
      </p>
    </div>
  );
}
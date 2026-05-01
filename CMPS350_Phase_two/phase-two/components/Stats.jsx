'use client';

import { useState, useEffect } from 'react';

// MOCK DATA — used while Person 1 finishes repos/stats.js
// when the real API returns data, set USE_MOCK to false. anyone who finishes please turn it off or remove it :)
// By Rawan :)
const USE_MOCK = true;

const MOCK_STATS = {
  avgFollowers: 4.2,
  avgFollowing: 5.8,
  avgPosts: 3.1,
  mostActiveUser: {
    id: 'abc123',
    username: 'sara_a',
    profilePicture: '/images/prof1.png',
    postCount: 42,
  },
  mostLikedPost: {
    id: 'p1',
    type: 'text',
    content: 'Just launched my new portfolio site!',
    caption: 'Big day',
    likeCount: 128,
    user: { username: 'mira', profilePicture: '/images/prof1.png' },
  },
  mostCommentedPost: {
    id: 'p2',
    type: 'text',
    content: 'Hot take: tabs > spaces. Fight me.',
    caption: '',
    commentCount: 94,
    user: { username: 'leen', profilePicture: '/images/prof1.png' },
  },
};


export default function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (USE_MOCK) {
      const timer = setTimeout(() => {
        setStats(MOCK_STATS);
        setLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    fetch('/api/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);
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
    <div className="stats-grid">
      <NumberCard label="Avg Followers / User" value={stats.avgFollowers} />
      <NumberCard label="Avg Following / User" value={stats.avgFollowing} />
      <NumberCard label="Avg Posts / User" value={stats.avgPosts} />

      <UserCard
        label="Most Active User"
        user={stats.mostActiveUser}
        metricLabel="posts"
        metricValue={stats.mostActiveUser?.postCount}
      />
      <PostCard
        label="Most Liked Post"
        post={stats.mostLikedPost}
        metricLabel="likes"
        metricValue={stats.mostLikedPost?.likeCount}
      />
      <PostCard
        label="Most Commented Post"
        post={stats.mostCommentedPost}
        metricLabel="comments"
        metricValue={stats.mostCommentedPost?.commentCount}
      />
    </div>
  );
}


function NumberCard({ label, value }) {
  const formatted = typeof value === 'number' ? value.toFixed(1) : '—';
  return (
    <div className="stat-card stat-card-number">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{formatted}</p>
    </div>
  );
}

function UserCard({ label, user, metricLabel, metricValue }) {
  if (!user) {
    return (
      <div className="stat-card">
        <p className="stat-label">{label}</p>
        <p className="stat-empty">No data yet</p>
      </div>
    );
  }
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <div className="stat-user-row">
        <img
          src={user.profilePicture || '/images/prof1.png'}
          alt={user.username}
          className="stat-avatar"
        />
        <div>
          <p className="stat-username">@{user.username}</p>
          <p className="stat-metric">
            {metricValue} {metricLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

function PostCard({ label, post, metricLabel, metricValue }) {
  if (!post) {
    return (
      <div className="stat-card">
        <p className="stat-label">{label}</p>
        <p className="stat-empty">No data yet</p>
      </div>
    );
  }
  return (
    <div className="stat-card">
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
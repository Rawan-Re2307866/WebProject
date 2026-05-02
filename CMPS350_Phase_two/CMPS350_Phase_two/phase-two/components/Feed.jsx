'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Feed({ currentUserId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/feed')
      .then((r) => r.json())
      .then((res) => {
        setPosts(res.data || res || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error('Failed to load feed', e);
        setLoading(false);
      });
  }, []);

  async function toggleLike(postId) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const { liked } = await res.json();

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const likes = liked
            ? [...p.likes, { userId: currentUserId, postId }]
            : p.likes.filter((l) => l.userId !== currentUserId);
          return { ...p, likes };
        })
      );
    } catch (e) {
      console.error('Like toggle failed', e);
    }
  }

  if (loading) {
    return (
      <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
        Loading feed...
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
        No posts from users you follow. Start following people to see their posts!
      </p>
    );
  }

  return (
    <section className="post-container">
      {posts.map((post) => {
        const liked = post.likes?.some((l) => l.userId === currentUserId);
        const likeCount = post.likes?.length ?? 0;

        return (
          <article key={post.id} className="post" data-post-id={post.id}>
            {/* Header: avatar + username + time */}
            <div className="post-header">
              <Link href={`/profile/${post.user.id}`}>
                <img
                  src={post.user.profilePicture}
                  alt={`${post.user.username} profile picture`}
                  className="profile-pic"
                />
              </Link>
              <div className="post-user-info">
                <Link href={`/profile/${post.user.id}`}>
                  <h3 className="username">{post.user.username}</h3>
                </Link>
                <span className="post-time">{timeAgo(post.createdAt)}</span>
              </div>
            </div>

            {/* Content (clickable -> post detail) */}
            <Link href={`/post/${post.id}`} style={{ display: 'block' }}>
    {post.type === 'image' ? (
        <div className="post-content" style={{ cursor: 'pointer' }}>
            <img src={post.content} alt="Post" style={{ width: '100%', objectFit: 'cover' }} />
        </div>
    ) : (
        <div className="text-post-content">
            <p>{post.content}</p>
        </div>
    )}
</Link>

            {/* Like + comment actions */}
            <div className="post-actions">
              <button
                className={`like-btn ${liked ? 'liked' : ''}`}
                onClick={() => toggleLike(post.id)}
                aria-label="Like post"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
              </button>
              <span className="like-count">{likeCount}</span>

              <Link
                href={`/post/${post.id}`}
                className="comment-btn"
                aria-label="Open comments"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#83778d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12.4 3a5.34 5.34 0 0 1 4.906 3.239a5.333 5.333 0 0 1 -1.195 10.6a4.26 4.26 0 0 1 -5.28 1.863l-3.831 2.298v-3.134a2.668 2.668 0 0 1 -1.795 -3.773a4.8 4.8 0 0 1 2.908 -8.933a5.33 5.33 0 0 1 4.287 -2.16" />
                </svg>
              </Link>
            </div>

            {/* Caption */}
            <div className="post-caption">
              <span className="caption-user">
                <strong>{post.user.username}</strong>
              </span>{' '}
              <span className="caption-text">{post.caption || ''}</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function timeAgo(iso) {
  const now = new Date();
  const past = new Date(iso);
  const diffMs = now - past;

  const min = Math.floor(diffMs / 60000);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (day < 1) {
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m`;
    return `${hr}h`;
  }
  if (day < 7) return `${day}d`;
  if (day < 30) return `${week}w`;
  if (day < 365) return `${month}mo`;
  return `${year}y`;
}
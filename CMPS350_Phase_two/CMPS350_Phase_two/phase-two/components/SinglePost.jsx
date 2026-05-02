'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function timeAgo(iso) {
    const now = new Date();
    const past = new Date(iso);
    const diffMs = now - past;
    const min = Math.floor(diffMs / 60000);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (day < 1) {
        if (min < 1) return 'just now';
        if (min < 60) return `${min}m`;
        return `${hr}h`;
    }
    if (day < 7) return `${day}d`;
    if (day < 30) return `${Math.floor(day / 7)}w`;
    if (day < 365) return `${Math.floor(day / 30)}mo`;
    return `${Math.floor(day / 365)}y`;
}

export default function SinglePost({ currentUserId, post }) {
    const router = useRouter();
    const isOwner = post.user.id === currentUserId;
    const [menuOpen, setMenuOpen] = useState(false);
    const [liked, setLiked] = useState(post.likes?.some(l => l.userId === currentUserId));
    const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState(post.comments ?? []);
    const [editingCaption, setEditingCaption] = useState(false);
    const [caption, setCaption] = useState(post.caption ?? "");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    async function handleLike() {
        const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
    }

    async function handleDelete() {
        const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
        if (res.ok) router.push("/");
    }

    async function handleSaveCaption() {
        const res = await fetch(`/api/posts/${post.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ caption }),
        });
        if (res.ok) setEditingCaption(false);
    }

    async function handleComment(e) {
        e.preventDefault();
        if (!comment.trim()) return;
        const res = await fetch(`/api/comments/${post.id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: comment }),
        });
        if (res.ok) {
            const data = await res.json();
            setComments(prev => [...prev, data]);
            setComment("");
        }
    }

    async function handleDeleteComment(commentId) {
        const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
        if (res.ok) setComments(prev => prev.filter(c => c.id !== commentId));
    }

    return (
        <>
            {/* Delete Confirm Modal */}
            {showDeleteConfirm && (
                <div className="confirm-overlay">
                    <div className="confirm-modal">
                        <h3>Delete Post?</h3>
                        <p>This action cannot be undone.</p>
                        <div className="confirm-btns">
                            <button className="confirm-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                            <button className="confirm-delete-btn" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <main className="post-page">
                <section className="content-part">
                    <article id="post">
                        <div className="post-header">
                            <Link href={`/profile/${post.user.id}`}>
                                <img src={post.user.profilePicture} alt="profile" className="profile-pic" />
                            </Link>
                            <div className="post-user-info">
                                <Link href={`/profile/${post.user.id}`}>
                                    <h3 className="username">{post.user.username}</h3>
                                </Link>
                                <span className="post-time">{timeAgo(post.createdAt)}</span>
                            </div>

                            {isOwner && (
                                <div style={{ position: "relative", marginLeft: "auto" , flexShrink: 0  }}>
                                <button className="menu-btn" tyle={{ margin: 0 }} onClick={() => setMenuOpen(!menuOpen)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M7 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2" />
                                        <path d="M14 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2" />
                                        <path d="M21 12a2 2 0 1 1 -4 0q 0 -.053 .005 -.102a1.996 1.996 0 0 1 1.995 -1.898a2 2 0 0 1 2 2" />
                                    </svg>
                                </button>
                                </div>
                            )}
                        </div>

                        {/* Menu dropdown */}
                        {isOwner && menuOpen && (
                            <>
                                <div className="post-menu-dropdown" >
                                    <button className="post-menu-item edit-post-btn" onClick={() => { setEditingCaption(true); setMenuOpen(false); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit Caption
                                    </button>
                                    <button className="post-menu-item delete-post-btn" onClick={() => { setShowDeleteConfirm(true); setMenuOpen(false); }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                                            <path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                                        </svg>
                                        Delete Post
                                    </button>
                                </div>
                                <button className="menu-close-btn close" onClick={() => setMenuOpen(false)} />
                            </>
                        )}

                        {/* Post content */}
                        <div className={`content ${post.type === "text" ? "post-text" : "post"}`}>
                            {post.type === "image" ? (
                                 <img src={post.content} alt="post" />
                                ) : (
                                <div className="text-post-content">
                            <p>{post.content}</p>
                            </div>
                            )}
                        </div>

                        {/* Like/comment actions */}
                        <div className="post-actions">
                            <button className={`like-btn ${liked ? "liked" : ""}`} onClick={handleLike} aria-label="Like post">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                </svg>
                            </button>
                            <span className="like-count">{likeCount}</span>
                            <Link href="#display-comments" className="comment-btn" aria-label="Open comments">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#83778d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12.4 3a5.34 5.34 0 0 1 4.906 3.239a5.333 5.333 0 0 1 -1.195 10.6a4.26 4.26 0 0 1 -5.28 1.863l-3.831 2.298v-3.134a2.668 2.668 0 0 1 -1.795 -3.773a4.8 4.8 0 0 1 2.908 -8.933a5.33 5.33 0 0 1 4.287 -2.16" />
                                </svg>
                            </Link>
                        </div>

                        {/* Caption - editable inline */}
                        <div className="post-caption">
                            <span className="caption-user"><strong>{post.user.username}</strong></span>
                            {editingCaption ? (
                                <div className="caption-edit">
                                    <input
                                        type="text"
                                        className="caption-input"
                                        value={caption}
                                        onChange={e => setCaption(e.target.value)}
                                        autoFocus
                                    />
                                    <div className="caption-edit-btns">
                                        <button className="caption-save-btn" onClick={handleSaveCaption}>Save</button>
                                        <button className="caption-cancel-btn" onClick={() => { setEditingCaption(false); setCaption(post.caption ?? ""); }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <span className="caption-text">
                                    {caption}
                                    {isOwner && (
                                        <button className="caption-edit-icon" onClick={() => setEditingCaption(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                    )}
                                </span>
                            )}
                        </div>
                    </article>
                </section>

                {/* Comments */}
                <section className="comments-part">
                    <article>
                        <div className="comments">
                            <h5>Comments</h5>
                        </div>

                        <div className="display-comments" id="display-comments">
                            {comments.length === 0 && (
                                <p style={{ color: "#999", fontSize: "0.85rem", textAlign: "center", padding: "1rem" }}>No comments yet.</p>
                            )}
                            {comments.map(c => (
                                <div key={c.id} className="comment-item">
                                    <div className="comment-content">
                                        <span className="caption-user"><strong>{c.user?.username}</strong></span>
                                        <span className="caption-text"> {c.content}</span>
                                        <span className="comment-time">{timeAgo(c.createdAt)}</span>
                                    </div>
                                    {c.userId === currentUserId && (
                                        <button className="comment-delete-btn" onClick={() => handleDeleteComment(c.id)}>×</button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="submit-comment">
                            <form className="comment-here" onSubmit={handleComment}>
                                <input
                                    type="text"
                                    id="comment"
                                    name="comment"
                                    placeholder="Write a comment..."
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    autoComplete="off"
                                />
                                <button className="submit-comment-btn" type="submit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 13a1 1 0 0 0-1-1H5.061a1 1 0 0 1-.75-1.811l6.836-6.835a1.207 1.207 0 0 1 1.707 0l6.835 6.835a1 1 0 0 1-.75 1.811H16a1 1 0 0 0-1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </article>
                </section>
            </main>
        </>
    );
}
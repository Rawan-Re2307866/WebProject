"use client"

import { useEffect, useState } from "react";
import Post from "./Post";

export default function Feed() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function loadFeed() {
            const res = await fetch("/api/feed");
            const data = await res.json();
            setPosts(data);
        }
        loadFeed();
    }, []);

    if (posts.length === 0) {
        return (
            <p style={{ textAlign: "center", color: "#999", padding: "2rem" }}>
                No posts from users you follow. Start following people to see their posts!
            </p>
        );
    }

    return (
        <>
            {posts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </>
    );
}
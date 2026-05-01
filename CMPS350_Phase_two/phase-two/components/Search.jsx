"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Search() {
  const pathname = usePathname();
  if (pathname === "/stats") return null;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/users?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.data || data || []);
      setOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <input
        type="text"
        id="search-input"
        placeholder="Search users..."
        autoComplete="off"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className={`search-results ${open ? "open" : ""}`}>
        {results.length === 0 && query.trim() ? (
          <p
            style={{
              padding: "0.7rem 1rem",
              color: "#999",
              fontSize: "0.85rem",
            }}
          >
            No users found
          </p>
        ) : (
          results.map((user) => (
            <Link
              key={user.id}
              href={`/profile/${user.id}`}
              className="search-result-item"
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
            >
              <img
                src={user.profilePicture || "/images/prof1.png"}
                alt={user.username}
              />
              <span>{user.username}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

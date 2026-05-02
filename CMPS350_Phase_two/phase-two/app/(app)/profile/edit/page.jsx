'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: "",
    bio: "",
    profilePicture: "",
    password: ""
  });

  useEffect(() => {
    async function fetchUser() {
      const sessionRes = await fetch("/api/auth/session");
      if (!sessionRes.ok) return;

      const session = await sessionRes.json();

      const res = await fetch(`/api/users/${session.userId}`);
      const data = await res.json();

      setUser(data);
      setForm({
        username: data.username || "",
        bio: data.bio || "",
        profilePicture: data.profilePicture || "",
        password: ""
      });
    }

    fetchUser();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }
  async function handleImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      setForm((prev) => ({
        ...prev,
        profilePicture: data.url, 
      }));
    } else {
      alert("Upload failed");
    }

  } catch (err) {
    console.error(err);
  }
}
  async function handleSubmit(e) {
    e.preventDefault();

    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    const res = await fetch(`/api/users/${session.userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      router.push(`/profile/${session.userId}`);
    } else {
      alert("Failed to update profile");
    }
  }

  if (!user) return <p>Loading...</p>;

 return (
  <main className="edit-body">
    <h2>Edit Profile</h2>

    <div className="edit-container">

      {/* Avatar */}
      <div className="avatar-section">
       <div
  className="avatar-wrapper"
  onClick={() => document.getElementById("avatar-input").click()}
>
  <img src={form.profilePicture || "/images/default.png"} />

  <div className="avatar-overlay">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="camera-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  </div>

  <input
    type="file"
    id="avatar-input"
    accept="image/*"
    style={{ display: "none" }}
    onChange={handleImageChange}
  />
</div>
        <p className="avatar-hint">Tap photo to change</p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="edit-form">

        <div className="field-group">
          <label>Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
          />
        </div>

        <div className="field-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Tell the world about yourself..."
          />
        </div>

        <hr className="edit-divider" />

        {/* Password Section */}
        <div className="field-group">
          <label>New Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Optional"
          />
        </div>

        {/* Buttons */}
        <div className="btn-row">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => router.back()}
          >
            Cancel
          </button>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>

      </form>
    </div>
  </main>
);
}
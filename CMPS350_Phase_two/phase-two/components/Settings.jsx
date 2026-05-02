'use client';
import {useRouter} from "next/navigation";
import { useState } from "react";
import { useEffect, useRef } from "react";


export default function Settings() {

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

const ref = useRef();

useEffect(() => {
  function handleClickOutside(e) {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

    async function handleLogout() {
        await fetch('/api/auth/logout', {
            method: "POST"
        })
        router.push("/login")
    }

    async function handleDeleteAccount() {

        const session = await fetch('/api/auth/session').then(r => r.json());
        const res = await fetch(`/api/users/${session.userId}`, {method:"DELETE"});
        if(res.ok){
            router.push("/login")
        }
    }


    return (
      <>
      {showDeleteConfirm && (
    <div className="confirm-overlay">
        <div className="confirm-modal">
            <h3>Delete Account?</h3>
            <p>This will permanently delete your account and all your posts.</p>
            <div className="confirm-btns">
                <button className="confirm-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button className="confirm-delete-btn" onClick={handleDeleteAccount}>Delete</button>
            </div>
        </div>
    </div>
)}
      <div className="settings-wrapper">
          <button className="header-settings-btn" id="settings-btn" onClick={() => setOpen(!open)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
          </button>
  
          
              <div className={`settings-dropdown ${open ? "open" : ""}`}>
                  <button onClick={handleLogout}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
                          <path d="M497 273L329 441c-15 15-41 4.5-41-17v-96H152c-13.3 0-24-10.7-24-24v-96c0-13.3 10.7-24 24-24h136V88c0-21.4 25.9-32 41-17l168 168c9.3 9.4 9.3 24.6 0 34zM192 436v-40c0-6.6-5.4-12-12-12H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h84c6.6 0 12-5.4 12-12V76c0-6.6-5.4-12-12-12H96c-53 0-96 43-96 96v192c0 53 43 96 96 96h84c6.6 0 12-5.4 12-12z" />
                      </svg>
                      Logout
                  </button>
                  <button id="delete-account-btn" onClick={() => setShowDeleteConfirm(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6l-1 14H6L5 6"/>
                          <path d="M10 11v6M14 11v6"/>
                          <path d="M9 6V4h6v2"/>
                      </svg>
                      Delete Account
                  </button>
              </div>
          
      </div>
      </>
  );
          }
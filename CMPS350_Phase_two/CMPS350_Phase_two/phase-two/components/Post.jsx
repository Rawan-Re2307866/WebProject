"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";



export default function Post({user}) {
    const router = useRouter();
    const [postType, setPostType] = useState("text");
    const [caption, setCaption] = useState("");
    const [textContent, setTextContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");

    const [imagePreview, setImagePreview] = useState(null);

        

    async function handleSubmit() {
        setError("");

        if(postType === "text" && !textContent.trim()) {
            setError("Post Content is required")
            return;
        }
        if(postType === "image" && !imageFile) {
            setError("Please select an image");
            return;
        }

        let content = textContent;
        if (postType === "image") {
            content = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(imageFile);
        });
    }

        const res = await fetch("/api/posts", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                type:postType,
                content,
                caption
            }),
        });

        if (res.ok) {
            router.push("/")
        }
        else {
            try {
                const data = await res.json();
                setError(data.error || "Failed to create post")

            }
            catch {
                setError("Failed to create post");
            }
        }
        
    }


    return (
        <>
       

   
        <h3 className="create-post-header">Create Post</h3>

        <main className="create-post-page">

            <div className="create-post-user">
                
                <Link href={`/profile/${user.id}`}>
                    <img src={user.profilePicture} alt="User profile picture" className="user-pic" />
                </Link>

                <div className="create-post-user-info">
                    <Link href={`/profile/${user.id}`}>
                        <h3 className="create-post-username">{user.username}</h3>
                    </Link>
                </div>

            </div>
        
        
            <div className="create-post-content">

                <textarea name="caption-text" id="caption-text" cols="30" rows="5" placeholder="Type your post caption here..." 
                value={caption} onChange={(e)=> setCaption(e.target.value)}></textarea>

                <div className="post-type-selection-bar">
        
                    <button className="text-post-type" onClick={()=> setPostType("text")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-text-recognition">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
                            <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                            <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                            <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
                            <path d="M12 16v-7" />
                            <path d="M9 9h6" />
                        </svg>
                    </button>

                    <button className="image-post-type" onClick={()=> setPostType("image")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-image-in-picture">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M13 15c-2 0 -5 1 -5 5" />
                            <path d="M4 13a2 2 0 0 1 2 -2h5a2 2 0 0 1 2 2v5a2 2 0 0 1 -2 2h-5a2 2 0 0 1 -2 -2l0 -5" />
                            <path d="M4 7v-2a1 1 0 0 1 1 -1h2" />
                            <path d="M11 4h2" />
                            <path d="M17 4h2a1 1 0 0 1 1 1v2" />
                            <path d="M20 11v2" />
                            <path d="M20 17v2a1 1 0 0 1 -1 1h-2" />
                        </svg>
                    </button>

                </div>

            </div>
            

            <div className={`text-image-content ${postType === "image" ? "media" : "text"}`}>
    {postType === "image" ? (
        <label htmlFor="media-content" className="image-upload-area">
            {imagePreview
                ? <img src={imagePreview} alt="preview" className="image-preview" />
                : <div className="image-upload-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M15 8h.01" />
                        <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
                        <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                        <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
                    </svg>
                    <span>Click to upload image</span>
                </div>
            }
            <input type="file" id="media-content" accept="image/*"
                onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                }}
                style={{ display: "none" }}
            />
        </label>
    ) : (
        <textarea
            id="text-content"
            name="post-text-content-field"
            placeholder="Write your text here..."
            autoComplete="off"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
        />
    )}
    </div>

    {error && <span style={{ color: "red" }}>{error}</span>}

        <button className="post-content-btn" onClick={handleSubmit}> post </button>

   
    
    

</main>






        </>
    );
    
    
    
}
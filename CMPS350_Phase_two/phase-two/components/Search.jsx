"use client"

import Link from "next/link";



export default async function Search({}) {
    
    return (
    <>
         <div className="search-wrapper">
            <input type="text" id="search-input" placeholder="Search users..." autoComplete="off" />
            <div className="search-results" id="search-results"></div>
        </div>
    </>
    );
         
}
import Link from "next/link";
import Search from "./Search";



export default async function Header({}) {
    return (
    <>
    <header className="top-bar">
        <img src="images/logo.png" alt="AR squared logo" className="logo" />
         <Search />
    </header>
    </>
    );
         
}
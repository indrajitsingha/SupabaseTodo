import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const Navbar = () => {
    const link = [
        {
            label: "Home",
            Link: "/",
        },
        {
            label: "Addbrand",
            Link: "/Addbrand",
        },
        {
            label: "Addcar",
            Link: "/Addcar",
        }, {
            label: "Ctaegory",
            Link: "/Ctaegory",
        }
    ]
    return (
        <>
        <ul>
            {
                link.map((val) => <li key={val.label}><NavLink to={val.Link}>{val.label}</NavLink></li>)
            }

        </ul>
        <Outlet/>
        </>
    )
}

export default Navbar
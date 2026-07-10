"use client";
import React from "react";
import { useSession, signIn, signOut } from "@/providers/AuthProvider";
import { usePathname } from 'next/navigation'

export default function LoginBtn({ texto }) {
    const pathName = usePathname();

    return(
        <button className="flex rounded-md px-4 py-2 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo" onClick={() => signIn({ callbackUrl: process.env.BASE_FETCH_URL + pathName })}>{texto}</button>
    )
}


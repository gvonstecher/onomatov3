"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";

export const Header = () => {

    const { data: session, status} = useSession();
    
        return (
            <header className="bg-white">
                <nav className="flex flex-row justify-between items-center p-2 py-4">
                    <h1 className="logo text-4xl font-bold italic"><Link href="/">Onomato</Link></h1>
                    <form className="bg-neutral-100 py-2 px-5 rounded-md flex flex-row">
                        <button type="submit">
                            <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"/></svg>
                        </button>
                        <input type="text" name="search" className="bg-transparent w-96 text-sm border-0 focus:outline-none" placeholder="Buscar Historieta por titulos, Autores  y Palabras Claves" />
                    </form>
                        {
                        (session !== undefined && session !== null) ? (
                            <div>
                                <span><Link href="/dashboard/profile">Hola {session.user.name}</Link></span> 
                                <button onClick={() => signOut()} className="font-semibold p-2 hover:opacity-60">Salir</button>
                            </div>
                        ) : (
                            <div>
                                <button className="font-semibold p-2 hover:opacity-60" onClick={() => signIn()}>Acceder</button>
                            </div>
                        )
                        }
                </nav>
            </header>
        )
};
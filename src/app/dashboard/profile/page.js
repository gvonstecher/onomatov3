
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import {redirect} from 'next/navigation';
import { getAuthSession } from "@/utils/auth";

import { BookList } from "@/components/book/bookList";
import { AuthorList } from "@/components/author/authorList";
import { Sidebar } from '@/components/layout/authorSidebar';

async function getFollowedAuthors(id){
    const followedAuthors = await prisma.followedAuthor.findMany({
        include: { author: true},
        where: {id_user: id },
    });
    return followedAuthors;
};

async function getFollowedBooks(id) {
    const followedBooks = await prisma.followedBook.findMany({
        include: { book: true},
        where: {id_user: id },
    });
    return followedBooks;
};

async function getUser(id) {
    const user = await prisma.user.findUnique({
        include: { author: { include:{ books: true, profile_file:true, header_file:true, socialmedias:true } } },
        where: { id: id},
    });
    return user;
};


export default async function Profile() {

    const session = await getAuthSession();
    // If not, redirect to the homepage
    if (!session || !session.user){
        redirect('/');
    }


    const followedAuthors = await getFollowedAuthors(session.user.id );
    const followedBooks = await getFollowedBooks(session.user.id );
    const user = await getUser(session.user.id );
    console.log(user);

    return (
        <div className="container mx-auto flex flex-col lg:flex-row py-5 gap-8">
                <main className="w-full lg:w-4/5">
                    {user.author && 
                        <>
                            <BookList 
                                title="Tus libros" 
                                bookList={user.author?.books}
                                author={true}
                                cols={4}
                                create={true}
                            />
                        </>
                    }
                        <BookList 
                                title="Libros Seguidos" 
                                bookList={followedBooks}
                                author={true}
                                cols={4} 
                        />
        
                        <AuthorList title="Autores Seguidos" authorList={followedAuthors} />
                </main>

                    {user.author
                        ? 
                            <Sidebar author={user.author} titulo='Tu perfil de autor' edit={true} />                                
                        : (
                            <aside className="w-full lg:w-1/5">
                                <h2 className="font-bold text-xl text-center py-3">Tu perfil de usuario</h2>
                                <Image
                                    src={user.image}
                                    className="w-full aspect-square rounded-full object-cover"
                                    width={200}
                                    height={200}
                                    alt={user.name}
                                />
                                <p className="font-bold text-center pt-3">{user.name}</p>
                                <p className="font-bold text-center py-0">{user.email}</p>
                                <Link href="/dashboard/author/edit"  className="text-center flex rounded-md my-3 px-4 py-2 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo">Queres convertirte en autor?</Link>
                            </ aside>
                            
                        )
                    }

            </div>
    );

}

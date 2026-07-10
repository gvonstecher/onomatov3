
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import {redirect} from 'next/navigation';
import { getPayload } from "payload";
import config from "@payload-config";
import { getAuthSession } from "@/utils/auth";

import { BookList } from "@/components/book/bookList";
import { AuthorList } from "@/components/author/authorList";
import { Sidebar } from '@/components/layout/authorSidebar';

// All dashboard reads come from Payload's Local API. followed-authors and
// followed-books are join collections, so we populate at depth 2 and unwrap
// the related author/book.
async function getData(userId) {
    const payload = await getPayload({ config });
    const [authorRes, followedAuthorsRes, followedBooksRes, user] = await Promise.all([
        payload.find({ collection: "authors", where: { user: { equals: userId } }, depth: 1, limit: 1 }),
        payload.find({ collection: "followed-authors", where: { user: { equals: userId } }, depth: 2 }),
        payload.find({ collection: "followed-books", where: { user: { equals: userId } }, depth: 2 }),
        payload.findByID({ collection: "users", id: userId }).catch(() => null),
    ]);

    const author = authorRes.docs[0] || null;
    let books = [];
    if (author) {
        const booksRes = await payload.find({ collection: "books", where: { author: { equals: author.id } }, depth: 1 });
        books = booksRes.docs;
    }

    return {
        author,
        books,
        followedAuthors: followedAuthorsRes.docs.map((f) => f.author).filter(Boolean),
        followedBooks: followedBooksRes.docs.map((f) => f.book).filter(Boolean),
        user,
    };
}


export default async function Profile() {

    const session = await getAuthSession();
    // If not, redirect to the homepage
    if (!session || !session.user){
        redirect('/');
    }

    const { author, books, followedAuthors, followedBooks, user } = await getData(session.user.id);

    return (
        <div className="container mx-auto flex flex-col lg:flex-row py-5 gap-8">
                <main className="w-full lg:w-4/5">
                    {author &&
                        <>
                            <BookList
                                title="Tus libros"
                                bookList={books}
                                author={false}
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

                    {author
                        ?
                            <Sidebar author={author} titulo='Tu perfil de autor' edit={true} />
                        : (
                            <aside className="w-full lg:w-1/5">
                                <h2 className="font-bold text-xl text-center py-3">Tu perfil de usuario</h2>
                                <Image
                                    src={user?.image || "/img/authorDefault.jpg"}
                                    className="w-full aspect-square rounded-full object-cover"
                                    width={200}
                                    height={200}
                                    alt={user?.name || ""}
                                />
                                <p className="font-bold text-center pt-3">{user?.name}</p>
                                <p className="font-bold text-center py-0">{user?.email}</p>
                                <Link href="/dashboard/author/edit"  className="text-center flex rounded-md my-3 px-4 py-2 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo">Queres convertirte en autor?</Link>
                            </ aside>

                        )
                    }

            </div>
    );

}

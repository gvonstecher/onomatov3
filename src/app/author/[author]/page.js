import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import { Inter } from "next/font/google";
import { Sidebar } from '@/components/layout/authorSidebar';
import { BookList } from '@/components/book/bookList';


async function getAuthor(slug) {
    const author = await prisma.author.findUnique({
        where: { slug: slug},
        include: { 
            socialmedias: true,
            profile_file: true,
            header_file: true
        },
    });
    return author;
    
};

async function getBooks(authorId) {
    const books = await prisma.Book.findMany({
        where: {
            id_author: authorId
        },
        include: {
            cover_file:true
        }
    });
    return books;
    
};


export default async function Author({params}) {

    const author = await getAuthor(params.author);
    const books = await getBooks(author.id);

    return (
        <>
            <section id="hero-internal" className="relative">
            <Image
					src={`/img/authors/${author.id}/${author.header_file.hash}`}
					className="w-full object-cover object-center max-h-80"
                    width={1500}
                    height={150}
                    sizes="100vw"
					alt={author.name}
				/>
            </section>
            <div className="container mx-auto flex flex-col lg:flex-row py-5 gap-8">
                <main className="w-full lg:w-4/5">
                <BookList 
                        title="Titulos del Autor" 
                        bookList={books}
                        author={false}
                        cols={4} 
                    />
                </main>

                <Sidebar author={author} />

            </div>

        </>
    );
  }
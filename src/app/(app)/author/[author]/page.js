import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { Sidebar } from '@/components/layout/authorSidebar';
import { BookList } from '@/components/book/bookList';

// Reads come from Payload's Local API. socialmedias is an array field and
// profile/header photos are upload relationships (populated at depth 1).
async function getAuthor(slug) {
    const payload = await getPayload({ config });
    const res = await payload.find({
        collection: "authors",
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
    });
    return res.docs[0];
}

async function getBooks(authorId) {
    const payload = await getPayload({ config });
    const res = await payload.find({
        collection: "books",
        where: { author: { equals: authorId } },
        depth: 1,
    });
    return res.docs;
}


export default async function Author({params}) {

    const { author: authorSlug } = await params;
    const author = await getAuthor(authorSlug);
    if (!author) notFound();
    const books = await getBooks(author.id);

    return (
        <>
            <section id="hero-internal" className="relative">
            <Image
					src={author.headerPhoto?.url || "/img/heroBig.png"}
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
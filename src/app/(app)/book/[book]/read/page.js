import Image from "next/image";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { getAuthSession } from "@/utils/auth";
import ComprarBtn from "@/components/actions/comprarBtn";
import LoginBtn from "@/components/actions/loginBtn";

async function getBook(payload, slug) {
    const res = await payload.find({
        collection: "books",
        where: { slug: { equals: slug } },
        depth: 1,
        limit: 1,
    });
    return res.docs[0];
}

async function isBought(payload, bookId, userId) {
    if (!userId) return false;
    const res = await payload.find({
        collection: "followed-books",
        where: { book: { equals: bookId }, user: { equals: userId } },
        limit: 1,
    });
    return Boolean(res.docs[0]?.bought);
}

async function getPages(payload, bookId, upTo) {
    const where = { book: { equals: bookId } };
    if (upTo) where.pageNumber = { less_than_equal: upTo };
    const res = await payload.find({
        collection: "book-pages",
        where,
        sort: "pageNumber",
        depth: 1,
        limit: 1000,
    });
    return res.docs;
}

async function getTeaserPage(payload, bookId, pageNumber) {
    const res = await payload.find({
        collection: "book-pages",
        where: { book: { equals: bookId }, pageNumber: { equals: pageNumber } },
        depth: 1,
        limit: 1,
    });
    return res.docs[0] || null;
}

export default async function BookReader({ params }) {

    const session = await getAuthSession();
    const bookSlug = (await params).book;

    const payload = await getPayload({ config });
    const book = await getBook(payload, bookSlug);
    if (!book) notFound();

    // admin/editor read the whole book without buying
    const roles = session?.user?.roles || [];
    const isStaff = roles.includes("admin") || roles.includes("editor");
    const bought = isStaff || await isBought(payload, book.id, session?.user?.id);

    let bookPages = [];
    let lastPage = null;

    if (bought) {
        bookPages = await getPages(payload, book.id);
    } else {
        const freePages = book.lastFreePage || 0;
        bookPages = await getPages(payload, book.id, freePages);
        lastPage = await getTeaserPage(payload, book.id, freePages + 1);
    }

    return (
        <div className="comicContainer text-center">
            {bookPages.map((page) => (
                <Image
                    key={page.id}
                    src={page.image?.url || "/img/bookCover1.png"}
                    alt={book.slug + page.pageNumber}
                    className="py-1 mx-auto"
                    width={960}
                    height={1024}
                    sizes="480 640 780 960"
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            ))}
            {lastPage && (
                <div className="relative">
                    <div className="absolute w-full h-2/4 top-0 bg-gradient-to-b from-transparent to-white"></div>
                    <div className="absolute w-full h-2/4 bottom-0 bg-white"></div>
                    <div className="absolute top-2/4 text-center w-full z-10">
                        {session
                            ? <ComprarBtn book={book} author={book.credits?.[0]?.author} size="big" />
                            : (
                                <>
                                    <LoginBtn texto={'Comprar libro Digital'} />
                                    <ComprarBtn book={book} author={book.credits?.[0]?.author} size="big" />
                                </>
                            )}
                    </div>
                    <Image
                        src={lastPage.image?.url || "/img/bookCover1.png"}
                        alt="last"
                        className="py-1 mx-auto"
                        width={960}
                        height={1024}
                        sizes="480 640 780 960"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </div>
            )}
        </div>
    );
}

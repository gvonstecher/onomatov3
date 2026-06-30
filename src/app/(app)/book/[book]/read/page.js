import Image from "next/image";
import Link from 'next/link';
import { getAuthSession } from "@/utils/auth";
import { Sidebar } from '@/components/layout/authorSidebar';
import ComprarBtn from "@/components/actions/comprarBtn";
import LoginBtn from "@/components/actions/loginBtn";


async function getBook(slug) {
    const book = await prisma.Book.findFirst({
        where: {
            slug: slug,
        },
        include:{
            cover_file:true,
            followedBy:true
        }
    });
    return book;  
};

async function getBookFollowed(bookId, userId) {
    const bookFollowed = await prisma.FollowedBook.findFirst({
        where: {
            id_book: bookId,
            id_user:userId
        }
    });
    return bookFollowed;  
};

async function getBookPages(bookId, lastFreePage = 0){
    let bookPagesQuery = null;

    if(lastFreePage){
        bookPagesQuery = {
            where: {
                id_book: bookId,
                page_number: {
                    lte: (lastFreePage),
                }
            },
            orderBy: {
                page_number:'asc'
            },
            include: {
                page_file: true
            }
        };
    } else {
        bookPagesQuery = {
            where: {
                id_book: bookId,
                
            },
            orderBy: {
                page_number:'asc'
            },
            include: {
                page_file: true
            }
        };
    }

    const bookPages = await prisma.BookPage.findMany(bookPagesQuery);
    return bookPages;

}

async function getLastPage(bookId, lastFreePage){
    const lastPage = await prisma.BookPage.findFirst({
        where: {
            id_book: bookId,
            page_number: (lastFreePage + 1),
        },
        include: {
            page_file: true
        }
    });

    return lastPage;
}


async function getAuthor(idAuthor) {
    const author = await prisma.author.findUnique({
        where: { id: idAuthor},
        include: { 
            socialmedias: true,
            profile_file: true,
            header_file: true
        },
    });
    return author;
    
};


export default async function BookPages({params}) {


    const session = await getAuthSession();

    const bookSlug = (await params).book;
    const book = await getBook(bookSlug);

    const bookFollowed = await getBookFollowed(book.id, session.id);
    console.log(bookFollowed);

    let lastPageNum = null;
    let lastPage = null;

    if(session & bookFollowed & bookFollowed?.bought){
        lastPageNum = 0;
    } else {
        lastPageNum = book.last_free_page;
        lastPage = await getLastPage(book.id, lastPageNum);
    };
    
    const bookPages = await getBookPages(book.id, lastPageNum);


    const author = await getAuthor(book.id_author, book.id);

   
    return(
        <div className="comicContainer text-center">
            {bookPages.map((page) => (
                <Image
                    key={page.id}
                    src={`/img/books/${book.id}/${page.page_file.hash}`}
                    alt={book.slug + page.page_number}
                    className="py-1 mx-auto"
                    width={960}
                    height={1024}
                    sizes="480 640 780 960"
                    style={{
                        maxWidth: '100%',
                        height: 'auto',
                    }}
                />
            ))}
            {
                (lastPage) && (
                    session ? (
                        <div className="relative">
                            
                            <div className="absolute w-full h-2/4 top-0 bg-gradient-to-b from-transparent to-white"></div>
                            <div className="absolute w-full h-2/4 bottom-0 bg-white"></div>
                            <div className="absolute top-2/4 text-center w-full z-10">
                                <ComprarBtn book={book} author={author} size="big"/>
                            </div>
                            <Image
                                src={`/img/books/${book.id}/${lastPage.page_file.hash}`}
                                alt="last"
                                className="py-1 mx-auto"
                                width={960}
                                height={1024}
                                sizes="480 640 780 960"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                }}
                            />
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute w-full h-2/4 top-0 bg-gradient-to-b from-transparent to-white"></div>
                            <div className="absolute w-full h-2/4 bottom-0 bg-white"></div>
                            <div className="absolute top-2/4 text-center w-full z-10">
                                <LoginBtn texto={'Comprar libro Digital'} />
                                <ComprarBtn book={book} author={author} size="big"/>
                            </div>
                            <Image
                                src={`/img/books/${book.id}/${lastPage.page_file.hash}`}
                                alt="last"
                                className="py-1 mx-auto"
                                width={960}
                                height={1024}
                                sizes="480 640 780 960"
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                }}
                            />
                        </div>
                    ) 
                )
            }
        </div>
    )
}
/*
export const getServerSideProps = async (context) => {
    const session = await getSession(context);

    const book = await prisma.Book.findFirst({
        where: {
            slug: context.params.book,
        }
    });

    let lastPage = null;
    let bookPagesQuery = null;
    
    if(session){
        bookPagesQuery = {
                where: {
                    id_book: book.id,
                    
                },
                orderBy: {
                    page_number:'asc'
                }
            };
    } else {
        bookPagesQuery = {
            where: {
                id_book: book.id,
                page_number: {
                    lte: (book.last_free_page),
                }
            },
            orderBy: {
                page_number:'asc'
            }
        };

        lastPage = await prisma.BookPage.findFirst({
            where: {
                id_book: book.id,
                page_number: (book.last_free_page + 1),
            }
        });
    }
    
    const bookPages = await prisma.BookPage.findMany(bookPagesQuery);
    return {
        props: { 
          book: JSON.parse(JSON.stringify(book)),
          bookPages: JSON.parse(JSON.stringify(bookPages)),
          lastPage: JSON.parse(JSON.stringify(lastPage))
       },
      }


}

*/
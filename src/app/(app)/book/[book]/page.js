import Image from "next/image";
import Link from 'next/link';
import { getAuthSession } from "@/utils/auth";
import { Sidebar } from '@/components/layout/authorSidebar';
import { BookList } from '@/components/book/bookList';
import ComprarBtn from "@/components/actions/comprarBtn";
import DescargarBtn from "@/components/actions/descargarBtn";
import LoginBtn from "@/components/actions/loginBtn";

async function getBook(slug) {
    const book = await prisma.Book.findFirst({
        where: {
            slug: slug,
        },
        include:{
            cover_file:true
        }
    });
    return book;  
};

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

async function getOtherBooks(idAuthor, idBook) {
    const otherBooks = await prisma.Book.findFirst({
        where: {
            id_author: idAuthor,
            NOT: {
                id: idBook
            }
        },
        include:{
            cover_file:true
        }
    });
    return otherBooks;  
};

async function getBookFollowed(idUser, idBook) {
    const bookFollowed = await prisma.FollowedBook.findFirst({
        where: {
            id_user: idUser,
            id_book: idBook
        }
    });
    return bookFollowed;  
};

async function getBookPages(idBook) {
    const bookFollowed = await prisma.BookPage.findMany({
        where: {
            id_book: idBook,
        },
        orderBy: {
            page_number:'asc'
        },
        include: {
            page_file: true
        }
    });
    return bookFollowed;  
};



export default async function Book({params}) {

    const session = await getAuthSession();

    const bookSlug = (await params).book;

    const book = await getBook(bookSlug);
    const author = await getAuthor(book.id_author, book.id);
    const otherBooks = await getOtherBooks(book.id_author);
    let bookFollowed = [] ;
    let bookPagesUrl = [];
    if(session != null){
        bookFollowed = await getBookFollowed(session.user.id, book.id)

        if(bookFollowed?.bought){
            
            bookPagesUrl.push(book.cover_file?.hash);
            const bookPages = await getBookPages(book.id);
            bookPages.map(bookpage => {
                bookPagesUrl.push(bookpage.page_file.hash);
            });

        }

        
    }
   
    return (
        <>
            <section id="hero-internal" className="relative">
                <Image
					src={`/img/authors/${author.id}/${author.header_file?.hash}`}
					className="w-full object-cover object-center max-h-80"
                    width={1500}
                    height={150}
                    sizes="100vw"
					alt={author.name}
				/>
            </section>
            <div className="container mx-auto flex flex-col lg:flex-row py-5 gap-8">
                <main className="w-full lg:w-4/5">
                    <article id="mainTitulo" className="flex gap-8 p-4 border-b border-grisClaro items-top">
                        <div className="w-1/2 text-center">
                            <h2 className="text-3xl font-bold">{book.title}</h2>
                            <ul className="text-center my-6">
                                <li className="inline-block px-2">
                                    <a href={`/book/${bookSlug}/read`} className="">
                                        <button className="flex rounded-md px-4 py-2 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                                            </svg>
                                            Leer
                                        </button>
                                    </a>
                                </li>
                                <li className="inline-block px-2">
                                    <a href="" className="">
                                        <button className="flex rounded-md px-4 py-2 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                            </svg>
                                            Compartir
                                        </button>
                                    </a>
                                </li>
                                {
                                    (bookFollowed && bookFollowed.bought)? 
                                        ( 
                                            <li className="inline-block px-2">
                                                <DescargarBtn book={book} author={author} bookPages={bookPagesUrl}/>
                                            </li>
                                        ) :
                                        (
                                                session ? (
                                                    <li className="inline-block px-2">
                                                        <ComprarBtn book={book} author={author}/>
                                                    </li> 
                                                ) : (
                                                    <li className="inline-block px-2">
                                                        <LoginBtn texto={'Comprar'} />
                                                    </li>
                                                ) 
                                                
                                        )
                                }
                                
                            </ul>

                            <p className="text-xl text-justify">
                            {book.description}
                            </p>
                        </div>

                        <div className="w-1/2 relative">
                            <Image
                                src={`/img/books/${book.id}/${book.cover_file?.hash}`}
                                className="w-full h-auto"
                                alt={book.title}
                                width={470}
                                height={470}
                                sizes="100vw"    
                            />
                        </div>
                    </article>
                    
                    <BookList 
                        title="Otros titulos del Autor" 
                        bookList={otherBooks}
                        author={false}
                        cols={4} 
                    />
                </main>

                <Sidebar author={author} />
                
            </div>

        </>
    );

}
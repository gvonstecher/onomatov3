import Link from "next/link";
import Image from "next/image";

export const BookList = ({ bookList, title= 'Últimos Títulos', author = true, cols='4', create=false }) => (
    
    <section id="bookList" className="px-4 py-6">
        <div className="row flex items-center ">
            <h3 className="text-2xl font-bold">{title}</h3>
            {create && 
                <a class="button bg-rojo text-white rounded-lg py-1 px-2 text-sm ml-5 hover:opacity-60 ease-out duration-300" href="/dashboard/book/create">Agregar Libro</a>
            }
        </div>
        {/* possible Grid values are grid-cols-4 grid-cols-6 grid-cols-8 */}
        <div className={`grid gap-12 grid-cols-${cols} mt-8 flex-wrap`}>
        {bookList.length ? bookList.map((book) => (
            <div
            key={book.id}
            className="text-center ease-out duration-300 hover:transition-all"
            >
                <Link href={`/book/${book.slug}`} className="group">
                    <Image
                    src={`/img/books/${book.id}/${book.cover}`}
                    className="w-full aspect-square rounded-md object-contain transform-all group-hover:transition-all group-hover:scale-110 ease-out duration-300"
                    width={250}
                    height={250}
                    alt="art"
                    />
                    <h4 className="font-bold text-lg leading-5 my-2 line-clamp-3">{book.title}</h4>
                    {author == true && <
                        h5 className="text-grisClaro line-clamp-2">{book.Author.name}</h5> 
                    }
                </Link>
            </div>
        )) : (
                <p>No tienes libros en la lista</p>
        )}
        </div>
    </section>
);

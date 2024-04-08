import Image from "next/image";
import { BookList } from "@/components/book/bookList";
import { AuthorList } from "@/components/author/authorList";
import prisma from "@/utils/connect";


async function getBooks() {
    const books = await prisma.book.findMany({
        include: { author: true},
        take: 6
    });
    return books;
};

async function getAuthors() {
    const authors = await prisma.author.findMany({
        take: 6
    });
    return authors;
};

export default async function Home() {

	const authors = await getAuthors();
    const books = await getBooks();


    return (
		<main>
			  <section id="hero" className=" max-w-full">
				<h2 className="text-lg text-grisClaro text-center my-5">
					Frase canchera
				</h2>
				<div className=" grid grid-rows-3 grid-flow-col gap-2 h-full">
				<div className="row-span-3 bg-slate-600">
					<a href="" className="block h-full overflow-hidden relative">
					<Image
						src="/img/heroBig.png"
						width={1000}
			  height={500}
						className="h-full w-full object-cover object-center hover:scale-110 ease-out duration-300"
						alt="title"
					/>
					</a>
				</div>
				<div>
					<a href="" className="block overflow-hidden h-full relative">
					<Image
						src="/img/heroSmall1.png"
			  width={1000}
			  height={200}
						className="h-full w-full object-cover object-center hover:scale-110 ease-out duration-300"
						alt="title"
					/>
					</a>
				</div>
				<div>
					<a href="" className="block overflow-hidden h-full relative">
					<Image
						src="/img/heroSmall2.png"
			  width={1000}
			  height={200}
						className="h-full w-full object-cover object-center hover:scale-110 ease-out duration-300"
						alt="title"
					/>
					</a>
				</div>
				<div>
					<a href="" className="block overflow-hidden h-full relative">
					<Image
						src="/img/heroSmall3.png"
			  width={1000}
			  height={200}
						className="h-full w-full object-cover object-center hover:scale-110 ease-out duration-300"
						alt="title"
					/>
					</a>
				</div>
				</div>
			</section>
	
			<BookList bookList={books} />
			<AuthorList authorList={authors} />
	
			<section id="homeTags" className="bg-rojo text-white">
				<div className="container mx-auto py-5">
					<span className="text-lg font-medium">Buscar por categoria</span>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag largo</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">SupermegahiperTag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag largo</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">SupermegahiperTag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag largo</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
					<a href="#" className="py-2 px-4 text-sm hover:opacity-70 inline-block">Tag</a>
				</div>
			</section> 
			<section id="homeNewsletter" className="bg-grisTopo text-white">
				<div className="container mx-auto py-5 text-center">
					<form>
						<label htmlFor="suscribite">Suscribite a nuestro newsletter</label>
						<input type="text" name="suscribite" className="mx-3 py-1.5 px-3 rounded w-72 text-grisTopo " />
						<input type="submit" value="suscribirme!" className="button bg-rojo text-white rounded-lg py-2 px-4 hover:opacity-80 hover:cursor-pointer" />
					</form>
				</div>
			</section>
		</main>
    );
}

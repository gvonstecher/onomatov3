import Image from "next/image";
import { getPayload } from "payload";
import config from "@payload-config";
import { BookList } from "@/components/book/bookList";
import { AuthorList } from "@/components/author/authorList";

// Catalog reads now come from Payload's Local API instead of Prisma.
async function getCatalog() {
	const payload = await getPayload({ config });
	const [books, authors] = await Promise.all([
		payload.find({ collection: "books", depth: 1, limit: 6 }),
		payload.find({ collection: "authors", depth: 1, limit: 6 }),
	]);
	return { books: books.docs, authors: authors.docs };
}

export default async function Home() {

	const { books, authors } = await getCatalog();


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

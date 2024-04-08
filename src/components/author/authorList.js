import Link from "next/link";
import Image from "next/image";

export const AuthorList = ({authorList, title= 'Últimos Autores', cols='4' }) => (

    <section id="authorList" className="px-4 py-6">
        <h3 className="text-2xl font-bold">{title}</h3>
        {/* possible Grid values are grid-cols-4 grid-cols-6 grid-cols-8 */}
        <ul className={`flex justify-between items-top grid grid-cols-${cols} gap-12  my-5`}>
        {authorList.length ? authorList.map((author) => (
            <div
            key={author.id}
            className="text-center ease-out duration-300 hover:transition-all"
            >
                <Link href={`/author/${author.slug}`} className="group">
                        <Image 
                        className="w-full aspect-square rounded-full object-cover transform-all group-hover:transition-all group-hover:scale-110 ease-out duration-300" 
                        src={`/img/users/${author.id}/${author.profile_photo}`}
                        alt={author.name}
                        width={200}
                        height={200}
                    />
                        <h4 className="font-bold text-lg leading-5">{author.name}</h4>
                </Link>
            </div>
        )) : (
            <p>No sigues a ningun autor</p>
        )}
        </ul>
    </section>
);

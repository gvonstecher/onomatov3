import Link from 'next/link';
import Image from 'next/image';

export const Sidebar = ({author, titulo='', edit=false}) => (
	
	<aside className="w-full lg:w-1/5">
		{titulo && 
		<h2 className="font-bold text-xl text-center py-3">{titulo}</h2>
		}
		<div id="authorBox" className="p-4 border-b border-grisClaro">
			{author.header_file && 
				<Image
					src={`/img/users/${author.id}/${author.header_file.hash}`}
					className="h-full w-full object-cover"
					width={100}
					height={20}
					sizes="100vw"
					alt={author.name}
				/>
			}
			{author.profile_file && 
				<Image
					src={`/img/users/${author.id}/${author.profile_file.hash}`}
					className="aspect-square rounded-full object-cover mx-auto -mt-20"
					width={130}
					height={130}
					sizes="100vw"
					alt={author.name}
				/>
			}
			<h3 className="font-bold text-xl text-center py-3">{author.name}</h3>
			<ul className="text-center">
				{author.socialmedias && author.socialmedias.map(link=>(   
				<li key={link.id} className="inline-block px-1">
					<a href={link.url} target="_blank" className="inline-block mb-2 ">
						<button className="rounded-full p-3 text-xs font-medium uppercase leading-normal bg-amarillo shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-black hover:text-amarillo">
							{
								(() => { //codigo horrible para usar curly braces 
									switch(link.type){
										case 'facebook':
											return (<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24">
												<path
												d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
											</svg>)
										break;

										case 'twitter':
											return (<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24">
												<path
												d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
											</svg>)
										break;

										case 'instagram':
											return (<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24">
												<path
												d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
											</svg>)
										break;

										case 'linkedin':
											return (<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24">
												<path
												d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
											</svg>)
										break;

										case 'youtube':
											return (<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24">
												<path
												d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
											</svg>)
										break;

										case 'tiktok':
											return (<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 448 512"
												className="h-5 w-5">
												<path
												fill="currentColor"
												d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
											</svg>)
										break;

										case 'twitch':
											return (<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5"
												fill="currentColor"
												viewBox="0 0 24 24">
												<path
												d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z"
												fillRule="evenodd"
												clipRule="evenodd" />
											</svg>)
										break;
									}
							})() //fin codigo horrible para usar curly braces }
							} 
							
							
						</button>
					</a>
				</li>
				))}
				
			</ul>

			<p className="text-justify">{author.bio}</p>
			{edit && 
				<Link href="/dashboard/author/edit"  className="flex rounded-md my-3 px-4 py-4 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo">Editar tu perfil autor</Link>
			}
		</div>

	</aside>
)

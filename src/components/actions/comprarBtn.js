"use client";
import React from "react";
import { useState,useEffect} from "react";
import axios from 'axios';
import { usePathname } from 'next/navigation'



export default function ComprarBtn({ book, author, size='small' }) {
    const [showModal, setShowModal] = useState(false);
    const [suscribe, setSuscribe] = useState(false);
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const pathName = usePathname();

    const product = {
        book,
        author,
        suscribe,
        pathName
    }

    function handleSuscribe(){
        setSuscribe(!suscribe);
    };
      
    async function handleComprar(){
        setLoading(true);
        try {
            const response = await axios.post("/api/checkout/generateOrder", {
              bookId: book.id,
              price: parseInt(book.price),
              suscribeAuthor: suscribe,
              authorId: author.id,
            });

            const order = response.data;
    
            const getLink= await axios.post("/api/checkout/generateLink", {
                title: book.title,
                price: parseInt(book.price),
                returnPath: pathName,
                authorId: author.id,
                orderId: order.id
              });

              const link = getLink.data;
              window.location.href =link.url;
            

        } catch (error) {
            console.error(error);
        }

    }

    return (
        <>

            {
                (size == 'big') ? (
                    <>
                        <p className="mb-3">Para seguir leyendo debes comprar el libro</p>
                        <button
                        className="flex rounded-md mx-auto px-4 py-2 font-medium text-2xl leading-normal bg-rojo text-white shadow-xl transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo"
                        onClick={()=>setShowModal(true)}
                    >
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.25 0H9.75C10.1562 0 10.5 0.34375 10.5 0.75V6H13.2188C13.7812 6 14.0625 6.6875 13.6562 7.09375L8.90625 11.8438C8.6875 12.0625 8.28125 12.0625 8.0625 11.8438L3.3125 7.09375C2.90625 6.6875 3.1875 6 3.75 6H6.5V0.75C6.5 0.34375 6.8125 0 7.25 0ZM16.5 11.75V15.25C16.5 15.6875 16.1562 16 15.75 16H1.25C0.8125 16 0.5 15.6875 0.5 15.25V11.75C0.5 11.3438 0.8125 11 1.25 11H5.8125L7.34375 12.5312C7.96875 13.1875 9 13.1875 9.625 12.5312L11.1562 11H15.75C16.1562 11 16.5 11.3438 16.5 11.75ZM12.625 14.5C12.625 14.1562 12.3438 13.875 12 13.875C11.6562 13.875 11.375 14.1562 11.375 14.5C11.375 14.8438 11.6562 15.125 12 15.125C12.3438 15.125 12.625 14.8438 12.625 14.5ZM14.625 14.5C14.625 14.1562 14.3438 13.875 14 13.875C13.6562 13.875 13.375 14.1562 13.375 14.5C13.375 14.8438 13.6562 15.125 14 15.125C14.3438 15.125 14.625 14.8438 14.625 14.5Z" fill="white"/>
                        </svg>

                        Comprar Libro Digital
                    </button>
                    </>
                    
                ) : (
                    <button
                        className="flex rounded-md px-4 py-2 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo"
                        onClick={()=>setShowModal(true)}
                    >
                        <svg width="17" height="16" viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg"  className="w-6 h-6 mr-2">
                            <path d="M7.25 0H9.75C10.1562 0 10.5 0.34375 10.5 0.75V6H13.2188C13.7812 6 14.0625 6.6875 13.6562 7.09375L8.90625 11.8438C8.6875 12.0625 8.28125 12.0625 8.0625 11.8438L3.3125 7.09375C2.90625 6.6875 3.1875 6 3.75 6H6.5V0.75C6.5 0.34375 6.8125 0 7.25 0ZM16.5 11.75V15.25C16.5 15.6875 16.1562 16 15.75 16H1.25C0.8125 16 0.5 15.6875 0.5 15.25V11.75C0.5 11.3438 0.8125 11 1.25 11H5.8125L7.34375 12.5312C7.96875 13.1875 9 13.1875 9.625 12.5312L11.1562 11H15.75C16.1562 11 16.5 11.3438 16.5 11.75ZM12.625 14.5C12.625 14.1562 12.3438 13.875 12 13.875C11.6562 13.875 11.375 14.1562 11.375 14.5C11.375 14.8438 11.6562 15.125 12 15.125C12.3438 15.125 12.625 14.8438 12.625 14.5ZM14.625 14.5C14.625 14.1562 14.3438 13.875 14 13.875C13.6562 13.875 13.375 14.1562 13.375 14.5C13.375 14.8438 13.6562 15.125 14 15.125C14.3438 15.125 14.625 14.8438 14.625 14.5Z" fill="currentColor"/>
                        </svg>

                        Comprar
                    </button>
                )
            }
            

            {
            showModal ? (


                <div className="modal modal-active fixed w-full h-full top-0 left-0 flex items-center justify-center z-40">
                <div className="modal-overlay absolute w-full h-full bg-black opacity-50" onClick={() => setShowModal(false)}></div>
                
                <div className="modal-container bg-white w-11/12 lg:max-w-lg mx-auto rounded shadow-lg z-50 overflow-y-auto">

                    <div className="modal-content text-left pb-4">

                    <div className="flex justify-between items-center px-6 py-4 bg-slate-300">
                        <p className="text-xl">Libro Digital</p>
                        <div className="modal-close cursor-pointer z-50"  onClick={() => setShowModal(false)}>
                        <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                        </div>
                    </div>

                    <div className="mx-6 py-2 border-b">
                        <p>Comprar <span className="font-bold">{book.title}</span> por <span className="text-xl font-bold">${book.price}</span> <span className="italic">pesos argentinos</span></p>
                    </div>
                    <div className="mx-6 py-2">
                        <p className="text-sm">Incluye la posibilidad de leer el libro en el sitio, como también es descargarlo en formato pdf o cbr</p>
                    </div>
                    <div className="mx-6 py-2 text-sm">
                        <label htmlFor="suscribirme" className="flex">
                            <input id="suscribirme" name="suscribirme-me" type="checkbox" className="mr-3" value={suscribe} onChange={handleSuscribe} />
                        <div className="suscribirme-message">Suscribirme tambien a la lista de {author.name}</div>
                        </label>
                    </div>

                    <div className="flex justify-end pt-2 px-6">
                        {loading ? (
                            <button className="px-4 bg-amarillo font-bold p-3 rounded-lg hover:amarilloDark flex" disabled>
                                <div className="border-gray-300 h-6 w-6 animate-spin rounded-full border-4 border-t-black inline-block mr-1"></div>
                                Generando orden
                            </button>
                        ) : (
                            <button className="px-4 bg-amarillo font-bold p-3 rounded-lg hover:amarilloDark " onClick={handleComprar}>
                             Comprar ahora
                            </button>
                        )}
                    </div>
                    
                    </div>
                </div>
                </div>
            ) : null
            }
        </>
    );
}
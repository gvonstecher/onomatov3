"use client";
import React from "react";
import { useState,useEffect} from "react";
import axios from 'axios';
import { usePathname } from 'next/navigation'
import JSZip from "jszip";


export default function DescargarBtn({ book, author, bookPages, size='small' }) {
    const [showModal, setShowModal] = useState(false);
    const [suscribe, setSuscribe] = useState(false);
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const pathName = usePathname();

    async function handleZip(){
        setLoading(true);

        const zip = new JSZip();

        await Promise.all(bookPages.map(async (bookPage, index) => {

            let fetchfile = `${process.env.NEXT_PUBLIC_BASE_FETCH_URL}/img/books/${book.id}/${bookPage}`;
            let responseImg = await fetch(fetchfile);
            let dataImg = await responseImg.arrayBuffer();
                zip.file(`${index+1}-${bookPage}`, dataImg);
        }));

        const zipData = await zip.generateAsync({
            type: "blob",
            streamFiles: true,
          });
          // Create a download link for the zip file
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(zipData);
          link.download = `${author.name}-${book.slug}.cbz`;
          link.click();

          setLoading(false);
          setShowModal(false);

    }

    async function handlePdf(){
        
        console.log('adsasdasd');

    }

    return (
        <>

            {
                (size == 'big') ? (
                    <>
                        <button
                        className="flex rounded-md mx-auto px-4 py-2 font-medium text-2xl leading-normal bg-rojo text-white shadow-xl transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo"
                        onClick={()=>setShowModal(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                        Descargar Libro Digital
                    </button>
                    </>
                    
                ) : (
                    <button
                        className="flex rounded-md px-4 py-2 font-medium leading-normal bg-rojo text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg hover:bg-white hover:text-rojo"
                        onClick={()=>setShowModal(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                        Descargar 
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
                        <p className="text-xl">Descargar {book.title}</p>
                        <div className="modal-close cursor-pointer z-50"  onClick={() => setShowModal(false)}>
                        <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                        </svg>
                        </div>
                    </div>

                    <div className="mx-6 py-2 border-b">
                        <p>Elegí el formato en el que querés descargar el libro</p>
                    </div>

                    <div className="flex justify-start pt-2 px-6">
                        {loading ? (
                            <>
                                <div className="border-gray-300 h-6 w-6 animate-spin rounded-full border-4 border-t-black inline-block mr-1"></div>
                                Generando archivo de descarga. Espere unos segundos por favor
                            </>
                        ) : (
                            <>
                                <button className="px-4 bg-amarillo font-bold p-3 rounded-lg hover:amarilloDark " onClick={handleZip}>
                                    Descargar en formato .cbz
                                </button>

                                <button className="px-4 bg-amarillo font-bold p-3 rounded-lg hover:amarilloDark " onClick={handlePdf}>
                                    Descargar en formato .pdf
                                </button>
                            </>
                            
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
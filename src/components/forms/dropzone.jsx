"use client";
import React from "react";
import { useDropzone } from "react-dropzone";
import { ReactSortable } from "react-sortablejs";
import { useState, useCallback, useEffect } from "react";

export default function Dropzone({ value='', name, authorId='' }) {

    const [files, setFiles] = useState([]);
    const [ids, setIds] = useState([]);
    const [spinner,setSpinner] = useState(false);

    useEffect(() => {
        const filesId = files.map(file => file.imageId);
        setIds(prevIds => {
            if (prevIds.length !== filesId.length || !prevIds.every((id, index) => id === filesId[index])) {
                return filesId;
            }
            return prevIds;
        });

    }),[files];

    const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
        
        setSpinner(true);

        for (const file of acceptedFiles) {
        //await Promise.all(acceptedFiles.map(async (file) => { 

            const body = new FormData();
		    body.append("file", file);
            const response = await fetch("/api/file", {
                method: "POST",
                body:body
            });
            const data = await response.json();
            file.imageId = data.id;
            setFiles((prevState) => [...prevState, file]);

        //}));
        }

        setSpinner(false);

    }, []);

    const removeFile = index => async (e) => {

        e.preventDefault();

        setSpinner(true);

        const newFiles = [...files];

        const response = await fetch("/api/file", {
			method: "DELETE",
			headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({ id:newFiles[index].imageId }),
		});
        newFiles.splice(newFiles.indexOf(index), 1)
        
        setSpinner(false);
        
        setFiles(newFiles);
        
    }

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({ onDrop });

    return (
        <div>
            <div
                className="bg-white p-4 border-dashed border border-gray-500"
                {...getRootProps()}
            >
                <input id="files" name="files" {...getInputProps()} />
                <input id={name} name={name} type="hidden" defaultValue={ids} />
                {isDragActive ? (
                    <p>Arrojar los archivos aca</p>
                ) : (
                    <p>Arrastrar y arrojar archivos, o click para elegirlos</p>
                )}
            </div>
            
            <ReactSortable
                list={files}
                setList={setFiles}
                animation={200}
                delay={2}
                className="max-h-64 overflow-auto"
            >
                
                {files.length > 0 &&
                    files.map((image, index) => (
                        <div
                            className="flex bg-white mt-1 p-2 items-center justify-between"
                            key={index}
                            draggable="true"
                        >
                            <div className="flex">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                    />
                                </svg>
                                <img
                                    className="w-8 h-auto mx-2"
                                    src={`${URL.createObjectURL(image)}`}
                                    key={index}
                                />
                                <span className="px-2">{image.name}</span>
                            </div>
                            <button
                                className="justify-self-end active:cursor-progress active:opacity-50"
                                onClick={removeFile(index)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
            </ReactSortable>
            {spinner && <span className="spinner"></span>}
        </div>
    );
}

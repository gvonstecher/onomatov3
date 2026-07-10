"use client";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// Uploads a single source PDF to Payload's BookFiles collection and stores the
// created book-file id in a hidden input. When the book is saved with this id,
// its afterChange hook runs the extractBookPages job to render the page images.
export default function Dropzone({ name }) {
    const [fileName, setFileName] = useState("");
    const [fileId, setFileId] = useState("");
    const [spinner, setSpinner] = useState(false);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setSpinner(true);
        const body = new FormData();
        body.append("file", file);
        body.append("_payload", JSON.stringify({}));
        const res = await fetch("/payload-api/book-files", {
            method: "POST",
            body,
            credentials: "include",
        });
        const data = await res.json();
        setSpinner(false);
        setFileId(data?.doc?.id || "");
        setFileName(file.name);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
    });

    return (
        <div>
            <div className="bg-white p-4 border-dashed border border-gray-500 cursor-pointer" {...getRootProps()}>
                <input {...getInputProps()} />
                <input id={name} name={name} type="hidden" value={fileId} readOnly />
                {isDragActive ? (
                    <p>Arrojar el PDF acá</p>
                ) : (
                    <p>Arrastrar el PDF del libro, o click para elegirlo</p>
                )}
            </div>
            {spinner && <span className="spinner"></span>}
            {fileName && <p className="mt-2 text-sm text-gray-600">PDF cargado: {fileName}</p>}
        </div>
    );
}

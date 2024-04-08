"use client"
import React from "react";
import { useState } from "react";
import { useRouter } from 'next/router';


export default function FileInput({ value, name, id,imageType='author'}) {


	let imageFolder = '';
	let internalImageFolder = ''
	if(imageType == 'author'){
		imageFolder = `/img/users/${id}/`;
		internalImageFolder = `./public/img/users/${id}/`;
	} else if(imageType == 'book'){
		imageFolder = `/img/books/${id}/`;
		internalImageFolder = `./public/img/books/${id}/`;
	}
	let imagePath = imageFolder + value;

	const [photo, setPhoto] = useState(value);
    const [photoObjectURL, setPhotoObjectURL] = useState(imagePath);
	const [imageId, setImageId] = useState(id);
	const [spinner,setSpinner] = useState(false);



	const uploadPhoto = async (event) => {

		const body = new FormData();
		body.append("file", event.target.files[0]);
		
		setSpinner(true);
		const response = await fetch("/api/file", {
		  method: "POST",
		  body:body
		});

		const data = await response.json();
		setSpinner(false);
		setImageId(data.id)

		if (event.target.files && event.target.files[0]) {
			const i = event.target.files[0];
			setPhoto(i);
			setPhotoObjectURL(URL.createObjectURL(i));
		  }

	};

	async function handleDelete(e) {
		setSpinner(true);
		setPhoto(null);
		setPhotoObjectURL(null);
		setImageId('')
		const response = await fetch("/api/file", {
			method: "DELETE",
			headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({ id:imageId }),
		});

		
		setSpinner(false);
		e.target.value = '';
	}
	
	return (
		<>
			<input className="form-input block w-full focus:bg-white" id={name} name={name} value={imageId} type="hidden"/>
			<input className="form-input block w-full focus:bg-white" id="file" name="file" type="file" onChange={uploadPhoto} />
			{spinner && <span className="spinner"></span>}
			{(photo && photo != 'undefined') && (
				<div className="flex my-2 items-center ">
					<img src={photoObjectURL} className="max-h-24 pe-4" />
					<button className="shadow-lg font-bold px-2 rounded-full text-gray-600 hover:bg-rojo hover:text-white" onClick={handleDelete}>x</button>
				</div>
			)}
								
		</>
	);
}
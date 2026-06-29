"use client"
import React from "react";
import { useState } from "react";
import { useRouter } from 'next/router';
import Image from "next/image";


export default function FileInput({ imageRecord = {hash:'', id:0}, value, name, parentId,imageType='author'}) {
	console.log(parentId);
	/*let imageFolder = '';
	let internalImageFolder = ''
	if(imageType == 'author'){
		imageFolder = `/img/authors/${parentId}/`;
		internalImageFolder = `./public/img/authors/${parentId}/`;
	} else if(imageType == 'book'){
		imageFolder = `/img/books/${parentId}/`;
		internalImageFolder = `./public/img/books/${parentId}/`;
	}
	let imagePath = imageFolder + imageRecord?.hash;

	*/

	let imgUrl = ''
	switch(imageType){
		case 'author':
			imgUrl = '/img/authors/'+parentId+'/'+imageRecord?.hash;
		break;
		case 'book':
			imgUrl = '/img/books/'+parentId+'/'+imageRecord?.hash;
		break;
	}
	const [photo, setPhoto] = useState(imageRecord?.hash);
    const [photoObjectURL, setPhotoObjectURL] = useState(imgUrl);
	const [imageId, setImageId] = useState(imageRecord?.id);
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
		setPhoto(null);
		//setPhotoObjectURL(null);
		setImageId('')
		const response = await fetch("/api/file", {
			method: "DELETE",
			headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify({ id:imageId }),
		});

		e.target.value = '';
	}
	
	return (
		<>
			<input className="form-input block w-full focus:bg-white" id={name} name={name} value={imageId} type="hidden"/>
			<input className="form-input block w-full focus:bg-white" id="file" name="file" type="file" onChange={uploadPhoto} />
			{spinner && <span className="spinner"></span>}
			{(photo && photo != 'undefined') && (
				<div className="flex my-2 items-center ">
					<Image
                    src={photoObjectURL}
                    className="h-full w-1/3 object-cover"
                    width={200}
                    height={100}
                    sizes="100vw"
                    alt={imageType}
                />
					<button className="w-8 h-8 mx-2 border-2 align-middle self-auto aspect-square shadow-lg font-bold px-2 rounded-full text-gray-600 hover:bg-rojo hover:text-white" onClick={handleDelete}>x</button>
				</div>
			)}
								
		</>
	);
}
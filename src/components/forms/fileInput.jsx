"use client";
import React, { useState } from "react";

// Uploads a single image to Payload's Media collection and stores the created
// media id in a hidden input (read by the server action). Replaces the old
// /api/file + Prisma File flow.
export default function FileInput({ name, media }) {
	const [preview, setPreview] = useState(media?.url || null);
	const [mediaId, setMediaId] = useState(media?.id || "");
	const [spinner, setSpinner] = useState(false);

	const upload = async (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setSpinner(true);
		const body = new FormData();
		body.append("file", file);
		body.append("_payload", JSON.stringify({ alt: file.name }));
		const res = await fetch("/payload-api/media", {
			method: "POST",
			body,
			credentials: "include",
		});
		const data = await res.json();
		setSpinner(false);
		setMediaId(data?.doc?.id || "");
		setPreview(URL.createObjectURL(file));
	};

	const clear = (e) => {
		e.preventDefault();
		setMediaId("");
		setPreview(null);
	};

	return (
		<>
			<input id={name} name={name} value={mediaId} type="hidden" readOnly />
			<input className="form-input block w-full focus:bg-white" type="file" accept="image/*" onChange={upload} />
			{spinner && <span className="spinner"></span>}
			{preview && (
				<div className="flex my-2 items-center ">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={preview} className="h-auto w-1/3 object-cover" alt={name} />
					<button
						type="button"
						className="w-8 h-8 mx-2 border-2 align-middle self-auto aspect-square shadow-lg font-bold px-2 rounded-full text-gray-600 hover:bg-rojo hover:text-white"
						onClick={clear}
					>
						x
					</button>
				</div>
			)}
		</>
	);
}

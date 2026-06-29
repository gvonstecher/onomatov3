"use client";
import React from "react";
import { useState } from "react";

export default function SocialMedia({ socialmedias }) {
    let initialLinks = [];
    const [links, setLinks] = useState(initialLinks);

    if (socialmedias) {
        socialmedias.map((socialmedia) => {
            let object = {
                url: socialmedia.url,
                label: socialmedia.type,
            };
            initialLinks.push(object);
        });
    }

    const addFields = (e) => {
		e.preventDefault();
		let object = {
			url: '',
			label: ''
		}
    	setLinks([...links, object])
  	}

    return (
        <div className="App">
            {links.map((link, index) => {
                return (
                    <div key={index} className="mt-4 flex gap-4 items-center">
                        <input
                            name="socialmediaUrl"
                            placeholder="http://ejemplo.com"
                            className="form-input w-full focus:bg-white border p-2"
                            defaultValue={link.url}
                        />
                        <input
                            name="socialmediaLabel"
                            placeholder="Etiqueta"
                            className="form-input w-full focus:bg-white border p-2"
                            defaultValue={link.label}
                        />
                    </div>
                );
            })}
            <button
                onClick={addFields}
                className="bg-rojo text-white py-1 px-3 mt-2 rounded-full text-sm"
            >
                Agregar
            </button>

            <br />
        </div>
    );
}

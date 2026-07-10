"use client";
import React, { useState } from "react";

// Matches the `type` select options of the Authors.socialmedias array field.
const TYPES = ["twitter", "instagram", "facebook", "youtube", "tiktok", "website"];

export default function SocialMedia({ socialmedias }) {
    const initial = (socialmedias || []).map((s) => ({ url: s.url || "", label: s.type || "" }));
    const [links, setLinks] = useState(initial);

    const addFields = (e) => {
        e.preventDefault();
        setLinks([...links, { url: "", label: "" }]);
    };

    return (
        <div className="App">
            {links.map((link, index) => (
                <div key={index} className="mt-4 flex gap-4 items-center">
                    <input
                        name="socialmediaUrl"
                        placeholder="http://ejemplo.com"
                        className="form-input w-full focus:bg-white border p-2"
                        defaultValue={link.url}
                    />
                    <select
                        name="socialmediaLabel"
                        className="form-input w-full focus:bg-white border p-2"
                        defaultValue={link.label}
                    >
                        {TYPES.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>
            ))}
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

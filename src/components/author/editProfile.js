"use client";
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';
import {redirect} from 'next/navigation';
import { useSession } from 'next-auth/react'
import { useState } from "react";

export default function EditAuthorForm(author) {

    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/api/auth/signin?callbackUrl=/client')
        }
    })

    
    let imagePath = author.profile_photo ? `/img/users/${author.id}/${author.profile_photo}` : null;
        const [profilePhoto, setProfilePhoto] = useState(null);
        const [profilePhotoObjectURL, setProfilePhotoObjectURL] = useState(imagePath);
        //const { data: session, status } = useSession();
      
        const uploadProfilePhoto = (event) => {
          if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];
            console.log(i);
            setProfilePhoto(i);
            setProfilePhotoObjectURL(URL.createObjectURL(i));
          }
        };

        imagePath = author?.header_photo ? `/img/users/${author.id}/${author.header_photo}` : null;
        const [headerPhoto, setHeaderPhoto] = useState(null);
        const [headerPhotoObjectURL, setHeaderPhotoObjectURL] = useState(imagePath);

        const uploadHeaderPhoto = (event) => {
            if (event.target.files && event.target.files[0]) {
              const i = event.target.files[0];
              console.log(i);
              setHeaderPhoto(i);
              setHeaderPhotoObjectURL(URL.createObjectURL(i));
            }
        };

        async function onSubmit(event) {
            event.preventDefault();

            const formData = new FormData(event.target)
            formData.append("id_user",session?.user.id);
            formData.append("name",event.target.name.value);
            formData.append("bio",event.target.bio.value);
            formData.append("profilePhoto",profilePhoto);
            formData.append("headerPhoto",headerPhoto);

            try {

                const response = await fetch('/api/author/edit', {
                method: 'POST',
                body: formData,
                });
                if(response.status == 200) {
                    console.log('eee');
                    router.push("/profile")
                }

            } catch (err) {
                console.log(err);
            }
         
            // Handle response if necessary
            //const data = await response.json()
            // ...
          }
        

    return (
            <div className="p-8 mt-6 rounded shadow mx-auto w-4/6">
                <form onSubmit={onSubmit} encType="multipart/form-data">

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="name">
                                Nombre
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input className="form-input block w-full focus:bg-white p-2" id="name" type="text" value={author?.name || '' } />
                            <p className="py-2 text-sm text-gray-600">Campo obligatorio</p>
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="bio">
                                Biografía
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <textarea className="form-textarea block w-full focus:bg-white p-2" id="bio">
                                {author?.bio || '' } 
                            </textarea>
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="profilePhoto">
                                Imagen de Perfil
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input className="form-input block w-full focus:bg-white" id="profilePhoto" type="file" value="" onChange={uploadProfilePhoto} />
                            <img src={profilePhotoObjectURL} />
                        </div>
                    </div>


                    <div className="md:flex mb-6">
                        <div className="md:w-1/3">
                            <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="headerPhoto">
                                Imagen de Cabecera
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input className="form-input block w-full focus:bg-white" id="headerPhoto" type="file" value="" onChange={uploadHeaderPhoto} />
                            <img src={headerPhotoObjectURL} />
                        </div>
                    </div>



                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <button className="shadow bg-yellow-700 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                Save
                            </button>
                        </div>
                    </div>
                </form>
            </div>

    );
}

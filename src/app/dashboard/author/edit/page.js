import {redirect} from 'next/navigation';
import { getAuthSession } from "@/utils/auth";
//import EditAuthorForm from "@/components/author/editProfile";
import FileInput from '@/components/forms/fileInput';
import SocialMedia from '@/components/forms/socialMedia';
import path from "path";
import fs from "fs";
import { writeFile } from 'fs/promises'
import slugify from "slugify";

async function getAuthor(id) {
    const author = await prisma.author.findUnique({
        where: { id_user: id},
    });
    return author;
    
};


export default async function EditAuthor({params}) {

    const session = await getAuthSession();
    // If not, redirect to the homepage
    if (!session || !session.user){
        redirect('/');
    }

    const author = await getAuthor(session.user.id);


    const submitForm = async (formData) => {
        "use server"

        const name = formData.get('name');
        const slug = slugify(name);
        const bio = formData.get('bio');
        const profilePhoto = Number(formData.get('profilePhoto'));
        const headerPhoto = Number(formData.get('headerPhoto'));
        const socialmediaType = formData.getAll('socialmediaType');
        const socialmediaUrl = formData.getAll('socialmediaUrl');
        

        const author = await prisma.author.upsert({
            where: { id_user: session.user.id },
            update: { 
                name: name,
                bio: bio,
                profile_photo: profilePhoto ? profilePhoto : undefined,
                header_photo: headerPhoto ? headerPhoto : undefined,
            },
            create: { 
                name: name,
                bio: bio,
                slug:slug,
                id_user: session.user.id,
                profile_photo: profilePhoto ? profilePhoto : undefined,
                header_photo: headerPhoto ? headerPhoto : undefined,
            }
        });


        if(author){

            console.log(author);
            const newFolder = `./public/img/users/${author.id}/`;
            if (!fs.existsSync(newFolder)){
                fs.mkdirSync(newFolder);
            }

            if(profilePhoto){
                const profileFile = await prisma.file.findUnique({
                    where: { id: author.profile_photo },
                    select : {
                        hash: true,
                        path: true
                    },
                });

                let profileFileOldPath = profileFile.path + profileFile.hash;
                let profileFileNewPath = newFolder + profileFile.hash
                
                const newProfileFile = await prisma.file.update({
                    where: { id: author.profile_photo },
                    data: {
                        path: profileFileNewPath
                    }
                })

                fs.rename(profileFileOldPath, profileFileNewPath, function (err) {
                    if (err) throw err
                })
            }

            if(headerPhoto){
                
                const headerFile = await prisma.file.findUnique({
                    where: { id: author.header_photo },
                    select : {
                        hash: true,
                        path: true
                    },
                });

                let headerFileOldPath = headerFile.path + headerFile.hash;
                let headerFileNewPath = newFolder + headerFile.hash
                
                const newHeaderFile = await prisma.file.update({
                    where: { id: author.header_photo },
                    data: {
                        path: headerFileNewPath
                    }
                })

                fs.rename(headerFileOldPath, headerFileNewPath, function (err) {
                    if (err) throw err
                })
            }
            
            if(socialmediaUrl){

                for (const key in socialmediaUrl) {

                    let social = await prisma.AuthorSocialmedia.create({
                        data: {
                          url: socialmediaUrl[key],
                          type: socialmediaType[key],
                          id_author: author.id
                        },
                      })

                }
            }
            redirect('/dashboard/profile')
        }
    }
    
    return (
        <div className="p-8 mt-6 rounded shadow mx-auto w-4/6">
            <form action={submitForm}>
                    <input type='hidden' name='authorId' id='authorId' defaultValue={author?.id} />
                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="name">
                                Nombre
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <input className="form-input block w-full focus:bg-white border p-2" id="name" name="name" type="text" defaultValue={author?.name || '' } />
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="bio">
                                Biografía
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <textarea className="form-textarea block  w-full focus:bg-white border p-2" id="bio" name="bio" rows="5" defaultValue={author?.bio || '' } />
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="profilePhoto">
                                Imagen de Perfil
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <FileInput
                                name="profilePhoto"
                                authorId={author?.id}
                                value={author?.profile_photo}
                                imageType="author"
                            />
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="headerPhoto">
                                Imagen de Cabcecera
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <FileInput
                                name="headerPhoto"
                                authorId={author?.id}
                                value={author?.header_photo}
                                imageType="author"
                            />
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="social">
                                Redes Sociales
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <SocialMedia />
                        </div>
                    </div>


                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <button className="shadow bg-rojo hover:bg-white focus:shadow-outline focus:outline-none text-white hover:text-rojo font-bold py-2 px-4 rounded disabled" type="submit">
                                Save
                            </button>
                        </div>
                    </div>

                    

            </form>
        </div>
    )


    //return <EditAuthorForm author={author} />;
    
}

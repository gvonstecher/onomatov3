import { getAuthSession } from "@/utils/auth";
import Dropzone from '@/components/forms/dropzone';
import FileInput from '@/components/forms/fileInput';
import slugify from "slugify";
import fs from "fs";
import {redirect} from 'next/navigation';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import SubmitButton from '@/components/forms/submitButton';

async function getAuthorId(userId) {
    const author = await prisma.author.findUnique({
        where: { id_user: userId},
    });
    return author.id;
    
};

export default async function EditBooks({params}) {

    const session = await getAuthSession();
    // If not, redirect to the homepage
    if (!session || !session.user){
        redirect('/');
    }

    const authorId = await getAuthorId(session.user.id);
    const book = '';


    const submitForm = async (formData) => {
        "use server"

        const bookId = Number(formData.get('bookId'));
        const title = formData.get('title');
        const slug = slugify(title);
        const description = formData.get('description');
        const price = Number(formData.get('price'));
        const pagesString = formData.get('pages').split(',');
        const pages = pagesString.map(Number);
        const coverPhoto = Number(formData.get('coverPhoto'));


        const lastFreePage = Math.round(pages.length / 5);

        const book = await prisma.book.upsert({
            where: { id: bookId },
            update: { 
                title: title,
                description: description,
                price:price,
                last_free_page:lastFreePage,
                cover: coverPhoto ? coverPhoto : undefined,
            },
            create: { 
                title: title,
                description: description,
                slug:slug,
                id_author: authorId,
                price:price,
                last_free_page:lastFreePage,
                cover: coverPhoto ? coverPhoto : undefined,
            }
        });

        if(book){
            const newFolder = `./public/img/books/${book.id}/`;
            const newFolderWithoutPublic = `./img/books/${book.id}/`;
            if (!fs.existsSync(newFolder)){
                fs.mkdirSync(newFolder);
            }

            if(coverPhoto){
                const coverFile = await prisma.file.findUnique({
                    where: { id: coverPhoto },
                    select : {
                        hash: true,
                        path: true
                    },
                });

                let coverFileOldPath = coverFile.path + coverFile.hash;
                let coverFileNewPath = newFolder + coverFile.hash;
                
                
                const newCoverFile = await prisma.file.update({
                    where: { id: coverPhoto },
                    data: {
                        path: coverFileNewPath
                    }
                })

                fs.rename(coverFileOldPath, coverFileNewPath, function (err) {
                    if (err) throw err
                });
            }

            //const zip = new JSZip();

            //processing Pages
            await Promise.all(pages.map(async (pageId, index) => {

                const pageFile = await prisma.file.findUnique({
                    where: { id: pageId },
                    select : {
                        hash: true,
                        path: true
                    },
                });

                let pageFileOldPath = pageFile.path + pageFile.hash;
                let pageFileNewPath = newFolder + pageFile.hash;
                
                const newPageFile = await prisma.file.update({
                    where: { id: pageId },
                    data: {
                        path: pageFileNewPath
                    }
                })

                fs.rename(pageFileOldPath, pageFileNewPath, function (err) {
                    if (err) throw err
                });

                let page_number = Number(index + 1);

                const bookPage = await prisma.BookPage.create({
                    data:{
                        page_number: page_number,
                        id_book: book.id,
                        page_photo:pageId,
                    }
                });

                // agrego pagina al archivo zip
                /*
                let fetchfile = `${process.env.BASE_FETCH_URL}/img/books/${book.id}/${pageFile.hash}`;
                let responseImg = await fetch(fetchfile);
                let dataImg = await responseImg.arrayBuffer();
                console.log(dataImg);
                zip.file(pageFile.hash, dataImg);
                */
            }));

            /*
            zip.generateAsync({type: "blob"}).then(content => {
                    saveAs(content, newFolder+"example.zip");
            });

            console.log('dfgdgdfg');
            console.log(zip);
            */

            redirect('/dashboard/profile')

        }


    }

    return (
        <div className="p-8 mt-6 rounded shadow mx-auto w-4/6">
            <form action={submitForm}>
            <input type='hidden' name='bookId' id='bookId' defaultValue={book?.id} />
                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="name">
                            Nombre de la Publicacion
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="form-input block w-full focus:bg-white p-2" id="title" name="title" type="text" required />
                        <p className="py-2 text-sm text-gray-600">Campo obligatorio</p>
                    </div>
                </div>

                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="description">
                            Descripcion de la Publicación
                        </label>
                    </div>
                    <div className="md:w-2/3">
                    <textarea className="form-textarea block w-full focus:bg-white p-2" id="description" name="description" />
                    </div>
                </div>

                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="coverPhoto">
                            Portada
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <FileInput
                                name="coverPhoto"
                                imageType="book"
                            />
                    </div>
                </div>


                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="headerPhoto">
                            Paginas del Libro
                        </label>
                    </div>
                    
                    <div className="md:w-2/3">    
                        <Dropzone name="pages" />
                    </div>
                </div>

                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="price">
                            Precio
                        </label>
                    </div>
                    <div className="md:w-2/3">
                    <input className="form-input block w-full focus:bg-white p-2" id="price" name="price" type="number" min="500"/>
                    </div>
                </div>
                                            
                <div className="md:flex md:items-center">
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                            <SubmitButton buttonText='Creando Libro' additionalText='Este proceso puede tardar unos minutos. Por favor no cierre la ventana del navegador' />
                    </div>
                </div>
            </form>
        </div>

);
}
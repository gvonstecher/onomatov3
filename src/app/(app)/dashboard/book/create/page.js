import { getPayload } from "payload";
import config from "@payload-config";
import { getAuthSession } from "@/utils/auth";
import Dropzone from '@/components/forms/dropzone';
import FileInput from '@/components/forms/fileInput';
import SubmitButton from '@/components/forms/submitButton';
import slugify from "slugify";
import { redirect } from 'next/navigation';

// Wrap plain text into a minimal Lexical richText value (Payload description).
const toRichText = (text) => ({
    root: {
        type: "root", format: "", indent: 0, version: 1, direction: "ltr",
        children: [{
            type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr",
            children: [{ type: "text", text: text || "", format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
        }],
    },
});

async function getAuthorId(userId) {
    const payload = await getPayload({ config });
    const res = await payload.find({ collection: "authors", where: { user: { equals: userId } }, limit: 1 });
    return res.docs[0]?.id || null;
}

export default async function CreateBook() {

    const session = await getAuthSession();
    if (!session || !session.user) {
        redirect('/');
    }

    const authorId = await getAuthorId(session.user.id);

    const submitForm = async (formData) => {
        "use server"

        const payload = await getPayload({ config });
        const title = formData.get('title');
        const description = formData.get('description');
        const price = Number(formData.get('price')) || undefined;
        const cover = Number(formData.get('coverPhoto')) || undefined;
        const pdf = Number(formData.get('pdf')) || undefined;

        // Creating the book with a `pdf` triggers the afterChange hook, which
        // queues extractBookPages to render the page images from the PDF.
        await payload.create({
            collection: "books",
            data: {
                title,
                description: toRichText(description),
                price,
                slug: slugify(title, { lower: true }),
                credits: [{ author: authorId, role: 'autor completo' }],
                cover,
                pdf,
            },
        });

        redirect('/dashboard/profile');
    }

    return (
        <div className="p-8 mt-6 rounded shadow mx-auto w-4/6">
            <form action={submitForm}>
                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="title">
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
                        <FileInput name="coverPhoto" />
                    </div>
                </div>

                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="pdf">
                            PDF del Libro
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <Dropzone name="pdf" />
                        <p className="py-2 text-sm text-gray-600">Las páginas se generan automáticamente a partir del PDF.</p>
                    </div>
                </div>

                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="price">
                            Precio
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="form-input block w-full focus:bg-white p-2" id="price" name="price" type="number" min="500" />
                    </div>
                </div>

                <div className="md:flex md:items-center">
                    <div className="md:w-1/3"></div>
                    <div className="md:w-2/3">
                        <SubmitButton buttonText='Creando Libro' additionalText='Las páginas del PDF se procesan en segundo plano.' />
                    </div>
                </div>
            </form>
        </div>
    );
}

import { redirect } from 'next/navigation';
import { getPayload } from "payload";
import config from "@payload-config";
import { getAuthSession } from "@/utils/auth";
import FileInput from '@/components/forms/fileInput';
import SocialMedia from '@/components/forms/socialMedia';
import SubmitButton from '@/components/forms/submitButton';
import slugify from "slugify";

// Wrap plain text into a minimal Lexical richText value (Payload bio field).
const toRichText = (text) => ({
    root: {
        type: "root", format: "", indent: 0, version: 1, direction: "ltr",
        children: [{
            type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr",
            children: [{ type: "text", text: text || "", format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
        }],
    },
});

// Flatten a Lexical value back to plain text for the textarea default.
const fromRichText = (v) => {
    if (!v) return "";
    if (typeof v === "string") return v;
    const walk = (n) => (n.text || "") + (n.children ? n.children.map(walk).join("") : "");
    return (v.root?.children || []).map(walk).join("\n");
};

async function getAuthor(userId) {
    const payload = await getPayload({ config });
    const res = await payload.find({
        collection: "authors",
        where: { user: { equals: userId } },
        depth: 1,
        limit: 1,
    });
    return res.docs[0] || null;
}

export default async function EditAuthor() {

    const session = await getAuthSession();
    if (!session || !session.user) {
        redirect('/');
    }

    const author = await getAuthor(session.user.id);

    const submitForm = async (formData) => {
        "use server"

        const payload = await getPayload({ config });
        const name = formData.get('name');
        const bio = formData.get('bio');
        const profilePhoto = Number(formData.get('profilePhoto')) || undefined;
        const headerPhoto = Number(formData.get('headerPhoto')) || undefined;
        const urls = formData.getAll('socialmediaUrl');
        const labels = formData.getAll('socialmediaLabel');
        const socialmedias = urls
            .map((url, i) => ({ url, type: labels[i] }))
            .filter((s) => s.url);

        const data = {
            name,
            bio: toRichText(bio),
            user: session.user.id,
            profilePhoto,
            headerPhoto,
            socialmedias,
        };

        const existing = await payload.find({
            collection: "authors",
            where: { user: { equals: session.user.id } },
            limit: 1,
        });

        if (existing.docs[0]) {
            await payload.update({ collection: "authors", id: existing.docs[0].id, data });
        } else {
            await payload.create({ collection: "authors", data: { ...data, slug: slugify(name, { lower: true }) } });
        }

        redirect('/dashboard/profile');
    }

    return (
        <div className="p-8 mt-6 rounded shadow mx-auto w-4/6">
            <form action={submitForm}>
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
                            <textarea className="form-textarea block  w-full focus:bg-white border p-2" id="bio" name="bio" rows="5" defaultValue={fromRichText(author?.bio)} />
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="profilePhoto">
                                Imagen de Perfil
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <FileInput name="profilePhoto" media={author?.profilePhoto} />
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="headerPhoto">
                                Imagen de Cabecera
                            </label>
                        </div>
                        <div className="md:w-2/3">
                            <FileInput name="headerPhoto" media={author?.headerPhoto} />
                        </div>
                    </div>

                    <div className="md:flex mb-6">
                        <div className="md:w-1/3 text-right">
                            <label className="block text-gray-600 font-bold mb-3 md:mb-0 pr-4" htmlFor="social">
                                Redes Sociales
                            </label>
                        </div>
                        <div className="md:w-2/3">
                                <SocialMedia socialmedias={author?.socialmedias}/>
                        </div>
                    </div>

                    <div className="md:flex md:items-center">
                        <div className="md:w-1/3"></div>
                        <div className="md:w-2/3">
                            <SubmitButton buttonText='Guardando' />
                        </div>
                    </div>
            </form>
        </div>
    )
}

import Dropzone from '@/components/forms/dropzone';
import FileInput from '@/components/forms/fileInput';

export default async function EditBooks({params}) {

    const submitForm = async (formData) => {
        "use server"
        console.log(formData);
    }

    return (
        <div className="p-8 mt-6 rounded shadow mx-auto w-4/6">
            <form action={submitForm}>

                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="name">
                            Nombre de la Publicacion
                        </label>
                    </div>
                    <div className="md:w-2/3">
                        <input className="form-input block w-full focus:bg-white p-2" id="name" type="text" />
                        <p className="py-2 text-sm text-gray-600">Campo obligatorio</p>
                    </div>
                </div>

                <div className="md:flex mb-6">
                    <div className="md:w-1/3">
                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="descripcion">
                            Descripcion de la Publicación
                        </label>
                    </div>
                    <div className="md:w-2/3">
                    <textarea className="form-textarea block w-full focus:bg-white p-2" id="descripcion" name="descripcion" />
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
                            Imagen de Cabecera
                        </label>
                    </div>
                    
                    <div className="md:w-2/3">    
                        <Dropzone name="pages" />
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
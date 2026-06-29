'use client'

import { useFormStatus } from 'react-dom';

export default function SocialMedia({ buttonText = 'Cargando', additionalText='' }) {
    const { pending } = useFormStatus();
    return (
        <div>
            {pending ?
                (
                    <>
                        <button className="shadow bg-rojo focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded flex" disabled>
                            <div className="border-gray-300 h-6 w-6 animate-spin rounded-full border-4 border-t-black inline-block mr-1"></div>
                            {buttonText}
                        </button>
                        {additionalText}
                    </>
                )
                : 
                (
                    <button className="shadow bg-rojo hover:bg-white focus:shadow-outline focus:outline-none text-white hover:text-rojo font-bold py-2 px-4 rounded" type="submit">
                                Guardar
                            </button>
                )}
        </div>
    );
};
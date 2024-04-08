"use client"
import React from "react";
import { useState } from "react";

export default function SocialMedia() {
  const [formFields, setFormFields] = useState([])

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log(formFields)
  }

  const addFields = (e) => {
    e.preventDefault();
    let object = {
      name: '',
      age: ''
    }

    setFormFields([...formFields, object])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  return (
    <div className="App">
        <button onClick={addFields} className="bg-rojo text-white py-1 px-3 rounded-full text-sm">Agregar</button>
        {formFields.map((form, index) => {
          return (
            <div key={index} className="mt-4 flex gap-4 items-center">
                <select  
                    onChange={event => handleFormChange(event, index)}
                    name="socialmediaType"
                    className="form-input w-full focus:bg-white border p-2"
                >
                    <option value='twitter'>Twitter</option>
                    <option value='instagram'>Instagram</option>
                    <option value='youtube'>Youtube</option>

                </select>
              <input
                name="socialmediaUrl"
                placeholder='Url'
                className="form-input w-full focus:bg-white border p-2"
                value={form.url}
              />
              <button className="shadow-lg font-bold px-2 rounded-full text-gray-600 hover:bg-rojo hover:text-white" onClick={() => removeFields(index)}>x</button>
            </div>
          )
        })}
      
      <br />
    </div>
  );
}
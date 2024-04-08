import React from "react";
export default function Input({ value, name}) {

  return (
    <div className="input-group">
      <label htmlFor={name}>{name}</label>
      <div className="input">
        <input
          type="text"
          name={name}
          value={value}
        />
        {/* Add this */}
      </div>
    </div>
  );
}
"use client";
import { useState } from "react";
export default function RegisterStep3() {
  const[mobilenumber, setMobilenumber] = useState('');
  const[mobileErrors, setMobileErrors] = useState('');
  const onInputmaxLength = (e) => {
    if(e.target.value.length > e.target.maxLength)
    {
      e.target.value = e.target.value.slice(0, e.target.maxLength);
    }
  }
  return (
    <>
                <div className="registerField">
                  <div className="registertext">Mobile Number <small>*</small></div>
                  <input
                    type="number"
                    name="mobilenumber"
                    maxLength={20}
                    value={mobilenumber}
                    onInput={onInputmaxLength}
                    onChange={(e) => setMobilenumber(e.target.value)}
                    required
                  />
                  {mobileErrors && <span className="registerError">{mobileErrors}</span> }
                </div>
    </>
  )
}

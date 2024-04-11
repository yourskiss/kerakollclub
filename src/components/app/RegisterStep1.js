"use client";
import { useState } from "react";
export default function RegisterStep1() {
  const[firstname, setFirstname] = useState('');
  const[lastname, setLastname] = useState('');
  const[fnErrors, setfnErrors] = useState('');
  const[lnErrors, setlnErrors] = useState('');
  const onInputmaxLength = (e) => {
    if(e.target.value.length > e.target.maxLength)
    {
      e.target.value = e.target.value.slice(0, e.target.maxLength);
    }
  }
 
 
 

  return (
    <>
                <div className="registerField">
                  <div className="registertext">First Name <small>*</small></div>
                  <input
                    type="text"
                    name="firstname"
                    maxLength={20}
                    value={firstname}
                    onInput={onInputmaxLength}
                    onChange={(e) => setFirstname(e.target.value) }
                    required
                  />
                  {fnErrors && <span className="registerError">{fnErrors}</span> }
                </div>
                <div className="registerField">
                  <div className="registertext">Last Name <small>*</small></div>
                  <input
                    type="text"
                    name="lastname"
                    maxLength={20}
                    value={lastname}
                    onInput={onInputmaxLength}
                    onChange={(e) => setLastname(e.target.value) }
                    required
                  />
                  {lnErrors && <span className="registerError">{lnErrors}</span> }
                </div>     
    </>
  )
}

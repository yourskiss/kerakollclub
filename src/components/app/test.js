"use client";
import { useState } from "react";
import Select from "react-dropdown-select";
export default function TestSearch() {
    const [selectedOption, setSelectedOption] = useState([]);
    const [cityname, setCityName] = useState('');
    const [statename, setStateName] = useState('');
    const options = [
        { label: '', cityname:'', statename:'', value: 0 },
        { label: "One", cityname:'c1', statename:'s1', value: 1 },
        { label: "Two", cityname:'c2', statename:'s2', value: 2 },
        { label: "Three", cityname:'c3', statename:'s3', value: 3 },
        { label: "Four", cityname:'c4', statename:'s4', value: 4 }
    ];
    const selectedValues = [""];
    const handalchange = (val) => {
      console.log(val); 
      setCityName(val[0].cityname)
      setStateName(val[0].statename);
    }
    const handleOptionChange = (val) => {
      console.log(val); 
      setSelectedOption(val);
      console.log("dddd = ", selectedOption);
    };
  return (
 
    <div className="main">
        <Select
        options={selectedOption.map((entry) => ({
          label: entry.label,
          value: entry.value,
        }))}
        className="testfield"
        searchable
        required
        values={options.filter((data) => selectedValues.includes(data.label))}
        onChange={(values) => handleOptionChange(values)}
        />;
    </div>
  );
}
 
 
 

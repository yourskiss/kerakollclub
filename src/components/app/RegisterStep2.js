"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { setBearerToken } from "@/config/beararauth";
import { isUserToken, isValideUser } from "@/config/userauth";

export default function RegisterStep2() {
  const[loading, setLoading] = useState(false);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateID, setStateID] = useState('');
  const [statename, setStatename] = useState('');
  const [cityname, setCityname] = useState('');
  const[aadhaarinfo, setAadhaarinfo] = useState('');
  const[stateErrors, setStateErrors] = useState('');
  const[cityErrors, setCityErrors] = useState('');
  const[aadhaarErrors, setAadhaarErrors] = useState('');

  const onInputmaxLength = (e) => {
    if(e.target.value.length > e.target.maxLength)
    {
      e.target.value = e.target.value.slice(0, e.target.maxLength);
    }
  }
  const setBT = setBearerToken();
  const isUT = isUserToken();
  const isUser = isValideUser();

  useEffect(() => {
    setLoading(true); 
    axios({
      url: process.env.BASE_URL + "CommonUtility/State?countryId=1",
      method: "GET",
      headers: { 'authorization': 'Bearer '+ setBT  },
    }).then((res) => {
        setStateList(res.data);
        setLoading(false); 
    }).catch((err) => {
        setLoading(false); 
        console.log(err.message);
    });
     
    stateID !== '' ?
        axios({
          url: process.env.BASE_URL + "CommonUtility/City?stateId="+stateID,
          method: "GET",
          headers: { 'authorization': 'Bearer '+ setBT  },
        }).then((res) => {
          setCityList(res.data);
        }).catch((err) => {
            console.log(err.message);
        })
   : null;
  }, [stateID]);

  return (
    <>
                <div className="registerField">
                      <div className="registertext">Select State <small>*</small></div>
                      <select  name="state" className="registerSelect" defaultValue={statename}  onChange={ e => 
                        { setStatename(e.target.value);  setStateID(e.target.options[e.target.selectedIndex].title); } }> 
                        <option value="" title=""></option>
                         {
                            stateList.map((val) => <option value={val.name} title={val.id} key={val.id}>{val.name}</option>)
                         }
                      </select>
                      { stateErrors && <span className="registerError"> {stateErrors}</span> }
                      <div className="registerLineText">Enter State name to pick nearby City</div>
                </div>
                { stateID !== '' ? 
                <div className="registerField">
                      <div className="registertext">Select City <small>*</small></div>
                      <select name="city" className="registerSelect"  defaultValue={cityname} onChange={ e => { setCityname(e.target.value); } }>
                        <option value=""></option>
                         {
                            cityList.map((val) => <option value={val.name} key={val.id}>{val.name}</option>)
                         }  
                      </select>
                      { cityErrors && <span className="registerError">{cityErrors}</span> }
                </div>
                : null }

                <div className="registerField">
                  <div className="registertext">Aadhaar Number <small>*</small></div>
                  <input
                    type="number"
                    name="aadhaarinfo"
                    maxLength={20}
                    value={aadhaarinfo}
                    onInput={onInputmaxLength}
                    onChange={(e) => setAadhaarinfo(e.target.value)}
                    required
                  />
                  {aadhaarErrors && <span className="registerError">{aadhaarErrors}</span> }
                </div>

    </>
  )
}

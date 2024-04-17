"use client";
import axios from "axios";
import Select from 'react-select';
import { setBearerToken } from "@/config/beararauth";
import { useEffect, useState } from "react";

export default function CityStateComponent({scChange}) {
    const setBT = setBearerToken();
    const [citystateList, setCitystateList] = useState([]);
    useEffect(() => {
        axios({
          url: process.env.BASE_URL + "CommonUtility/StateCity",
          method: "GET",
          headers: { 'authorization': 'Bearer '+ setBT },
        }).then((res) => {
           // console.log("city state - ", res);
            setCitystateList(res.data);
        }).catch((err) => {
            console.log(err.message);
        });
      }, [setBT]);

      const onchangevalue = (val) => {
        console.log(val);
        let sc = val.value;
        let ct = val.cityname;
        let st = val.statename;
        scChange(sc, st, ct);
        // console.log("comp - ", sc, st, ct)
      }
  return (
 <>
    <Select
    className="searchableContainer"
    classNamePrefix="searchable"
    Loading
    searchable 
    Clearable
    name="color"
    options={citystateList.map((entry) => ({
      label: entry.statecityname,
      value: entry.statecityname,
      cityname:entry.cityname,
      statename:entry.statename
    }))}
    onChange={(values) => {onchangevalue(values)}}
  />
                       
</>                   
  )
}

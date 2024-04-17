"use client";
import axios from "axios";
import Select from 'react-select';
import { setBearerToken } from "@/config/beararauth";
import { useEffect, useState } from "react";

export default function CityStateComponent({defaultSC, scChange}) {
    const setBT = setBearerToken();
    const [citystateList, setCitystateList] = useState([]);
    useEffect(() => {
      console.log(defaultSC);
        axios({
          url: process.env.BASE_URL + "CommonUtility/StateCity",
          method: "GET",
          headers: { 'authorization': 'Bearer '+ setBT },
        }).then((res) => {
            console.log("city state - ", res);
            setCitystateList(res.data);
        }).catch((err) => {
            console.log(err.message);
        });
      }, [setBT]);

      const onchangevalue = (val) => {
        console.log("comp - ", val);
        let id = val.value;
        let sc = val.label;
        let ct = val.cityname;
        let st = val.statename;
        scChange(id, sc, st, ct);
         console.log("comp - ", id, " - ", sc, " - ", st, " - ", ct);
      }
  return (
 <>
    <Select
    defaultValue={citystateList[defaultSC]}
    className="searchableContainer"
    classNamePrefix="searchable"
    Loading
    searchable 
    Clearable
    name="citystatelist"
    options={citystateList.map((entry) => ({
      label: entry.statecityname,
      value: entry.id,
      cityname:entry.cityname,
      statename:entry.statename
    }))}
    onChange={(values) => {onchangevalue(values)}}
  />
                       
</>                   
  )
}

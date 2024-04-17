"use client";
import axios from "axios";
import Select from 'react-select';
import { setBearerToken } from "@/config/beararauth";
import { useEffect, useState } from "react";

export default function CitystateUpdateComponent({scChange, nameSC, nameS, nameC}) {
    const setBT = setBearerToken();
    const [citystateList, setCitystateList] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    
      useEffect(() => {
        setIsMounted(true);
      }, []);
      
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
      }, [isMounted]);

      const onchangevalue = (val) => {
        scChange(val.label, val.statename, val.cityname);
        console.log("oncomponnent - ", val, " - ", val.label, " - ", val.statename, " - ", val.cityname);
      }
  return (
 <>
    <Select
    id="idcitystate"
    defaultValue={{label: nameSC, value:nameSC, cityname: nameC, statename: nameS}}
    className="searchableContainer"
    classNamePrefix="searchable"
    Loading
    searchable 
    Clearable
    name="citystatelist"
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
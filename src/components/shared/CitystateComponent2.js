"use client";
import axios from "axios";
import Select from "react-dropdown-select";
import { setBearerToken } from "@/config/beararauth";
import { useEffect, useState } from "react";

export default function CityStateComponent({scChange, defaultValue}) {
    const setBT = setBearerToken();
    const [citystateList, setCitystateList] = useState([]);
    const selectedValues = [""];
    useEffect(() => {
        // setLoading(true); 
        axios({
          url: process.env.BASE_URL + "CommonUtility/StateCity",
          method: "GET",
          headers: { 'authorization': 'Bearer '+ setBT },
        }).then((res) => {
           // setLoading(false); 
            console.log("city state - ", res);
            setCitystateList(res.data);
        }).catch((err) => {
           // setLoading(false); 
            console.log(err.message);
        });
      }, [setBT]);
      // citystateList.filter((data) => selectedValues.includes(data.label))
  return (
 
                      <Select
                        options={citystateList.map((entry) => ({
                          label: entry.statecityname,
                          value: entry.id,
                          cityname:entry.cityname,
                          statename:entry.statename
                        }))}
                        name="citystatename"
                        Loading
                        searchable 
                        Clearable
                        values={defaultValue} 
                        onChange={(values) => {scChange(values[0].label, values[0].statename, values[0].cityname);  }}
                      />
  )
}

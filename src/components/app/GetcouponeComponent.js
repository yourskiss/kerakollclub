"use client";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HeaderComponent from '../shared/HeaderComponent';
import { getUserID, isUserToken } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import { ipaddress, osdetails, browserdetails, geoLatitude, geoLongitude } from "../core/jio";
import {  toast } from 'react-toastify';
import { isCouponeCode, getCouponeCode } from "@/config/validecoupone";
import { _post } from "@/config/apiClient";

export default function GetcouponeComponent() {
 
  const [loading, setLoading] = useState(false);
  const [couponecode, setCouponecode] = useState('');
  const { push } = useRouter();
  const isUser = isUserToken();
  const userID = getUserID();
  const latInfo = geoLatitude();
  const lonInfo = geoLongitude();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const isCC = isCouponeCode();
  const getCC = getCouponeCode();
  useEffect(() => {
    isCC ? setCouponecode(getCC)  : push("/rewards"); 
  }, [couponecode]);
 
  useEffect(() => {
    if(!isUser) { push("/"); return  }
  }, [isUser]);
  
  const handleSubmitCode = (e) => 
  {
    e.preventDefault();
    setLoading(true);
    const qrdata = {
      userid: userID,
      couponcode: couponecode,
      scanlocation: `{'Latitude':'${latInfo}', 'Longitude':'${lonInfo}'}`,  
      ipaddress: ipInfo,
      osdetails: osInfo,
      browserdetails: browserInfo
    }
   // console.log(qrdata);
        _post("Customer/ValidateCouponAndSave", qrdata)
        .then((res) => {
          setLoading(false);
          // console.log(res)
          res.data.result === null ? toast.error(res.data.resultmessage) : (toast.success("Coupon Successfully Validated."), Cookies.remove('couponecodecookies'),  sessionStorage.setItem("pointid", res.data.result[0].pointid), push("/earnedpoint"));
        }).catch((err) => {
          setLoading(false); 
          toast.error(err.message);
          //push("/dashboard");
        });
  }

  return (
    <>
      <HeaderComponent />
      <div className="screenmain" > 
        <div className="screencontainer">

          <div className="scanqrcodecontainer">
            <h2>Scan Data </h2>
            <ul>
              <li>Latitude: {latInfo}</li>
              <li>Longitude: {lonInfo}</li>
              <li>IP Address: {ipInfo}</li>
              <li>OS Details: {osInfo}</li>
              <li>Browser Details: {browserInfo}</li>
              <li>Coupone Code: {couponecode}</li>
            </ul>
            <form className="scanqrcodeForm" onSubmit={handleSubmitCode} >
                <button>Validate and Save Coupon</button>
            </form>
          </div>
 
          
        </div>
      </div> 
 

      { loading ? <Loader /> : null }
    </>
  )
}

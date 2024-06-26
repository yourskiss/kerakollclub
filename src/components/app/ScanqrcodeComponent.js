"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import QrReader from '../core/QrReader';
import { getUserID, isUserToken } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import { ipaddress, osdetails, browserdetails, geoLatitude, geoLongitude } from "../core/jio";
import { toast } from 'react-toastify';
import Link from 'next/link';
import CountUp from 'react-countup';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import { _post } from "@/config/apiClient";

export default function ScanqrcodeComponent() {
  const [loading, setLoading] = useState(false);
  const [qrcode, setQrcode] = useState(true);
  const [scandata, setScandata] = useState('');
  const [couponecode, setCouponecode] = useState('');
  const { push } = useRouter();
  const isUser = isUserToken();
  const userID = getUserID();
  const latInfo = geoLatitude();
  const lonInfo = geoLongitude();
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();
  const rewardspoints = TotalrewardpointsComponent();
 
 
  useEffect(() => {
    if(!isUser) { push("/"); return  }
  }, [isUser]);

  useEffect(() => {
      const sdURL = scandata.split("?") || '';
      if(sdURL[0] === process.env.COUPON_URL || sdURL[0] === process.env.COUPON_URL2 || sdURL[0] === process.env.COUPON_URL3 || sdURL[0] === process.env.COUPON_URL4 || sdURL[0] === process.env.COUPON_URL5 || sdURL[0] === process.env.COUPON_URL6)
      {
          const couponvalue = sdURL[1].split("=");
          setCouponecode(couponvalue[1]);
          toast.success("QR code scan successfully.")
      }
  }, [scandata]);


  const handalqrisvailable = (val) => { 
    setQrcode(val);
  }
  const getData =(val) =>{
    setScandata(val);
  }
 
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
    if(couponecode !== '')
    {
        _post("Customer/ValidateCouponAndSave", qrdata)
        .then((res) => {
          setLoading(false);
          console.log(res)
          if(res.data.result === null)
          {
            toast.error(res.data.resultmessage);
            setQrcode(true);
           } 
           else
           {
            sessionStorage.setItem("pointid", res.data.result[0].pointid);
            toast.success('Coupon Successfully Verify and Added');
            push("/earnedpoint");
           }
        }).catch((err) => {
          setLoading(false); 
          toast.error(err.message);
          setQrcode(true);
          //push("/dashboard");
        });
    }
    else
    {
      setLoading(false); 
      toast.error("Invalide QR Code...")
      setQrcode(true);
    }

  }

  return (
    <>
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">
          { 
            !qrcode ? <div className="scanqrcodecontainer">
              <h2>Scan Data  <span>({scandata})</span> </h2>
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
            : <div className="scanqrcodesection"><h2>Scan QR code <br /> and win rewards</h2><QrReader onData={handalqrisvailable} onSuccess={getData} /></div>
          }
        </div>


          <div className="screenqrbottom">
            <h2>
              <em>CLUB WALLET</em>
              <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <span>PTS</span>
            </h2>
            <p><Link href='/rewards'>view points</Link></p>
          </div>


      </div> 
 

      
      { loading ? <Loader /> : null }
    </>
  )
}

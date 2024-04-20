"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import HeaderComponent from "../shared/HeaderComponent";
import { getUserID, isUserToken, isValideUser } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';
import { _get } from "@/config/apiClient";

export default function RewardshistoryComponent () {
  const [loading, setLoading] = useState(false);
  const [pointhistory, setPointhistory] = useState({});
  const [nodata, setNodata] = useState('');
  const { push } = useRouter();
  const isUT = isUserToken();
  const isUser = isValideUser();
  const userID = getUserID();
   
  
  useEffect(() => {
  if(!isUT) { push("/"); return  }
    setLoading(true);
    _get("Customer/UserRewardPointsHistory?userid="+ userID)
    .then((res) => {
       // console.log("UserRewardPointsHistory - response - ", res);
        setLoading(false);
        if(res.data.result.length !== 0)
        {
          setPointhistory(res.data.result)
        }
        else
        {
          setNodata('Reward points not available.');
        }
    }).catch((error) => {
        setLoading(false);
       // console.log("UserRewardPointsHistory - error - ", error);
        setNodata(error.message);
    });

  }, [isUT]);

 const points = TotalrewardpointsComponent();
  return (
  <>
    <HeaderComponent />
    <div className="screenmain" > 
      <div className="screencontainer">
 

          <div className="rewardscontainer">
            <h2>Reward Points History</h2>
            <h3>(Total Rewards  <CountUp duration={2} start={0}  delay={1} end={points} /> <b>pt</b>)</h3>
            { nodata ? <div className="norewardsavailable">{nodata}</div> : (
            <ul>
              <li>
                <p><b>SN.</b></p>
                <p><b>Coupon Code</b></p>
                <p><b>Scan Datetime</b></p>
                <p><b>Earned Points</b></p>
              </li>
              {  pointhistory.map &&  pointhistory.map((val, index) => <li key={val.pointid}><p>{index+1}</p><p>{val.couponcode}</p><p>{ val.scandate }</p><p>{ val.earnedpoints }</p></li>) }
            </ul> 
            )}
          </div>
 
      </div>
    </div> 



    { loading ? <Loader /> : null }
  </>
  )
}
 

 
 

          
 
 
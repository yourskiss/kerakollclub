"use client";
import axios from "axios";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserID, isUserToken, isValideUser } from "@/config/userauth";
import { setBearerToken } from "@/config/beararauth";
import Loader from "../shared/LoaderComponent";
import Link from 'next/link';
import Image from 'next/image'
import CountUp from 'react-countup';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';

export default function EarnedComponent() {

    const [loading, setLoading] = useState(false);
    const [pointnumber, setPointnumber] = useState(0);
    const [pointID, setPointID] = useState('');
    const { push } = useRouter();
    const setBT = setBearerToken();
    const isUT = isUserToken();
    const isUser = isValideUser();
    const userID = getUserID();
    const rewardspoints = TotalrewardpointsComponent();
   

    useEffect(() => {
      if(!isUT) { push("/"); return  }
      if(typeof sessionStorage !== 'undefined')
      {
        setPointID(sessionStorage.getItem("pointid"));
      }
    }, [isUT]);
   
    useEffect(() => {
        setLoading(true);
        axios({
            url: process.env.BASE_URL + "Customer/RewardPointInfo?pointid="+pointID,
            method: "GET",
            headers: { 'authorization': 'Bearer '+ setBT },
        }).then((res) => {
            console.log(" response - ", res);
            setPointnumber(res.data.result[0].earnedpoints);
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(" error - ", error);
        });
    }, [pointID]);

  return (<>
      <div className="screenmain screenqrcode" > 
        <div className="screencontainer">

            <div className="earnepoints_content">
                <h2>CONGRATULATIONS</h2>
                <h3>You have earned</h3>
                <h4><CountUp duration={2} start={0}  delay={1}  end={pointnumber} /></h4>
                <h5>points</h5>
            </div>

        </div>

        <div className="earnepoints_scan">
                <aside>
                    <Link href='/scanqrcode'><Image src="/assets/images/scanQR.png"  width={139} height={138} alt="scanQR" quality={99}  /></Link>
                </aside>
                <p>Scan more points</p>
        </div>  


        <div className="screenqrbottom">
            <h2>
              <em>CLUB WALLET</em>
              <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <span>PTS</span>
            </h2>
            <p><Link href='/rewards'>check your club wallet</Link></p>
        </div>
      </div> 
      { loading ? <Loader /> : null }
    </>)
}

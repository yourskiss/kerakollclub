"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isUserToken } from "@/config/userauth";
import Loader from "../shared/LoaderComponent";
import Link from 'next/link';
import Image from 'next/image'
import CountUp from 'react-countup';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import { _get } from "@/config/apiClient";

export default function EarnedComponent() {

    const [loading, setLoading] = useState(false);
    const [pointnumber, setPointnumber] = useState(0);
    const [pointID, setPointID] = useState('');
    const { push } = useRouter();
    const isUser = isUserToken();
    const rewardspoints = TotalrewardpointsComponent();
   

    useEffect(() => {
      if(!isUser) { push("/"); return  }
      if(typeof sessionStorage !== 'undefined')
      {
        setPointID(sessionStorage.getItem("pointid"));
      }
    }, [isUser]);
   
    useEffect(() => {
        setLoading(true);
        _get("Customer/RewardPointInfo?pointid="+pointID)
        .then((res) => {
          //  console.log(" response - ", res);
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

                <Image className="earnpoint_img1" src="/assets/images/v1.png"  width={64} height={64} alt="scanQR" quality={99}  />
                <Image className="earnpoint_img2" src="/assets/images/V2.png"  width={123} height={123} alt="scanQR" quality={99}  />
                <Image className="earnpoint_img3" src="/assets/images/v3.png"  width={64} height={64} alt="scanQR" quality={99}  />
                <Image className="earnpoint_img4" src="/assets/images/v4.png"  width={69} height={76} alt="scanQR" quality={99}  />
            </div>

        </div>

        <div className="earnepoints_scan">
                <aside  onClick={()=> push("/scanqrcode")}> 
                  <Image src="/assets/images/scanQR.png"  width={139} height={138} alt="scanQR" quality={99}  />
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

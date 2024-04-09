"use client";
import Image from 'next/image'
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import HeaderComponent from "../shared/HeaderComponent";
import {  isUserToken } from "@/config/userauth";
import Link from 'next/link';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';

const DashboardComponent = () => {
    
  const { push } = useRouter();
  const isUT = isUserToken();
  const rewardspoints = TotalrewardpointsComponent();
 
 
  useEffect(() => {
  if(!isUT) { push("/"); return  }
  }, [isUT]);


  return (
  <>
    <HeaderComponent />
    <div className="screenmain" > 
      <div className="screencontainer">
   
          <div className="dashboard_head">
              <h2>
                  PRODUCT CATEGORIES
                  <span>Earn reward points everytime you purchase!</span>
              </h2>
          </div>

          <div className="dashboard_single_pro">
              <aside>
                <Image src="/assets/images/dashboard_single_pro.png" width={100} height={100} alt="product" quality={100} />
              </aside>
              <h2>
                  <span>Learn more</span>
                  <Image src="/assets/images/arrows.png" width={100} height={100} alt="product" quality={100} />
              </h2>
          </div>

 
          <div className="dashboard_earned_point">
                <h2>You’ve earned</h2>
                <p>
                    <CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> 
                    <em>reward<br />points</em>
                </p>
          </div>

          <div className="dashboard_content">
              <section>
                    <aside><Link href="/scanqrcode"><Image src="/assets/images/dash-qr.png" width={100} height={100} alt="qr" quality={100} /></Link></aside>
                    <h2>Scan QR Code</h2>
                    <p>FOR YOUR KERAKOLL PRODUCTS</p>
              </section>
              <section>
                    <aside><Link href="/"><Image src="/assets/images/redeempoints.png" width={99} height={115} alt="redeempoints" quality={100} /></Link></aside>
                    <h2>Redeem Points</h2>
                    <p>IN YOUR CLUB WALLET</p>
              </section>
          </div>
          
      </div>
    </div> 
  </>
  )
}
export default DashboardComponent; // isauths(DashboardComponent);
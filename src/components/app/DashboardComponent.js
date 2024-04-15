"use client";
import Image from 'next/image';
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import HeaderComponent from "../shared/HeaderComponent";
import {  isUserToken } from "@/config/userauth";
import Link from 'next/link';
import TotalrewardpointsComponent from '../shared/TotalrewardpointsComponent';
import CountUp from 'react-countup';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DashboardComponent = () => {
    
  const { push } = useRouter();
  const isUT = isUserToken();
  const rewardspoints = TotalrewardpointsComponent();
 
 
  useEffect(() => {
  if(!isUT) { push("/"); return  }
  }, [isUT]);



  var settingsDashboard = {
    dots: true,
    arrows:false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
     centerPadding: '10px'
  };

  return (
  <>
    <HeaderComponent />
    <div className="screenmain screendashboard"> 
      <div className="screencontainer">
   
          <div className="dashboard_earned_point">
                <h2>You’ve earned</h2>
                <p><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /></p>
                <dl>
                    <dd><Image className='dashStar1' src="/assets/images/dash-start.png" width={64} height={64} alt="star" quality={100} /></dd>
                    <dt>
                        <Image className='dashStar2' src="/assets/images/dash-start.png" width={24} height={24} alt="star" quality={100} />
                        <br />
                        <Image className='dashStar3' src="/assets/images/dash-start.png" width={30} height={30} alt="star" quality={100} />
                        <em>reward<br />points</em>
                    </dt>
                    
                </dl>
          </div>
          <div className="dashboard_content">
              <section onClick={()=> push("/scanqrcode")}>
                    <aside><Image className='dashboard_scan_img' src="/assets/images/dash-qr.png" width={100} height={100} alt="qr" quality={100} /></aside>
                    <h2>Scan QR Code</h2>
                    <p>FOR YOUR KERAKOLL PRODUCTS</p>
              </section>
              <section className='dashboard_redeempointbg' onClick={()=> push("/redeempoints")}>
                    <aside ><Image src="/assets/images/redeempoints.png" width={99} height={115} alt="redeempoints" quality={100} /></aside>
                    <h5><CountUp duration={2} start={0}  delay={1}  end={rewardspoints} /> <em>pt</em></h5>
                    <h2>Redeem Points</h2>
                    <p>IN YOUR CLUB WALLET</p>
              </section>
          </div>
        </div>
    </div>
    <div className="screenmain screendashboardbottom"> 
        <div className="screencontainer">

            <div className="dashboard_products">
                <h2>PRODUCT CATEGORIES</h2>
                <Slider className="dashboard_slider" {...settingsDashboard}>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>
                    <div className="db_item">
                        <aside><Image src="/assets/images/products/img.png" width={500} height={500} alt="product" quality={99} /></aside>
                        <h2>
                            <span>Learn more</span>
                            <Image src="/assets/images/arrows.png" width={57} height={18} alt="product" quality={99} />
                        </h2>
                    </div>                
                </Slider>
            </div>

          
      </div>
    </div> 
  </>
  )
}
export default DashboardComponent; // isauths(DashboardComponent);
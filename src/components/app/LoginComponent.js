"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Loader from "../shared/LoaderComponent";
import HeaderComponent from "../shared/HeaderComponent";
import { toast } from 'react-toastify';
import { setUserCookies, isUserToken } from "@/config/userauth";
import { encryptText } from "@/config/crypto";
import { setCouponeCode, isCouponeCode } from "@/config/validecoupone";
import Otpcountdown from "../core/timer";
import { _get } from "@/config/apiClient";

export default function LoginComponent() {  
    const[loading, setLoading] = useState(false);
    const [agree, setAgree] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [mobileValues, setMobileValues] = useState('');
    const [otpValues, setOtpValues] = useState('');
    const [mobileError, setMobileError] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isOTP, setIsOTP] = useState(false);
    const [orderID, setOrderID] = useState(''); 
    const [OTPVerified, setOTPVerified] = useState(false);
    const [otpsent, setOtpsent] = useState(false);
    const mobileChange = (e) =>{setMobileValues(e.target.value); setMobileError(""); }
    const otpChange = (e) =>{setOtpValues(e.target.value); setOtpError(''); }
    const onInputmaxLength = (e) => {
        if(e.target.value.length > e.target.maxLength)
        {
          e.target.value = e.target.value.slice(0, e.target.maxLength);
        }
    }
    const mobileSubmit =(e) =>{
      e.preventDefault();
      const regexMobile = /^[6789][0-9]{9}$/i;
      if (!mobileValues){setMobileError("Mobile number is required!");}
      else if(mobileValues.length < 10){setMobileError("Mobile Number  must have at least 10 Digit");}
      else if(!regexMobile.test(mobileValues)){setMobileError("Invalid mobile number!");}
      else { setMobileError(""); setIsMobile(true);   }
    }
    const otpSubmit =(e) =>{
      e.preventDefault();
      const regexOTP = /^[0-9]{6}$/i;
      if (!otpValues){setOtpError("OTP is required!");}
      else if(otpValues.length < 6){setOtpError("OTP must have at least 6 digit");}
      else if(!regexOTP.test(otpValues)){setOtpError("Invalid otp");}
      else{ setOtpError(''); setIsOTP(true); }
    }
    const changeNumber = (e) => {
      e.preventDefault();
      setAgree(true);
      setIsDisabled(false);
      setIsOTP(false);
      setIsMobile(false)
    }

  const router = useRouter();
  const searchParams = useSearchParams();
  const getqrcode = searchParams.get('code');
  const isUser = isUserToken();
  const isCC = isCouponeCode();
 
  const checkboxHandler = () => {
    agree === false ? setAgree(true) : setAgree(false);
  }
  const otpcountertime = new Date();
  otpcountertime.setSeconds(otpcountertime.getSeconds() + 59);  
  const getOtpTimer =(val) =>{ setOtpsent(val); }

   useEffect(() => {
     if(getqrcode !== null) { setCouponeCode('couponecodecookies',getqrcode); }
   }, [getqrcode]);
  

  useEffect(() => {
    if(isUser && !isCC) { router.push("/dashboard"); return }
    if(isUser && isCC) { router.push("/getcoupone"); return }
  }, [isUser]);

 

   useEffect(() => {
    if(Object.keys(mobileError).length === 0 && isMobile)
    {
      setIsDisabled(true);
      sendotp();
    }
  }, [mobileError, isMobile]);
 
  useEffect(() => {
    if(Object.keys(otpError).length === 0 && isOTP)
    {
      verifyotp();
    }
  }, [otpError, isOTP]);

  
  useEffect(() => {
    if(OTPVerified)
    {
      setLoading(true);
      _get("Customer/UserInfo?userid=0&phonenumber="+ mobileValues)
      .then(res => {
        //  console.log("login success - ", res);
        localStorage.setItem("userprofilename",res.data.result.fullname);
        localStorage.setItem("userprofilepic",res.data.result.profilepictureurl);
        if(res.data.result.verificationstatus === "APPROVE" || res.data.result.verificationstatus === "PENDING")
        {
            localStorage.setItem('verificationstatus', res.data.result.verificationstatus); 
            const userinfo = res.data.result.userid + "|" + res.data.result.phonenumber
            setUserCookies('usertoken', encryptText(userinfo));       
            if(res.data.result && isCC)
            { 
              router.push('/getcoupone');
              toast.success('Coupon Added Successfully'); 
            }
            else if(res.data.result && !isCC)  
            {
              router.push("/dashboard");
              toast.success('Login Successfully'); 
            }
            else
            {
                toast.error(res.data.resultmessage);
            }
        }
        // else if(res.data.result.verificationstatus === "PENDING")
        // {
        //    res.data.result ? push("/approval") : toast.error(res.data.resultmessage);
        // }
        else if(res.data.result.verificationstatus === "REJECT")
        {
          toast.warn("Your request has been rejected. please register with another mobile number.");
        }
        else
        {
           toast.warn("Your are not registered user. please register after login");
        }
        setLoading(false);
      })
      .catch(error => {
        toast.error(error.message);
        setLoading(false); 
      });
    }
  }, [OTPVerified, isOTP]);



  const sendotp = () => {
    setLoading(true);
      _get("Sms/SendOTP?mobile="+ mobileValues)
      .then((res) => {
        setLoading(false);
        setOtpValues('');
        setIsOTP(false);
       // console.log("send otp  - ", res);
        if(res.data.orderId)
        {
          toast.success('OTP send in your mobile number.');
          setOrderID(res.data.orderId);
          setOtpsent(false);
        }
        else
        {
          toast.error("Unable to send otp on your mobile number.");
        }
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }
  const resendotp = () => {
    setLoading(true);
      _get("Sms/ResendOTP?orderid="+ orderID)
      .then((res) => {
        setLoading(false);
        setOtpValues('');
        setIsOTP(false);
       // console.log("resend otp - ", res);
        if(res.data.orderId)
        {
          toast.success('OTP Re-send in your mobile number.');
          setOrderID(res.data.orderId);
          setOtpsent(false);
        }
        else
        {
          toast.error("Unable to re-send otp on your mobile number");
        }
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
  }

  const verifyotp = () => {
     setOTPVerified(true); // tesing
    /*
    setLoading(true);
      _get("Sms/VerifyOTP?orderid="+orderID+"&otp="+otpValues+"&mobile="+mobileValues)
      .then((res) => {
        setLoading(false);
       // console.log("Verify OTP - ", res);
        if(res.data.isOTPVerified)
        {
          toast.success("OTP Successfully Verify");
          setOTPVerified(res.data.isOTPVerified);
        }
        else
        {
          toast.error(res.data.reason);
          setOtpValues('');
          setIsOTP(false);
          setOTPVerified(false);
        }
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
      */
  }



  return (
  <>
    <HeaderComponent />
    <div className='screenmain'>
    <section className="screencontainer">


          
          
          
          { !isDisabled ? (<div className="registercontainer">
              <div className="registerHead">Welcome!</div>
              <div className="registerField">
                <div className="registertext">Enter mobile number *</div>
                <div className="registerinputformobile">
                  <span>+91-</span>
                  <input className="registerinput" type="number" name="mobile" maxLength={10} minLength={10} value={mobileValues} onChange={mobileChange} disabled={isDisabled} onInput={onInputmaxLength} />
                </div>
                { mobileError && <span className='registerError'>{mobileError}</span> } 
              </div>
              <div className="registerTncAccept">
                 <input id="accepttnc" type="checkbox" onChange={checkboxHandler}  />
                 <label htmlFor="accepttnc"><span>Accept Term and Condition</span></label>
              </div>
              </div>) : null }
          
          

        { mobileError === '' && isMobile ? (
        <>
            <div className="registercontainer">
              <div className="registerHead">Verify with OTP</div>
              <div className="registerMsgOtp">
                <span>We have sent an OTP to +91-{mobileValues}</span>
                <em className="numberedit" onClick={changeNumber}>Change</em>
              </div>
              <div className="registerOtp">
                <div><aside>
                  <input type="number" name="otpnumber" maxLength={6} minLength={6}  value={otpValues} onChange={otpChange}  onInput={onInputmaxLength} />
                </aside></div> 
              </div>
              { otpError && <span className='registerError'>{otpError}</span>  }
              {
                !otpsent ? (<div className="registerOtpText">Resend OTP in  <Otpcountdown expiryTimestamp={otpcountertime} onSuccess={getOtpTimer} /> Seconds </div>) : (<div className="registerOtpText">Not reveived?  <span onClick={resendotp}>Resend OTP</span></div>)
              }
            </div>
        </>
        ) : null }

            <div className="registerSubmit">
              { 
                !isMobile && !isOTP ?
                (<button disabled={agree} className="register_button" onClick={mobileSubmit}>SEND OTP</button>) 
                :
                (<button className="register_button" onClick={otpSubmit}>Sign In</button>)
              }
            </div>

 
      
        <div className="registerBottomText">Haven’t signed up yet? <Link href='/register'>Sign Up</Link></div>
    </section>
    </div>

    { loading ? <Loader /> : null }
  </>
  )
}

"use client";
import Image from 'next/image'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isUserToken, isValideUser } from "@/config/userauth";
import Link from 'next/link';
import { toast } from 'react-toastify';
 
export default  function HeaderComponent() {
  const isUT = isUserToken();
  const isUser = isValideUser();
  const { push } = useRouter();
  const [headclass, setHeadClass] = useState('headersection');
  const [logout, setLogout] = useState(false);
  const[username, setUsername] = useState('');
  const[userdp, setUserdp] = useState('');
  const[userstatus, setUserstatus] = useState('');
 
useEffect(() => {
    if(isUT)
    {
      setHeadClass('headersection headerinner');
    }
    else
    {
      setHeadClass('headersection');
    }
}, [isUT]);

useEffect(() => {
  if (typeof localStorage !== 'undefined') 
  {
      setUsername(localStorage.getItem('userprofilename'));
      setUserdp(localStorage.getItem('userprofilepic'));
      setUserstatus(localStorage.getItem('verificationstatus'));
  } 
  else
  {
      setUsername('Demmy Account');
      setUserdp('/assets/images/profile/dp.png');
  }

}, []);


  function showhidelogout()
  {
    logout == false ? setLogout(true) : setLogout(false);
  }

  const logoutnow = () => {
      localStorage.removeItem("userprofilepic");
      localStorage.removeItem("userprofilename");
      localStorage.removeItem('verificationstatus')
      Cookies.remove('couponecodecookies');
      sessionStorage.removeItem("pointid");
      Cookies.remove('usertoken');
      setUsername('Demmy Account');
      setUserdp('/assets/images/profile/dp.png');
      push("/") ;
      toast.success('Logout Successfully'); 
  }
  return (
    <>
      <header className={headclass}>
        <aside className="logo">
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={80} />
        </aside>
        <section>
            <Link href="/scanqrcode" className='header_scanqrcode'><Image src="/assets/images/QR.png" width={100} height={100} alt="qr" quality={90} /></Link>
            <span className='header_notification'>
              <Image src="/assets/images/notification.png" width={100} height={100} alt="notification" quality={90} />
              {userstatus === "APPROVE" ? <span className='status_approve'></span> : <span className='status_pending'></span> }
            </span>
            <aside className='header_userdp'><img src={userdp}  alt="profile" onClick={showhidelogout} /></aside>
            {
              logout === true ?
              <ul className='header_menu'>
                  <li>Welcome<br /> <Link href='/dashboard'><b>{username}</b></Link></li>
                  <li><Link href='/update-profile'>Update Profile</Link></li>
                  <li><Link href='/rewards'>Rewards History</Link></li>
                  <li><span onClick={logoutnow}>Logout</span></li>
              </ul>
              : null }
        </section>
      </header>
 

    </>

  )
}

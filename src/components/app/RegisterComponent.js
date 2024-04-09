"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
// import Cookies from 'js-cookie';
import ImageCropperWithPreview from "../core/ImageCropperWithPreview";
import Loader from "../shared/LoaderComponent";
import InputWrapperComponent from "../shared/InputWrapperComponent";
import HeaderComponent from "../shared/HeaderComponent";
import { registerOptions } from "@/locale/en-in";
import { toast } from 'react-toastify';
import { setBearerToken } from "@/config/beararauth";
import { isUserToken, isValideUser } from "@/config/userauth";
import { ipaddress, osdetails, browserdetails  } from "../core/jio";

export default function RegisterComponent() {
  const[loading, setLoading] = useState(false);
  const [filedata, setFiledata] = useState('');
  const getFilePath = (data)=>{setFiledata(data);}
  const { register, handleSubmit, formState: { errors } } = useForm();
  const handleError = (errors) => { };
  const { push } = useRouter();
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [stateID, setStateID] = useState('');
  const [statename, setStatename] = useState('');
 
  const ipInfo = ipaddress();
  const osInfo = osdetails();
  const browserInfo = browserdetails();

  const setBT = setBearerToken();
  const isUT = isUserToken();
  const isUser = isValideUser();
  useEffect(() => {
    if(isUT) { push("/dashboard"); return }
  }, [isUT]);
 
    useEffect(() => {
      setLoading(true); 
      axios({
        url: process.env.BASE_URL + "CommonUtility/State?countryId=1",
        method: "GET",
        headers: { 'authorization': 'Bearer '+ setBT  },
      }).then((res) => {
          setStateList(res.data);
          setLoading(false); 
      }).catch((err) => {
          setLoading(false); 
          console.log(err.message);
      });
       

      stateID !== '' ?
          axios({
            url: process.env.BASE_URL + "CommonUtility/City?stateId="+stateID,
            method: "GET",
            headers: { 'authorization': 'Bearer '+ setBT  },
          }).then((res) => {
            setCityList(res.data);
          }).catch((err) => {
              console.log(err.message);
          })
     : null;
    }, [stateID]);
 
 
  const handleRegistration = (data) => 
  {
    setLoading(true);
    const datafinal = {
      firstname: data.firstname,
      lastname: data.lastname,
      fullname: data.firstname + " " + data.lastname,
      gender: '',
      phonenumber: data.mobilenumber,
      emailaddress:'',
      aadhaarinfo: data.aadhaarinfo,
      addressline1: "",
      city: data.city,
      state: statename,
      country: "India",
      postalcode: "",
      profilepictureurl: data.profilepic,
      dateofbirth: "",
      languagepreference: "English",
      locationpage: "/register",
      ipaddress: ipInfo,
      osdetails: osInfo,
      browserdetails: browserInfo
    }
    // console.log(datafinal);
    
    axios({
          url: process.env.BASE_URL + "Customer/SaveUser",
          method: "POST",
          headers: { 'authorization': 'Bearer '+ setBT  },
          data: datafinal,
      }).then((res) => {
       // console.log(res);
        setLoading(false);
        localStorage.setItem('userprofilepic', data.profilepic);
        localStorage.setItem('userprofilename',  data.firstname + " " + data.lastname);
        res.data.result ? (toast.success('Registation Successfully'), push("/approval")) : toast.warn(res.data.resultmessage);
      }).catch((err) => {
        toast.error(err.message);
        setLoading(false); 
      });
      
  }

  
  const onInputmaxLength = (e) => {
    if(e.target.value.length > e.target.maxLength)
    {
      e.target.value = e.target.value.slice(0, e.target.maxLength);
    }
  }
  
 
  return (
  <>


    <HeaderComponent />
    <div className="screenmain">
      <div className="screencontainer">
        <form onSubmit={handleSubmit(handleRegistration, handleError)}>
          <div className="registercontainer">
            <div className="registerSmallHead">SIGN UP</div>
            <div className="registerHead">Setup your profile</div>
            <ImageCropperWithPreview filePath={getFilePath} />

            <div style={{ position:"absolute", top:"-99999px", left:"-99999px" }}>
              <input type="text" value={filedata} name="profilepic" {...register('profilepic', registerOptions.profilepic)} />
            </div>
            { filedata === '' ? <span className="registerError registerErrorCenter"> {errors?.profilepic && errors.profilepic.message} </span> : null }

              <InputWrapperComponent
                  type="number"
                  name="mobilenumber"
                  labeltext="Mobile Number"
                  maxLength={10}
                  onInput={onInputmaxLength}
                  {...register('mobilenumber', registerOptions.mobilenumber)}
                  errors={errors?.mobilenumber && errors.mobilenumber.message}
                />
 
              <InputWrapperComponent
                  type="text"
                  name="firstname"
                  labeltext="First Name"
                  maxLength={20}
                  onInput={onInputmaxLength}
                  {...register('firstname', registerOptions.firstname)}
                  errors={errors?.firstname && errors.firstname.message}
                />
                <InputWrapperComponent
                  type="text"
                  name="lastname"
                  labeltext="Last Name"
                  maxLength={20}
                  onInput={onInputmaxLength}
                  {...register('lastname', registerOptions.lastname)}
                  errors={errors?.lastname && errors.lastname.message} 
                />
                
                <div className="registerField">
                      <div className="registertext">Select State <small>*</small></div>
                      <select  name="state" className="registerSelect" {...register('state',  registerOptions.state)}  onChange={ e => 
                        { setStatename(e.target.value);  setStateID(e.target.options[e.target.selectedIndex].title); } }> 
                        <option value="" title=""></option>
                         {
                            stateList.map((val) => <option value={val.name} title={val.id} key={val.id}>{val.name}</option>)
                         }
                      </select>
                      { errors?.state && <span className="registerError"> {errors.state.message}</span> }
                      <div className="registerLineText">Enter State name to pick nearby City</div>
                </div>
                { stateID !== '' ? 
                <div className="registerField">
                      <div className="registertext">Select City <small>*</small></div>
                      <select name="city" className="registerSelect" {...register('city', registerOptions.city)}>
                        <option value=""></option>
                         {
                            cityList.map((val) => <option value={val.name} key={val.id}>{val.name}</option>)
                         }  
                      </select>
                      { errors?.city && <span className="registerError">{errors.city.message}</span> }
                </div>
                : null }


                <InputWrapperComponent
                  type="number"
                  name="aadhaarinfo"
                  labeltext="Aadhaar Number"
                  maxLength={12}
                  onInput={onInputmaxLength}
                  {...register('aadhaarinfo', registerOptions.aadhaarinfo)}
                  errors={errors?.aadhaarinfo && errors.aadhaarinfo.message} 
                />
                <div className="registerLineText">Profile details should match with Aadhaar</div>

 
                <div className="registerSubmit">
                  <button className="register_button">Submit</button>
                </div>

                <div className="registerBottomText">
                  Already have an account?  <Link href='/'>Sign in</Link>
                </div>
              </div>
          </form>
        </div>
    </div>



    { loading ? <Loader /> : null }
  </>
  )
}

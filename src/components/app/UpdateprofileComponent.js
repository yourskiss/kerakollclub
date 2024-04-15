"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import HeaderComponent from "../shared/HeaderComponent";
import Loader from "../shared/LoaderComponent";
import {  setBearerToken } from "@/config/beararauth";
import { getUserID, getUserMobile, isUserToken, isValideUser } from "@/config/userauth";
import { toast } from 'react-toastify';
import ImageCropperUpdate from "../core/ImageCropperUpdate";
import { ipaddress, osdetails, browserdetails  } from "../core/jio";

export default function UpdateprofileComponent() {
    const[loading, setLoading] = useState(false);
    const { push } = useRouter();
    const setBT = setBearerToken()
    const isUT = isUserToken();
    const isUser = isValideUser();
    const userID = getUserID();
    const userMobile = getUserMobile();
    const ipInfo = ipaddress();
    const osInfo = osdetails();
    const browserInfo = browserdetails();
    const [userdata, setUserdata] = useState({});
  
    const [data, setData] = useState(false);
    const [formValue, setFormValue] = useState({});
    const [formError, setFormError] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filedata, setFiledata] = useState('');
    const getFilePath = (data)=>{setFiledata(data);}

    const [citystateList, setCitystateList] = useState([]);
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');


    useEffect(() => {
        setLoading(true); 
        axios({
          url: process.env.BASE_URL + "CommonUtility/StateCity",
          method: "GET",
          headers: { 'authorization': 'Bearer '+ setBT  },
        }).then((res) => {
           // console.log(res);
            setCitystateList(res.data);
            setLoading(false); 
        }).catch((err) => {
            setLoading(false); 
            console.log(err.message);
        });
      }, []);
    
 

    
    useEffect(() => {
        if(!isUT) { push("/"); return  }
        setLoading(true);
        axios({
            url: process.env.BASE_URL + "Customer/UserInfo?userid=0&phonenumber="+ userMobile,
            method: "GET",
            headers: { 'authorization': 'Bearer '+ setBT },
        }).then((res) => {
          //  console.log("get---", res.data.result);
            setLoading(false);
            setData(true);
            setUserdata(res.data.result);
            setStateName(res.data.result.state);
            setCityName(res.data.result.city);
            setFiledata(res.data.result.profilepictureurl);
        }).catch((err) => {
            toast.warn(err.message);
            setLoading(false); 
        });
         
    }, [isUT]);
 
 
    useEffect(() => {
        setFormValue({
            'profilepictureurl': userdata.profilepictureurl,
            'firstname':  userdata.firstname,
            'lastname':  userdata.lastname,
            'city':  userdata.city,
            'state':  userdata.state,
            'aadhaarinfo': userdata.aadhaarinfo
        });
    }, [data]);

    const validateHandler =(val) =>{
        const error = {};
        if(val.profilepictureurl===''){error.profilepictureurl = "Profile Picture is required"}
        if(val.firstname===''){error.firstname = "First name is required"}
        if(val.lastname===''){error.lastname = "Last name is required"}
        if(val.citystatename===''){error.state = "City is required"}
        if(val.aadhaarinfo===''){error.aadhaarinfo = "Aadhaar number is required"}
        else if(val.aadhaarinfo.length < 12){error.aadhaarinfo = "Aadhaar must have at least 12 Digit"}
        return error;
    }
    const handleSubmit = (e) =>{
        e.preventDefault();
        setFormError(validateHandler(formValue));
        setIsSubmit(true);
       // console.log("formValue on submit", formValue);
    }
    const onChangeField = (e) => { 
        setFormValue({ ...formValue, [e.target.name] : e.target.value }); 
        if(e.target.name === "citystatename")
        { 
            setStateName(e.target.options[e.target.selectedIndex].title); 
            setCityName(e.target.value); 
           // console.log(stateName, cityName);
        }
        if(e.target.name === "profilepictureurl"){ setFiledata(e.target.value);  }
    }
    useEffect(()=>{
        if(Object.keys(formError).length === 0 && isSubmit)
        {
           const datafinal = 
           {
            userid: userID,
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            fullname: formValue.firstname + " " + formValue.lastname,
            gender: "",
            phonenumber: userMobile,
            emailaddress: "",
            aadhaarinfo: formValue.aadhaarinfo,
            addressline1: "",
            city: cityName,
            state: stateName,
            country: "India",
            postalcode: "",
            profilepictureurl: filedata,
            dateofbirth: "",
            languagepreference: "English",
            locationpage: "/update-profile",
            ipaddress: ipInfo,
            osdetails: osInfo,
            browserdetails: browserInfo
          }
         // console.log("datafinal - ",datafinal);
            setLoading(true);
            axios({
                url: process.env.BASE_URL + "Customer/SaveUser",
                method: "POST",
                headers: { 'authorization': 'Bearer '+ setBT  },
                data: datafinal,
            }).then((res) => {
               // console.log(res);
                setLoading(false);
                localStorage.setItem('userprofilepic', res.data.result.profilepictureurl);
                localStorage.setItem('userprofilename',  res.data.result.firstname + " " + res.data.result.lastname);
                res.data.result ? (toast.success("Profile Updated Successfully."),push("/dashboard")) : toast.warn(res.data.resultmessage);
            }).catch((err) => {
                setLoading(false); 
                toast.error(err.message);
            });
        }
    },[formError, isSubmit]);

    const onInputmaxLength = (e) => {
        if(e.target.value.length > e.target.maxLength)
        {
          e.target.value = e.target.value.slice(0, e.target.maxLength);
        }
    }
     
  return (
    <>
    <HeaderComponent />
    <div className='screenmain'>
        <section className="screencontainer">
        <form onSubmit={handleSubmit}>
            <div className="registercontainer">
                <div className="registerHead">Update your profile</div>
                <ImageCropperUpdate picvalue={ filedata } filePath={getFilePath} />
                <div style={{   position:"absolute", top:"-99999px", left:"-99999px"  }}>
                    <input 
                        className="registerinput"
                        type="text" 
                        name="profilepictureurl" 
                        value={ filedata } 
                        onChange={onChangeField}  
                    />
                    <span className="registerError">{ formError.profilepictureurl ? formError.profilepictureurl : '' }</span>
                </div>
                
                <div className="registerField">
                    <div className="registertext">First name <small>*</small></div>
                    <input
                        className="registerinput"
                        type="text"
                        name="firstname"
                        maxLength={25}
                        onInput={onInputmaxLength}
                        value={ formValue.firstname  || ''  }
                        onChange={onChangeField}
                    />
                    <span className="registerError">{ formError.firstname  ?  formError.firstname : '' }</span>
                </div>

                <div className="registerField">
                    <div className="registertext">Last name <small>*</small></div>
                    <input
                        className="registerinput"
                        type="text"
                        name="lastname"
                        maxLength={25}
                        onInput={onInputmaxLength}
                        value={ formValue.lastname  || ''  }
                        onChange={onChangeField}
                    />
                   <span className="registerError">{formError.lastname  ?  formError.lastname : '' }</span>
                </div>
 

 


                <div className="registerField">
                      <div className="registertext">Select State <small>*</small></div>
                      <select  name="citystatename" className="registerSelect" value={ cityName || '' } onChange={onChangeField}>
                         {
                            citystateList.map((val) => <option value={val.cityname} title={val.statename} key={val.id}>{val.statecityname}</option>)
                         }
                      </select>
                      <span className="registerError">{ formError.citystatename  ?  formError.citystatename : '' }</span> 
                      <div className="registerLineText">Enter State name to pick nearby City</div>
                </div>
                
 
                

                <div className="registerField">
                    <div className="registertext">Aadhaar Number <small>*</small></div>
                    <input
                        className="registerinput"
                        type="number"
                        name="aadhaarinfo"
                        maxLength={12}
                        onInput={onInputmaxLength}
                        value={ formValue.aadhaarinfo || '' }
                        onChange={onChangeField}
                    />
                    <span className="registerError">{ formError.aadhaarinfo  ?  formError.aadhaarinfo : '' }</span> 
                </div>
       
                <div className="registerSubmit">
                  <button className="register_button">Update</button>
                </div>
            </div>
        </form>
    </section>
    </div>
 


        { loading ? <Loader /> : null }
    </>
  )
}

  
 
 
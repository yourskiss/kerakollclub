"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import HeaderComponent from "../shared/HeaderComponent";
import Loader from "../shared/LoaderComponent";
import { getUserID, getUserMobile, isUserToken } from "@/config/userauth";
import { toast } from 'react-toastify';
import ImageCropperUpdate from "../core/ImageCropperUpdate";
import { ipaddress, osdetails, browserdetails  } from "../core/jio";
import CitystateUpdateComponent from "../shared/CitystateUpdateComponent";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { _get, _post } from "@/config/apiClient";

export default function UpdateprofileComponent() {
    const[loading, setLoading] = useState(false);
    const[ismount, setIsmount] = useState(false);
    const { push } = useRouter();
    const isUser = isUserToken();
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

 
    
    const [cityStateName, setCityStateName] = useState('');
    const [stateName, setStateName] = useState('');
    const [cityName, setCityName] = useState('');

    useEffect(() => {
        if(!isUser) { push("/"); return  }
        setIsmount(true);
    }, [isUser]);

    useEffect(() => {
        setLoading(true);
        _get("Customer/UserInfo?userid=0&phonenumber="+ userMobile)
        .then((res) => {
          //  console.log("get---", res.data.result);
            setLoading(false);
            setData(true);
            setUserdata(res.data.result);
            setCityStateName(`${res.data.result.city} (${res.data.result.state})`)
            setStateName(res.data.result.state);
            setCityName(res.data.result.city);
            setFiledata(res.data.result.profilepictureurl);
        }).catch((err) => {
            toast.warn(err.message);
            setLoading(false); 
        });
      // console.log("onload - ", cityStateName, " ==== ", stateName, " - ", cityName);
    }, [ismount]);
 
 
    useEffect(() => {
        setFormValue({
            'profilepictureurl': userdata.profilepictureurl,
            'firstname':  userdata.firstname,
            'lastname':  userdata.lastname,
            'aadhaarinfo': userdata.aadhaarinfo
        });
      //  console.log("after load - ", cityStateName, " ==== ", stateName, " - ", cityName);
    }, [data]);

    const validateHandler =(val) =>{
        const error = {};
        if(val.profilepictureurl===''){error.profilepictureurl = "Profile Picture is required"}
        if(val.firstname===''){error.firstname = "First name is required"}
        if(val.lastname===''){error.lastname = "Last name is required"}
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
    const handleOptionChange = (sc, st, ct) => {
        setCityStateName(sc);
        setStateName(st);
        setCityName(ct);
        console.log("change update - ", cityStateName, " - ", stateName, " - ", cityName);
     };

    const onChangeField = (e) => { 
        setFormValue({ ...formValue, [e.target.name] : e.target.value }); 
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
            _post("Customer/SaveUser", datafinal)
            .then((res) => {
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
                      <div className="registertext">Select City <small>*</small></div>
                      { data ? (
                      <ErrorBoundary>
                          <CitystateUpdateComponent scChange={handleOptionChange} nameSC={cityStateName} nameS={stateName} nameC={cityName} />
                      </ErrorBoundary>
                      ) : null }
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

  
 
 
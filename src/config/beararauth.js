import axios from "axios";
import Cookies from 'js-cookie';

const setBeararCookies = (name, val) => {
   return Cookies.set(name, val, { expires: new Date(new Date().getTime() + 3600000), secure: true });
}
 
const isBearerToken = () => {
  const isBearer = !!Cookies.get('bearertoken');
  return isBearer;
}
const getBearerToken = () => {
  const isValue = Cookies.get('bearertoken');
  return isValue;
}

const setBearerToken = () => {
  const isBearerToken = !!Cookies.get('bearertoken');
      if(!isBearerToken)
      { 
          axios({
              url: process.env.BASE_URL +"ApiAuth/authtoken",
              method: "POST",
              headers: {  "Content-Type": "application/json" },
              data: JSON.stringify({ "userid": process.env.API_USERNAME, "password": process.env.API_PASSWORD }),
          }).then((res) => {
              if(res.status == 200) 
              {
                setBeararCookies('bearertoken', res.data.token);
              }
              else 
              {
                  console.log(res.statusText)
              }
          }).catch((err) => {
              console.log(err.message);
          }); 
      }
      return Cookies.get('bearertoken');
}
export {isBearerToken, getBearerToken, setBearerToken, setBeararCookies};
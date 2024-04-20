import Cookies from 'js-cookie';
import axios from 'axios';

const apiURL = process.env.BASE_URL;
const apiUsername = process.env.API_USERNAME;
const apiPassword = process.env.API_PASSWORD;

const bearerApiClient = axios.create({
  baseURL: apiURL,
  headers: {  "Content-Type": "application/json" },
});
const _bearer_post = (url, data = {}, config = {}) => {
  return bearerApiClient.post(url, data, config);
};
const _bearer_data = JSON.stringify({ "userid": apiUsername, "password": apiPassword });

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
        _bearer_post("ApiAuth/authtoken", _bearer_data)
        .then((res) => {
              if(res.status == 200) 
              {
                Cookies.set('bearertoken', res.data.token, { expires: new Date(new Date().getTime() + 3600000), secure: true })
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
export {_bearer_post, isBearerToken, getBearerToken, setBearerToken};
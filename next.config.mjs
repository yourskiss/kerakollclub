 /** @type {import('next').NextConfig} */
const nextConfig = {
        env: {
          BASE_URL: "http://testclub.kerakoll.com:3000/api/",
          API_USERNAME: "admin",
          API_PASSWORD: "admin@123",
          COUPON_URL: "http://localhost:62819/coupon.aspx",
          COUPON_URL2 : "http://127.0.0.1:3000/",
          COUPON_URL3 : "https://kerakollclub.vercel.app/",
          COUPON_URL4 : "https://kerakoll.vercel.app/"
        }
};

export default nextConfig;



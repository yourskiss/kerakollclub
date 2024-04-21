// import { Inter } from "next/font/google";
// const inter = Inter({ subsets: ["latin"] });

import localFont from 'next/font/local';
const arialmt = localFont({ weight: '500', variable: '--font-arialmt', src: './arialmt.woff2' });
const lneue = localFont({ weight: 'bold', variable: '--font-lneue', src: './lneue.woff2' });


import Script from "next/script";
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Starfield from 'react-starfield';

export const metadata = {
  title: "kerakoll app",
  description: "kerakoll app",
  manifest:'./manifest.json',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta name="background_color" content="#AFCDAF"/>
      <meta name="theme-color" content="#414141"/>
      {/* <body className={inter.className}> */}
      <body className={arialmt.className}>
        <main className="main">
          <Starfield starCount={1000} starColor={[255, 255, 255]} speedFactor={0.05} />
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"  />
          {children}
        </main>
        <Script src="/service-worker.js" />
      </body>
    </html>
  );
}

import localFont from "next/font/local";

const ClashDisplay = localFont({
  src: [
    {
      path: "./arialmt.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./lneue.woff2",
      weight: "bold",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
});

export { ClashDisplay };
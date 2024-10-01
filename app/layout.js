'use client';

import localFont from "next/font/local";
import "../styles/tailwind.css";
import "../styles/slick.css";
import Header from "./landing/Layout/Header";
import Footer from "./landing/Layout/Footer";
import { useState, useEffect } from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// export const metadata = {
//   title: "DataDojo App",
//   description: "DataDojo next app",
// };

export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body
        className={' bg-white-500 dark:bg-dark-100'}
      >
        {/* <Header toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode} 
         /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}

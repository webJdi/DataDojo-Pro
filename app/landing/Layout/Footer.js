'use client'; // Mark as a client component

import React from 'react';
import Image from 'next/image'; // Import Next.js Image

const Footer = ({isDarkMode}) => {
  return (
    <div className={"bg-white-300 pt-44 pb-24" + ' bg-white-300 dark:bg-dark-300'}>
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
        {isDarkMode ? (
            <Image
              src="/assets/Logo2.png"
              alt="Your Website Logo"
              width={200}
              height={100}
            />
          ) : (
            <Image
              src="/assets/Logo.png"
              alt="Your Website Logo"
              width={200}
              height={100}
            />
          )}
          <p className={"mb-4" + ' text-black-500 dark:text-gray-100'}>
            <strong className="font-medium">DataDojo</strong>
            <br></br>
            Your DSA journey, simplified
          </p>
          <div className="flex w-full mt-2 mb-8 -mx-2">
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Image src="/assets/Icon/facebook.svg" alt="Facebook" width={24} height={24} />
            </div>
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Image src="/assets/Icon/twitter.svg" alt="Twitter" width={24} height={24} />
            </div>
            <div className="mx-2 bg-white-500 rounded-full items-center justify-center flex p-2 shadow-md">
              <Image src="/assets/Icon/instagram.svg" alt="Instagram" width={24} height={24} />
            </div>
          </div>
          <p className="text-gray-400">
            ©{new Date().getFullYear()} - DataDojo. All rights reserved.
          </p>
        </div>
        {/* <div className=" row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Product</p>
          <ul className="text-black-500 ">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Download{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Pricing{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Locations{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Server{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Countries{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Blog{' '}
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Engage</p>
          <ul className="text-black-500">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              DataDojo?{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              FAQ{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Tutorials{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              About Us{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Privacy Policy{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Terms of Service{' '}
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-11 sm:col-end-13 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Earn Money</p>
          <ul className="text-black-500">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Affiliate{' '}
            </li>
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
              Become Partner{' '}
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Footer;
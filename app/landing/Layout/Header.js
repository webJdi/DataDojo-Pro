'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link as LinkScroll } from 'react-scroll';
import ButtonOutline from '../misc/ButtonOutline.';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


const Header = ({ toggleDarkMode, isDarkMode }) => {
  const [activeLink, setActiveLink] = useState(null);
  const [scrollActive, setScrollActive] = useState(false);

  const router = useRouter();

  const handleSignupClick = () => {
    router.push('/signup');
  };

  useEffect(() => {

    window.addEventListener('scroll', () => {
      setScrollActive(window.scrollY > 20);
    });

  }, []);


  return (
    <>
      <header
        className={
          'fixed top-0 w-full z-30 transition-all ' +
          (scrollActive ? 'shadow-md pt-0' : 'pt-4') +
          ' bg-white-500 dark:bg-dark-100'
        }
      >
          <nav className="max-w-screen-xl px-0 sm:px-2 lg:px-4 mx-auto grid grid-flow-col py-3 sm:py-4">
            <div className="col-start-1 col-end-2 flex items-center">
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
            </div>
          <ul className="hidden lg:flex col-start-2 col-end-4 items-center justify-start">
            <LinkScroll
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('about');
              }}
              className={
                'px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative' +
                (activeLink === 'about'
                  ? ' text-orange-500 dark:text-orange-500 animation-active '
                  : ' text-black-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500')
              }
            >
              About
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="feature"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('feature');
              }}
              className={
                'px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative' +
                (activeLink === 'feature'
                  ? ' text-orange-500 dark:text-orange-500 animation-active '
                  : ' text-black-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-500')
              }
            >
              Feature
            </LinkScroll>
            {/* <LinkScroll
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('pricing');
              }}
              className={
                'px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative' +
                (activeLink === 'pricing'
                  ? ' text-orange-500 animation-active '
                  : ' text-black-500 hover:text-orange-500 ')
              }
            >
              Pricing
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="testimoni"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('testimoni');
              }}
              className={
                'px-4 py-2 mx-2 cursor-pointer animation-hover inline-block relative' +
                (activeLink === 'testimoni'
                  ? ' text-orange-500 animation-active '
                  : ' text-black-500 hover:text-orange-500 ')
              }
            >
              Testimonial
            </LinkScroll> */}
          </ul>
          <div className="col-start-10 col-end-12 font-medium flex justify-end items-center">
            {/* Moon icon for dark mode toggle */}
            <button onClick={toggleDarkMode} className="mr-2">
              {!isDarkMode ? (
                <Image
                src="/assets/Icon/night-icon.png"
                alt="night icon"
                width={25}
                height={25}
              />
              ) : (
                <Image
                src="/assets/Icon/day-icon.png"
                alt="night icon"
                width={25}
                height={25}
              />
              )}
            </button>
            <Link
              href="/signin"
              className="text-black-600 dark:text-gray-400 mx-2 sm:mx-4 capitalize tracking-wide hover:text-orange-500 dark:hover:text-orange-500 transition-all"
            >
              Sign In
            </Link>
            <ButtonOutline onClick={handleSignupClick}>Sign Up</ButtonOutline>
          </div>
        </nav>
      </header>
      {/* Mobile Navigation */}
      <nav className="fixed lg:hidden bottom-0 left-0 right-0 z-20 px-4 sm:px-8 shadow-t ">
        <div className="bg-white-500 dark:bg-dark-100 sm:px-3">
          <ul className="flex w-full justify-between items-center text-black-500 dark:text-gray-400">
            <LinkScroll
              activeClass="active"
              to="about"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('about');
              }}
              className={
                'mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all ' +
                (activeLink === 'about'
                  ? '  border-orange-500 text-orange-500'
                  : ' border-transparent dark:text-gray-400 dark:border-transparent')
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              About
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="feature"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('feature');
              }}
              className={
                'mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all ' +
                (activeLink === 'feature'
                  ? '  border-orange-500 text-orange-500'
                  : ' border-transparent dark:text-gray-400 dark:border-transparent')
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              Feature
            </LinkScroll>
            {/* <LinkScroll
              activeClass="active"
              to="pricing"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('pricing');
              }}
              className={
                'mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all ' +
                (activeLink === 'pricing'
                  ? '  border-orange-500 text-orange-500'
                  : ' border-transparent dark:text-gray-400 dark:border-transparent')
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2M12 6v2m0 4v6"
                />
              </svg>
              Pricing
            </LinkScroll>
            <LinkScroll
              activeClass="active"
              to="testimoni"
              spy={true}
              smooth={true}
              duration={1000}
              onSetActive={() => {
                setActiveLink('testimoni');
              }}
              className={
                'mx-1 sm:mx-2 px-3 sm:px-4 py-2 flex flex-col items-center text-xs border-t-2 transition-all ' +
                (activeLink === 'testimoni'
                  ? '  border-orange-500 text-orange-500'
                  : ' border-transparent dark:text-gray-400 dark:border-transparent')
              }
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Testimoni
            </LinkScroll> */}
          </ul>
        </div>
      </nav>
      {/* End Mobile Navigation */}
    </>
  );
};

export default Header;
// pages/_app.js

import React from 'react';
import Navbar from '../components/navbar.js';
import '../styles/globals.css';
import { useRouter } from 'next/router.js';

function MyApp({ Component, pageProps }) {

  let myRouter=useRouter();

  let isLoginPage= myRouter.pathname==='/'

  

  return (
    <>
      {!isLoginPage &&<Navbar /> }
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

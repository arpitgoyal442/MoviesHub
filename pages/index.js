import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/login.module.css';
import Link from "next/link"
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/router';
function login() {

  const router=useRouter()

  let URL=  process.env.NEXT_PUBLIC_SITE_URL

  const [isSignin,setSignIn]=useState(true)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  


  let handleButtonClick=()=>{

    if(!emailRegex.test(email)){

      alert("Enter a valid email")
      return;
    }

    else if(!strongPasswordRegex.test(password)){
      alert("Enter a strong Password:\n#lowercase\n#uppercase \n#Special character \n#Numeric digit")
      return;
    }


    if(isSignin){

      axios.post(`${URL}/api/auth/signin`,{email:email,password:password}).
      then((data)=>{
        console.log(data)
        if(data.status==200){
        console.log("Login Successfull")
        localStorage.setItem("userid",data.data.id)
        localStorage.setItem("jwt_token",data.data.jwt_token)
        router.push('/home')
        }
        

        if(data.status==401)
        console.log("Incorrect email/password")
      })
      .catch((e)=>{console.log(e)})
    }

    else{

      axios.post(`${URL}/api/auth/signup`,{email:email,password:password}).
      then((data)=>{

        console.log(data.data)
        // if email already exists
        if(data.status==226)
        alert("Email already Exist")
        else alert("Account Created Successfully")
      })
      .catch((e)=>{console.log(e)})


    }




    

  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Movies Hub</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>

        
      
        <Image
        src="/images/logo.png"
        height={344}
        width={344}
        
        />

        
        <div>
        <p className={styles.description}>
          Movies details , Create public/private playlists and more...
        </p>
        </div>

        <div className={styles.toggle}>
        <h2 onClick={()=>{setSignIn(true)}} className={isSignin?styles.primarytoggle:""}>Sign In</h2>
        <h2 onClick={()=>{setSignIn(false)}} className={!isSignin?styles.primarytoggle:""} >Sign Up</h2>
        </div>

       

        <div className={styles.form}>
          <input type="text" placeholder='Email...' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
          <input  type="password" placeholder='Password...'   value={password} onChange={(e)=>{setPassword(e.target.value)}} />
        </div>

        

       
        <button onClick={handleButtonClick}  className={styles.primaryButton}> {isSignin?"Sign In":"SignUp"}</button>
        
        
      </main>

      <footer className={styles.footer}>
        <p>© 2023 RentWheelz. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default login;




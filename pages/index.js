import React, { useState } from "react";
import Head from "next/head";
import styles from "../styles/login.module.css";

import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import Loader from "../components/loader";

function login() {
  const router = useRouter();

  let URL = process.env.NEXT_PUBLIC_SITE_URL;

  const [isSignin, setSignIn] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadermsg, setLoaderMsg] = useState("");
  const [showloader, setShowLoader] = useState(false);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  let handleButtonClick = async () => {
    if (!emailRegex.test(email)) {
      alert("Enter a valid email");
      return;
    } else if (!isSignin && !strongPasswordRegex.test(password)) {
      alert(
        "Enter a strong Password:\n#lowercase\n#uppercase \n#Special character \n#Numeric digit"
      );
      return;
    }

    if (isSignin) {
      setLoaderMsg("Signing in...");
      setShowLoader(true);

      await axios
        .post(`${URL}/api/auth/signin`, { email: email, password: password })
        .then((data) => {
          console.log(data);

          if (data.status == 200) {
            setLoaderMsg("Login Successfull");
            console.log("Login Successfull");
            localStorage.setItem("userid", data.data.id);
            localStorage.setItem("jwt_token", data.data.jwt_token);

            router.push("/home");
          }

          if (data.status == 401) {
            setLoaderMsg("Incorrect email.password");

            console.log("Incorrect email/password");
          }

          setShowLoader(false);
        })

        .catch((e) => {
          setLoaderMsg("Incorrect email.password");

          console.log(e);
        });

      setShowLoader(false);
    } else {
      setLoaderMsg("Signing up...");
      setShowLoader(true)

      await axios
        .post(`${URL}/api/auth/signup`, { email: email, password: password })
        .then((data) => {
          console.log(data.data);
          // if email already exists
          if (data.status == 226) {
            setLoaderMsg("Email Already Exists");
            setShowLoader(false);
          } else {
            setLoaderMsg("Account Created Successfully");
            setShowLoader(false);
          }
        })
        .catch((e) => {
          setLoaderMsg("Error Occured");
            setShowLoader(false);
          console.log(e);
        });
    }
  };

  return (
    <div className={styles.container}>
      <Loader message={loadermsg} show={showloader} />

      <Head>
        <title>Movies Hub</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Image src="/images/logo.png" height={344} width={344} />

        <div>
          <p className={styles.description}>
            Movies details , Create public/private playlists and more...
          </p>
        </div>

        <div className={styles.toggle}>
          <h2
            onClick={() => {
              setSignIn(true);
            }}
            className={isSignin ? styles.primarytoggle : ""}
          >
            Sign In
          </h2>
          <h2
            onClick={() => {
              setSignIn(false);
            }}
            className={!isSignin ? styles.primarytoggle : ""}
          >
            Sign Up
          </h2>
        </div>

        <div className={styles.form}>
          <input
            type="text"
            placeholder="Email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>

        <button onClick={handleButtonClick} className={styles.primaryButton}>
          {" "}
          {isSignin ? "Sign In" : "SignUp"}
        </button>
      </main>

      <footer className={styles.footer}>
        <p>© 2023 MoviesHub. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default login;

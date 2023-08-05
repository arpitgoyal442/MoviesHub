

import Link from 'next/link';
import styles from '../styles/navbar.module.css';
import { useState ,useEffect} from 'react';
import { useRouter } from 'next/router';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [userid,setUserId]=useState(null)

  const myRouter=useRouter();

  useEffect(()=>{

    let userid=localStorage.getItem("userid")

    if(userid!=null && userid!="")
    setUserId(userid)
  })

  function handleLoginClick(){

    if(!userid){
      myRouter.push("/")
    }else{

      localStorage.removeItem("jwt_token")
      localStorage.removeItem("userid")
      myRouter.push("/")

    }

  }

  
 

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/home">
          

          <img src="/images/logo.png" alt="logo" />
         
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link  href="/playlist">
          My Playlists
          </Link>
        </li>
        <li>
          <Link href="/home">
            Home
          </Link>
        </li>
        <li className={styles.userimg}>
          <div onClick={toggleDropdown}>
            <img src="/images/userimg.png" alt="User Image" />
          </div>
          {dropdownOpen && (
            <ul className={styles.dropdown}>
              
              <li
                 onClick={handleLoginClick}>{userid?"Logout":"Login"}
              </li>
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

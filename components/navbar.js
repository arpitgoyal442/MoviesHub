
import Link from 'next/link';
import styles from '../styles/navbar.module.css';
import { useState ,useEffect} from 'react';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);



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
          
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

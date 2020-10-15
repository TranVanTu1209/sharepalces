import React, { useContext } from 'react'
import './NavLinks.css';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';

const NavLinks = () => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          All Users
        </NavLink>
      </li>
      {
        auth.isLoggedin && <li>
          <NavLink to={`/${auth.userId}/places`} >
            My Places
        </NavLink>
        </li>
      }
      {
        auth.isLoggedin && <li>
          <NavLink to="/places/new" >
            New Place
        </NavLink>
        </li>
      }
      {
        auth.isLoggedin && <li onClick={auth.logout} >
          <NavLink to="/auth" >
            Logout
          </NavLink>
        </li>
      }
      {
        !auth.isLoggedin && <li>
          <NavLink to="/auth" >
            Authenticate
          </NavLink>
        </li>
      }

    </ul>
  )
}

export default NavLinks;

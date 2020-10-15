import React, { useState } from 'react';
import './MainNavigation.css';
import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from './Backdrop';
import { Link } from 'react-router-dom';

const MainNavigation = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  return (
    <React.Fragment>
      {
        drawerIsOpen && <Backdrop onClick={() => setDrawerIsOpen(false)} />
      }
      {
        drawerIsOpen &&
        <SideDrawer show={drawerIsOpen} onClick={() => setDrawerIsOpen(false)} >
          <nav className="main-navigation__drawer-nav" >
            <NavLinks />
          </nav>
        </SideDrawer>
      }
      <MainHeader>
        <button onClick={() => setDrawerIsOpen(true)} className="main-navigation__menu-btn">
          <span></span> <span></span> <span></span>
        </button>
        <h1 className="main-navigation__title" >
          <Link to="/">
            Your Places
          </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
}

export default MainNavigation;

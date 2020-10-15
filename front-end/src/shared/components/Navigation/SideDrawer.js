import React from 'react';
import './SideDrawer.css';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

const SideDrawer = (props) => {
  const content = <CSSTransition
    in={props.show}
    timeout={400}
    classNames="slide-in-left"
    mountOnEnter
    unmountOnExit >
    <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
  </CSSTransition>
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};

export default SideDrawer;

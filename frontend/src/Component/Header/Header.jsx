import React from 'react'
import './Header.css'
import {Container, Row, Button} from 'reactstrap'

import Logo from '../../assets/logo.png'
import { NavLink, Link } from 'react-router-dom'

// Navigation links for the header

const nav_links=[
  {
    path:'/home',
    display:'Home'
  },
  {
    path:'/about',
    display:'About'
  },
  {
    path:'/CulturalHeritageGuide',
    display:'CulturalHeritage'
  },
]

const Header = () => {
  return (
    <header className='header'>
      <Container>
        <Row>
          <div className='nav_wrapper d-flex align-items-center justify-content-between'>
            <div className='Logo'>
              <img src={Logo} alt="Logo" />
            </div>
            <nav className="navigation">
              <ul className="menu d-flex align-items-center gap-5">
                {nav_links.map((item, index) => (
                  <li className='nav_item' key={index}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => (isActive ? 'active_link' : '')}
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            <div className='nav_right d-flex align-items-center gap-4'>
              <div className='nav_btns d-flex align-items-center gap-4'>
                <Button className='btn secondary_btn'>
                  <Link to='/login' className='text-decoration-none text-reset'>
                    Login
                  </Link>
                </Button>
                <Button className='btn primary_btn'>
                  <Link to='/register' className='text-decoration-none text-reset'>
                    Register
                  </Link>
                </Button>
              </div>
              <span className='menu' onClick={() => document.querySelector('.navigation').classList.toggle('active')}>
                <i class="ri-menu-line"></i>
              </span>
            </div>
            </nav>
          </div>
        </Row>
      </Container>
    </header>
  );
}

export default Header

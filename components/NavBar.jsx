import React from 'react';
import Link from 'next/link';
import { AiOutlineShopping } from 'react-icons/ai';

import { Cart } from './';
import { useStateContext } from '../context/StateContext';

const NavBar = () => {
  const { showCart, setShowCart, totalQuantities, connectMetamask, signedin, connectedAddress } = useStateContext();

  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href='/'>Arcade Chain</Link>
      </p>
    <div className="navbar-right">
      <button type='button' className='signin' onClick={connectMetamask}>{signedin === true ? `${connectedAddress}` : 'Sign In' }</button>
      <button type='button' className='cart-icon' onClick={() => setShowCart(true)}>
        <AiOutlineShopping/>
        <span className='cart-item-qty'>{totalQuantities}</span>
      </button>
    </div>

      {showCart && <Cart/>}
    </div>
  )
}

export default NavBar
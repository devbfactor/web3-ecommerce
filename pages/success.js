import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BsBagCheckFill } from 'react-icons/bs';

import { useStateContext } from '../context/StateContext';

const Success = () => {
  const { setCartItems, setTotalPrice, setTotalQuantities, connectedAddress } = useStateContext();
  
  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for supporting indie creators!</h2>
        <p className="email-msg">The product code will be delivered to you shortly.</p>
        <p className="description">
          You will be given time to confirm delivery or dispute in case of a faulty key. After this time has lapsed, the transaction will be automatically confirmed.
        </p>
        <div className='successBtns'>
          <button type="button" width="300px" className="btn">
            Confirm Delivery
          </button>
          <button type="button" width="300px" className="btn">
            Dispute Product
          </button>
        </div>
      </div>
    </div>
  )
}

export default Success
import React from 'react'
import { useSelector } from 'react-redux';
import image1 from "../../../assets/images/medal.png"
import image2 from "../../../assets/images/truck.png"
import image3 from "../../../assets/images/handshake.png"
import image4 from "../../../assets/images/headphones.png"
import image5 from "../../../assets/images/creditcard.png"

const ProductDescription = ({productInfo}) => {

  return (
    <div className='tab-pane fade active show' id='product-description' role='tabpanel' aria-labelledby='nav-home-tab'>
      <div className='row mt-3'>
        <div className='col-xl-6 col-lg-6 col-md-4'>
          <h2>Description</h2>
          <p className='desc'>{productInfo?.product_head[0]?.ldesc}</p>
        </div>
        <div className='col-xl-3 col-lg-3 col-md-4'>
          <h2>Feature</h2>
          <div className='feature-info'>
            <div className='d-flex align-items-center gap-2 mb-3'><img src={image1} alt="warranty" /><span>Free 1 Year Warranty</span></div>
            <div className='d-flex align-items-center gap-2 mb-3'><img src={image2} alt="delivery" /><span>Free Shipping & Fasted Delivery</span></div>
            <div className='d-flex align-items-center gap-2 mb-3'><img src={image3} alt="moneyback" /><span>100% Money-back guarantee</span></div>
            <div className='d-flex align-items-center gap-2 mb-3'><img src={image4} alt="support" /><span>24/7 Customer support</span></div>
            <div className='d-flex align-items-center gap-2 mb-3'><img src={image5} alt="paymentsecurity" /><span>Secure payment method</span></div>
          </div>
        </div>
        <div className='col-xl-3 col-lg-3 col-md-4'>
          <h2>Shipping Information</h2>
          <div className='shipping-info'>
            <p>Courier: <span> 2 - 4 days, free shipping</span></p>
            <p>Local Shipping: <span> up to one week, $19.00</span></p>
            <p>UPS Ground Shipping: <span> 4 - 6 days, $29.00</span></p>
            <p>Unishop Global Export: <span> 3 - 4 days, $39.00</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDescription
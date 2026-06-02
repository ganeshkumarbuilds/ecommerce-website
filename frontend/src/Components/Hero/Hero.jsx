import React from 'react'
import'./Hero.css'
import hand_icon from '../Assests/hand_icon.png'
import arrow_icon from '../Assests/arrow.png'
import hero_image from '../Assests/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>NEW ARRIVALS ONLY</h2>
            <div>
                <div className="hero-hand-icon">
                    <img src={hand_icon} alt="" />

                </div>
                <ul class="quote-list">
  <li>UNLEASH THE RAW ENERGY</li>
  <li>DON'T POSTPONE YOUR STYLE</li>
  <li>STEP INTO THE FUTURE</li>
  <li>COP THE NEW LOOK</li>
</ul>
                
            </div>
            

        </div>
        <div className="hero-right">
            <img src={hero_image}/>

        </div>
      
    </div>
  )
}

export default Hero

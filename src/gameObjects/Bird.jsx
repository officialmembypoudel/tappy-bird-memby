// Bird.js
import React from 'react';

import BirdImage from '../assets/backgrounds/bird.png';

const Bird = ({ position }) => {
  const birdStyle = {
    // position: 'absolute',
    top: position.y,
    left: position.x,
    // width: '80px',
    // height: '80px',
    // backgroundColor: 'transparent',
    // borderRadius: '50%',
    // animation: 'gelatine 2s infinite',
    // transform: 'scale(10)',
  };

  return (
    <div style={birdStyle} className='bird'>
      <img
        src={BirdImage}
        alt='bird'
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};

export default Bird;

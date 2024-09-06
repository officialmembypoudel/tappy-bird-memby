// Obstacle.js
import React from 'react';
import ObstacleTree from '../assets/backgrounds/obstacle-tree.png';

const Obstacle = ({ position, height }) => {
  const obstacleStyle = {
    position: 'absolute',
    top: position.y,
    left: position.x,
    width: '70px',
    height: `${height}px`,
    backgroundColor: 'transparent',
    // backgroundImage: `url(${ObstacleTree})`,
    // position: 'cover',
  };

  return (
    <div style={{ ...obstacleStyle }}>
      <img
        src={ObstacleTree}
        alt='obstacle'
        style={{
          width: '110%',
          height: '100%',
          // marginTop: '-10px',
          // marginBottom: '-10px',
        }}
      />
    </div>
  );
};

export default Obstacle;

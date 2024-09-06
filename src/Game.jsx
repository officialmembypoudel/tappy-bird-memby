// Game.js
import React, { useState, useEffect, createRef } from 'react';
import Bird from './gameObjects/Bird';
import Obstacle from './gameObjects/Obstacle';
import Clouds from './assets/backgrounds/clouds.gif';
import HousesBg from './assets/backgrounds/houses.jpg';
import BGM from './assets/backgrounds/sounds/backgroundsound.wav';
import Tapped from './assets/backgrounds/sounds/tap.wav';
import GameOver from './assets/backgrounds/sounds/gameover.wav';

const Game = () => {
  const [birdPosition, setBirdPosition] = useState({ x: 50, y: 200 });
  const [obstacles, setObstacles] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0); // New score state
  const [speed, setSpeed] = useState(2); // Initial obstacle speed
  const gapSize = 150; // Minimum vertical gap of 400px
  const horizontalGap = 200; // Minimum horizontal gap of 400px
  const bgmRef = createRef(null);
  const tapRef = createRef(null);
  const gameoverRef = createRef(null);

  // Reset game on restart
  const resetGame = () => {
    setBirdPosition({ x: 50, y: 200 });
    setObstacles([]);
    setIsGameOver(false);
    setScore(0);
    setSpeed(2); // Reset speed
  };

  // Play background music on mount and loop it
  useEffect(() => {
    if (bgmRef.current && gameStarted) {
      bgmRef.current.play();
    }
    if (gameoverRef.current && isGameOver) {
      gameoverRef.current.currentTime = 0; // Reset playback to start
      gameoverRef.current.play(); // Play from the start
      bgmRef.current.pause(); // Pause background music
    }
  }, [gameStarted, isGameOver]);

  // Handle key press for bird jump, game start, and restart
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === ' ') {
        if (!gameStarted) {
          setGameStarted(true); // Start the game on first spacebar press
        } else if (isGameOver) {
          resetGame(); // Restart the game if it's over
        } else {
          setBirdPosition((prev) => ({ ...prev, y: prev.y - 50 })); // Bird jumps after game starts
          if (tapRef.current) {
            tapRef.current.currentTime = 0; // Reset playback to start
            tapRef.current.play(); // Play from the start
          }
        }
      }
    };

    // handle click event for bird to jump
    const handleClick = () => {
      if (!isGameOver) {
        setBirdPosition((prev) => ({ ...prev, y: prev.y - 50 })); // Bird jumps after game starts
        if (tapRef.current) {
          tapRef.current.currentTime = 0; // Reset playback to start
          tapRef.current.play(); // Play from the start
        }
      }
    };

    document.addEventListener('click', handleClick);

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('click', handleClick);
    };
  }, [gameStarted, isGameOver, tapRef]);

  // Game logic for adding obstacles, updating positions, and scoring
  useEffect(() => {
    if (gameStarted) {
      const addObstaclePair = () => {
        const obstacleHeight =
          Math.floor(Math.random() * (window.innerHeight - gapSize - 100)) +
          100; // Random height, ensuring space for the gap
        const newObstaclePair = {
          x: window.innerWidth + horizontalGap, // Start obstacles at least horizontalGap distance away
          topHeight: obstacleHeight,
          bottomHeight: window.innerHeight - obstacleHeight - gapSize, // Bottom obstacle height ensures a gap of at least 400px
          passed: false, // Track if bird has passed the obstacle
        };
        setObstacles((prev) => [...prev, newObstaclePair]);
      };

      const gameInterval = setInterval(() => {
        // Bird falls by gravity
        setBirdPosition((prev) => ({ ...prev, y: prev.y + 2 }));

        // Move obstacles to the left and update scoring
        setObstacles(
          (prev) =>
            prev
              .map((obs) => {
                const updatedObs = { ...obs, x: obs.x - speed }; // Move obstacles by current speed

                // Update score if bird passes an obstacle and game is not over
                if (!isGameOver && !obs.passed && birdPosition.x > obs.x + 50) {
                  updatedObs.passed = true; // Mark as passed
                  setScore((prevScore) => prevScore + 10); // Add 10 points to score
                }
                return updatedObs;
              })
              .filter((obs) => obs.x > -50) // Remove obstacles that move out of the screen
        );

        // Gradual speed increase at specific score thresholds
        if (score >= 300 && score < 600) {
          setSpeed(2.5); // Slight speed increase
        } else if (score >= 600 && score < 1000) {
          setSpeed(3); // Slight speed increase
        } else if (score >= 1000 && score < 1500) {
          setSpeed(3.5); // Slight speed increase
        } else if (score >= 1500) {
          setSpeed(4); // Speed capped after 1500
        }

        // Add new obstacles occasionally with horizontal gap
        if (
          obstacles.length === 0 ||
          obstacles[obstacles.length - 1].x < window.innerWidth - horizontalGap
        ) {
          addObstaclePair();
        }

        // Game over conditions: bird falls off the screen
        if (birdPosition.y > window.innerHeight || birdPosition.y < 0) {
          setIsGameOver(true);

          clearInterval(gameInterval);
        }

        // Check collision with obstacles
        obstacles.forEach((obs) => {
          if (
            birdPosition.x < obs.x + 50 && // Bird's X position is within obstacle's X range
            birdPosition.x + 50 > obs.x && // Bird's width is considered
            (birdPosition.y < obs.topHeight || // Collides with top obstacle
              birdPosition.y + 50 > window.innerHeight - obs.bottomHeight) // Collides with bottom obstacle
          ) {
            setIsGameOver(true);
            clearInterval(gameInterval);
          }
        });
      }, 20);

      return () => clearInterval(gameInterval);
    }
  }, [gameStarted, birdPosition, obstacles, score, speed, isGameOver]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '30vh',
          // paddingBottom: '56%',
          position: 'relative',
        }}
      >
        <img width='100%' height='100%' src={Clouds} alt='' />
      </div>
      <div
        style={{
          width: '100%',
          // height: '30vh',
          // paddingBottom: '56%',
          position: 'relative',
          backgroundColor: 'red',
        }}
      >
        <img width='100%' height='100%' src={HousesBg} alt='' />
      </div>
      <div style={{ backgroundColor: 'teal', height: '100%' }} />
      <audio ref={bgmRef} src={BGM} loop hidden></audio>
      <audio ref={tapRef} src={Tapped} hidden></audio>
      <audio ref={gameoverRef} src={GameOver} hidden></audio>
      {!gameStarted && !isGameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <h1>Press Spacebar to Start Game</h1>
        </div>
      )}

      {isGameOver && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            zIndex: 1000,
          }}
        >
          <h1>Game Over</h1>
          <h2>Your Score: {score}</h2>
          <h3>Press Spacebar to Restart</h3>
        </div>
      )}

      {!isGameOver ? (
        <>
          <Bird position={birdPosition} />
          {obstacles.map((obs, index) => (
            <React.Fragment key={index}>
              {/* Top Obstacle */}
              <Obstacle position={{ x: obs.x, y: 0 }} height={obs.topHeight} />
              {/* Bottom Obstacle */}
              <Obstacle
                position={{
                  x: obs.x,
                  y: window.innerHeight - obs.bottomHeight,
                }}
                height={obs.bottomHeight}
              />
            </React.Fragment>
          ))}
          {/* Display the score */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              color: 'white',
              fontSize: '24px',
              backgroundColor: 'green',
              borderRadius: '8px',
              padding: '8px',
            }}
          >
            Score: {score}
          </div>
        </>
      ) : (
        <>
          {/* Keep moving obstacles in the background when game is over */}
          {obstacles.map((obs, index) => (
            <React.Fragment key={index}>
              <Obstacle position={{ x: obs.x, y: 0 }} height={obs.topHeight} />
              <Obstacle
                position={{
                  x: obs.x,
                  y: window.innerHeight - obs.bottomHeight,
                }}
                height={obs.bottomHeight}
              />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};

export default Game;

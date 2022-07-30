import React, { useState, useEffect, useCallback } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";

import cupImage from "../assets/cup.png";
import ballImage from "../assets/ball.png";
import "./styles.scss";

const App = () => {
  const initialState = [
    { id: 1, hasBall: false, clicked: false },
    { id: 2, hasBall: true, clicked: false },
    { id: 3, hasBall: false, clicked: false },
  ];
  const [cups, setCups] = useState(initialState);
  const [initAnimation, setInitAnimation] = useState(true);
  const [victory, setVictory] = useState(false);
  const [finished, setFinished] = useState(false);
  const [parent] = useAutoAnimate();

  // Performs 5 consecutive shuffles to increase difficulty
  const multipleShuffles = useCallback(() => {
    let times = 5;
    const interval = setInterval(() => {
      shuffle();
      if (!times--) clearInterval(interval);
    }, 300);
  }, []);

  useEffect(() => {
    let timeout = null;
    if (initAnimation) {
      timeout = setTimeout(() => {
        setInitAnimation(false);
        multipleShuffles();
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [initAnimation, multipleShuffles]);

  const shuffle = () => {
    setCups((prevCups) => {
      const newCups = [...prevCups];
      let currentIndex = newCups.length;
      let temporaryValue, randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = newCups[currentIndex];
        newCups[currentIndex] = newCups[randomIndex];
        newCups[randomIndex] = temporaryValue;
      }

      return newCups;
    });
  };

  const reset = () => {
    setCups(initialState);
    setFinished(false);
    setVictory(false);
    setInitAnimation(true);
  };

  const handleCupClick = (cupId) => (event) => {
    const updatedCups = cups.map((cup) => {
      if (cup.id === cupId) {
        cup.clicked = true;
        if (!finished && cup.hasBall) {
          setVictory(true);
        }
      }
      return cup;
    });

    setCups(updatedCups);
    if (!finished) setFinished(true);
  };

  return (
    <div className="root">
      <header className="header">
        <div ref={parent} className="container">
          {cups.map((cup, cupIndex) => (
            <div className="cup" key={`cup${cup.id}`}>
              <img
                src={cupImage}
                className={clsx("cup-image", {
                  clicked: cup.clicked,
                  animated: cup.hasBall && initAnimation,
                })}
                alt="cup"
                onClick={handleCupClick(cup.id)}
              />
              {cup.hasBall && (
                <img src={ballImage} className="ball-image" alt="ball" />
              )}
            </div>
          ))}
        </div>

        <div className={clsx("result", { success: victory })}>
          {finished ? `You've ${victory ? "won" : "lost"}!` : ""}
        </div>

        <div className="actions">
          <button
            className={clsx("btn shuffle-btn", { disabled: finished })}
            onClick={multipleShuffles}
          >
            Shuffle
          </button>
          <button
            className={clsx("btn reset-btn", { disabled: !finished })}
            onClick={reset}
          >
            Reset
          </button>
        </div>
      </header>
    </div>
  );
};

export default App;

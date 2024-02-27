/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import Background from "./Background";
import { FaBrain } from "react-icons/fa";
import { PiClockCountdownFill } from "react-icons/pi";
import Tippy from "@tippyjs/react";
import { AiFillSound } from "react-icons/ai";
//
import { useTimer } from "react-timer-hook";
//sounds
import useSound from "use-sound";
import hintSfx from "./assets/short-success-sound-glockenspiel-treasure-video-game-6346.mp3";
import matchedStfx from "./assets/announcement-sound-4-21464.mp3";
import gitMem from "../src/assets/brain.gif";
import clkSfx from "./assets/mouse-click-153941.mp3";
import ThemeSwitcher from "./ThemeSwitcher";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  const [gameMode, setGameMode] = useState("normal");
  const [clickSound] = useSound(clkSfx, {
    volume: "0.15",
  });

  const handleGameMode = (mode) => {
    setGameMode(mode);
    localStorage.setItem("game", mode);
    clickSound();
  };

  useEffect(() => {
    const cm = localStorage.getItem("game");
    if (!cm) return;
    setGameMode(cm);
  }, []);

  return (
    <div className="relative h-screen bg-pink-500 dark:bg-gray-800">
      <div className="absolute w-full flex items-center justify-center py-2 z-10">
        <ThemeSwitcher />
      </div>
      <Background />
      <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
        <div className="relative bg-pink-50 flex flex-col items-center justify-center gap-[20px] py-12 px-10 rounded-md animate-fade-right dark:bg-gray-300/[0.05]">
          <div className="px-2 absolute top-[-20px] border shadow-xl rounded-full bg-pink-500 animate-fade-down animate-delay-100">
            <h1 className="font-bold text-[24px] text-pink-500 text-white">
              Memory
            </h1>
          </div>

          <p className="font-medium text-sm text-pink-500">
            Flip over tiles looking for pairs
          </p>

          <div className="flex w-full h-fit flex items-center justify-evenly">
            <Tippy content="Normal Mode">
              <button
                onClick={() => handleGameMode("normal")}
                className={`${
                  gameMode === "normal" ? "text-pink-500" : "text-gray-400"
                } w-12 h-12 flex items-center justify-center  text-[40px] animate-fade-right`}
              >
                <FaBrain />
              </button>
            </Tippy>
            <div className="h-full min-h-[1em] w-px self-stretch bg-[#eee] dark:bg-[#555]" />
            <Tippy content="Timer Mode">
              <button
                onClick={() => handleGameMode("timer")}
                className={`${
                  gameMode === "timer" ? "text-pink-500" : "text-gray-400"
                } w-12 h-12 flex items-center justify-center  text-[40px] animate-fade-right`}
              >
                <PiClockCountdownFill />
              </button>
            </Tippy>
          </div>

          <button
            onClick={() => {
              start();
              clickSound();
            }}
            className="text-white p-3 cursor-pointer bg-pink-500 py-[6px] px-10 mt-[14px] rounded-full bg-gradient-to-b from-pink-400 to-pink-600 shadow-xl hover:scale-105 transition-all animate-fade-up"
          >
            Play
          </button>
          <img
            src={gitMem}
            alt="memory-animation"
            className="absolute right-[-40px] bottom-[-40px]"
          />
        </div>
      </div>
    </div>
  );
}

export function PlayScreen({ end, hasSound, toggleSound }) {
  const time = new Date();
  const expiryTimestamp1Minute = new Date(time.getTime() + 1 * 60000);
  const gameMode = localStorage.getItem("game");
  const endGame = () => {
    if (gameMode === "normal") return;
    setTimeout(end, 0);
  };

  const { seconds, minutes } = useTimer({
    expiryTimestamp: expiryTimestamp1Minute,
    onExpire: endGame,
  });

  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const [score, setScore] = useState(null);
  const [hint, setHint] = useState(null);
  const [showHint, setShowHint] = useState(false);

  const [randNum, setRandNum] = useState(null);
  const [hintSound, { stop: hintSoundStop }] = useSound(hintSfx, {
    volume: "0.25",
  });

  const [cheer, { stop: cheerSoundStop }] = useSound(matchedStfx, {
    volume: "0.25",
  });

  const [clickSound] = useSound(clkSfx, {
    volume: "0.15",
  });

  useEffect(() => {
    const generateRandIndex = () => {
      if (!tiles || tiles.length === 0) return null;

      const notFlippedIndices = tiles.reduce((acc, tile, index) => {
        if (tile.state !== "flipped" && tile.state !== "matched") {
          acc.push(index);
        }
        return acc;
      }, []);

      if (notFlippedIndices.length === 0) return null;

      let randomIndex = Math.floor(Math.random() * notFlippedIndices.length);
      return notFlippedIndices[randomIndex];
    };

    let randomNumber = generateRandIndex();
    setRandNum(randomNumber);
  }, [tiles]);

  // useEffect to update hintIndex based on flipped tiles
  useEffect(() => {
    const getHint = () => {
      // Return if tiles are not yet initialized
      if (tiles === null) return;

      // Return if show hint is disabled
      if (!showHint) return;

      // Filter tiles based on their state
      const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
      const notFlippedTiles = tiles.filter(
        (tile) => tile.state !== "flipped" && tile.state !== "matched"
      );

      // Count the number of flipped tiles
      const flippedCount = flippedTiles.length;

      let hintIndex = null; // Initialize hintIndex to null

      // If only one tile is flipped
      if (flippedCount === 1) {
        hasSound ? hintSound() : hintSoundStop();

        // Find the index of the unflipped tile matching the flipped one
        const idx = notFlippedTiles.findIndex(
          (tile) => tile.content === flippedTiles[0].content
        );

        // Find the index of the unflipped tile within the rendered tiles
        const txl = tiles.findIndex(
          (tile) =>
            tile.content === notFlippedTiles[idx].content &&
            tile.state !== "flipped" &&
            tile.state !== "matched"
        );

        // Update hintIndex if unflipped tile found
        if (txl !== -1) {
          hintIndex = txl;
        }
      }

      // Update the hint state
      setHint(() => {
        return hintIndex;
      });
    };

    // Call getHint on mount and whenever hint or tiles change
    getHint();
  }, [hasSound, hint, hintSound, hintSoundStop, setHint, showHint, tiles]);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        hasSound ? cheer() : cheerSoundStop();
        newState = "matched";
        //
        setScore((prev) => {
          return prev + 2;
        });

        //
        setShowHint(false);
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setShowHint(false);
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-indigo-200 dark:bg-gray-800">
      <div className="absolute top-0 w-full h-[60px] flex items-center justify-between px-10">
        {localStorage.getItem("game") === "timer" && (
          <div className="flex bg-indigo-50 px-2 py-1 rounded-md gap-2 right-auto">
            <span className="p-1 flex items-center justify-center bg-indigo-200 w-6 h-6 rounded-md text-indigo-500 text-sm">
              {minutes}
            </span>
            :
            <span className="p-1 flex items-center justify-center bg-indigo-200 w-6 h-6 rounded-md text-indigo-500 text-sm">
              {seconds}
            </span>
          </div>
        )}
      </div>

      <Background />

      <div className="flex items-center justify-center z-10 gap-10 mb-4">
        <div className="flex items-center justify-center gap-2 text-indigo-500 bg-indigo-50 rounded-md p-1 dark:bg-gray-100/[0.05] dark:text-white">
          <span>Tries</span>
          <span className="py-0 px-2 bg-indigo-200 rounded-md">
            {tryCount}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-indigo-500 dark:text-white bg-indigo-50 rounded-md p-1 dark:bg-gray-100/[0.05]">
          <span>Score</span>
          <span className="py-0 px-2 bg-indigo-200 rounded-md ">
            {score === null ? 0 : score}
          </span>
        </div>
      </div>
      <div className="bg-indigo-50 p-3 rounded-md z-10 animate-fade-left dark:bg-gray-100/[0.05]">
        <div className="grid grid-cols-4 grid-rows-4 gap-3">
          {getTiles(16).map((tile, i) => (
            <Tile
              key={i}
              color={
                showHint && hint !== null && (i === hint || i === randNum)
                  ? "bg-green-500"
                  : null
              }
              flip={() => flip(i)}
              hasSound={hasSound}
              {...tile}
            />
          ))}
        </div>
      </div>
      <div className="flex w-fit gap-4 h-fit flex items-center justify-evenly mt-10">
        <Tippy content="No Booster">
          <button
            onClick={() => {
              setShowHint(false);
              clickSound();
            }}
            className={`${
              !showHint || showHint === false
                ? "text-indigo-500 "
                : "text-gray-400 dark:text-white"
            } w-12 h-12 flex items-center justify-center text-[40px] animate-fade-right`}
          >
            <FaBrain />
          </button>
        </Tippy>
        <div className="h-full min-h-[1em] w-px self-stretch bg-[#eee]" />
        <Tippy content="Hint Booster">
          <button
            onClick={() => {
              setShowHint(true);
              clickSound();
            }}
            className={`${
              showHint && showHint === true
                ? "text-indigo-500 "
                : "text-gray-400 dark:text-white"
            } w-12 h-12 flex items-center justify-center text-[40px] animate-fade-left`}
          >
            <PiClockCountdownFill />
          </button>
        </Tippy>
        <div className="h-full min-h-[1em] w-px self-stretch bg-[#eee]" />
        <Tippy content={hasSound ? "Sound Off" : "Sound On"}>
          <button
            onClick={() => {
              toggleSound();
              clickSound();
            }}
            className={`${
              hasSound && hasSound === true
                ? "text-indigo-500 "
                : "text-gray-400 dark:text-white"
            } w-12 h-12 flex items-center justify-center text-[40px] animate-fade-left`}
          >
            <AiFillSound />
          </button>
        </Tippy>
      </div>
    </div>
  );
}

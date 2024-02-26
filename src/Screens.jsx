/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";
import Background from "./Background";
import { FaBrain } from "react-icons/fa";
import { PiClockCountdownFill } from "react-icons/pi";
import Tippy from "@tippyjs/react";

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
  return (
    <div className="relative h-screen bg-pink-500">
      <Background />
      <div className="w-full h-screen flex flex-col items-center justify-center gap-2">
        <div className="relative bg-pink-50 flex flex-col items-center justify-center gap-[20px] py-12 px-10 rounded-md animate-fade-right">
          <div className="px-2 absolute top-[-20px] border shadow-xl rounded-full bg-pink-500 animate-fade-down animate-delay-100">
            <h1 className="font-bold text-[24px] text-pink-500 text-white">
              Memory
            </h1>
          </div>

          <p className="font-medium text-sm text-pink-500">
            Flip over tiles looking for pairs
          </p>

          <div className="flex w-full h-fit flex items-center justify-evenly">
            <button className="w-12 h-12 flex items-center justify-center text-gray-400 text-[40px] animate-fade-right">
              <FaBrain />
            </button>
            <div className="h-full min-h-[1em] w-px self-stretch bg-[#eee]" />
            <button className="w-12 h-12 flex items-center justify-center text-gray-400 text-[40px] animate-fade-left">
              <PiClockCountdownFill />
            </button>
          </div>

          <button
            onClick={start}
            className="text-white p-3 cursor-pointer bg-pink-500 py-[6px] px-10 mt-[14px] rounded-full bg-gradient-to-b from-pink-400 to-pink-600 shadow-xl hover:scale-105 transition-all animate-fade-up"
          >
            Play
          </button>
        </div>
      </div>
    </div>
  );
}

export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const [score, setScore] = useState(null);
  const [hint, setHint] = useState(null);
  const [showHint, setShowHint] = useState(null);

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
      setHint(hintIndex);
    };

    // Call getHint on mount and whenever hint or tiles change
    getHint();
  }, [hint, setHint, showHint, tiles]);

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
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-indigo-200">
      <Background />
      <div className="flex h-fit gap-10 items-center jusify-start z-10">
        <div className="flex items-center justify-center gap-2 mb-5 text-indigo-500 bg-indigo-50 rounded-md p-1">
          <span>Tries</span>
          <span className="py-0 px-2 bg-indigo-200 rounded-md">{tryCount}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-5 text-indigo-500 bg-indigo-50 rounded-md p-1">
          <span>Score</span>
          <span className="py-0 px-2 bg-indigo-200 rounded-md">
            {score === null ? 0 : score}
          </span>
        </div>
      </div>
      <div className="bg-indigo-50 p-3 rounded-md z-10 animate-fade-left">
        <div className="grid grid-cols-4 grid-rows-4 gap-3">
          {getTiles(16).map((tile, i) => (
            <Tile
              key={i}
              color={i === hint ? "bg-green-500" : null}
              flip={() => flip(i)}
              {...tile}
            />
          ))}
        </div>
      </div>
      <div className="flex w-fit gap-4 h-fit flex items-center justify-evenly mt-6">
      <Tippy content="No Booster">
      <button
          onClick={() => setShowHint(false)}
          className={`${
            !showHint || showHint === false
              ? "text-indigo-500 "
              : "text-gray-400 "
          } w-12 h-12 flex items-center justify-center text-[40px] animate-fade-right`}
        >
          <FaBrain />
        </button>
      </Tippy>
        <div className="h-full min-h-[1em] w-px self-stretch bg-[#eee]" />
       <Tippy content="Hint Booster">
       <button
          onClick={() => setShowHint(true)}
          className={`${
            showHint && showHint === true
              ? "text-indigo-500 "
              : "text-gray-400 "
          } w-12 h-12 flex items-center justify-center text-[40px] animate-fade-left`}
        >
          <PiClockCountdownFill />
        </button>
       </Tippy>
      </div>
    </div>
  );
}

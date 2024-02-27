import { useState, useEffect } from "react";
import { StartScreen, PlayScreen } from "./Screens";
import useSound from "use-sound";
import bgSfx from "./assets/uplifting-pad-texture-113842.mp3"

function App() {
  const [gameState, setGameState] = useState("start");
  const [hasSound, setSound] = useState(true);

  const [backgroundMusic, { pause: pauseBackgroundMusic  }] = useSound(bgSfx, {
    volume: "0.10",
  });

  useEffect(() => {
    backgroundMusic({forceSoundEnabled: false})
  }, [backgroundMusic])
  

  const toggleSound = () => {
    setSound(!hasSound)
    pauseBackgroundMusic()
  }
  

  switch (gameState) {
    case "start":
      return <StartScreen start={() => setGameState("play")} />;
    case "play":
      return <PlayScreen end={() => setGameState("start")} hasSound={hasSound} toggleSound={toggleSound} />;
    default:
      throw new Error("Invalid game state " + gameState);
  }
}

export default App;

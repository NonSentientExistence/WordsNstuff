import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGame, submitWord } from "../api";
import { getPlayerToken } from "../playerToken";
import PlayerHealthIcon from "../components/PlayerHealthIcon";
import "../components/Game.css";

interface GameState {
  status: string;
  pool: string[];
  player1Hp: number;
  player2Hp: number;
  player1Id: string;
  player2Id: string;
}

interface GameProps {
  onEnd?: () => void;
}

export default function Game({ onEnd }: GameProps) {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<GameState | null>(null);
  const [word, setWord] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Poll game state every second, reset submitted state when a new round starts
  useEffect(() => {
    intervalRef.current = setInterval(async () => {
      if (!code) return;
      const data = await getGame(code);
      if (!data) return;

      // Reset submitted when HP changes
      setGame((prev) => {
        if (
          prev &&
          (prev.player1Hp !== data.player1Hp ||
            prev.player2Hp !== data.player2Hp)
        ) {
          setSubmitted(false);
        }
        return data;
      });

      if (data.status === "Finished") {
        clearInterval(intervalRef.current!);
        onEnd?.();
      }
    }, 1000);

    return () => clearInterval(intervalRef.current!);
  }, [code, navigate]);

  const handleSubmit = async () => {
    if (!code || !word.trim() || submitted) return;

    const success = await submitWord(code, word.trim());
    if (success) {
      setSubmitted(true);
      setMessage("Word submitted! Waiting for opponent...");
      setWord("");
    } else {
      setMessage("Invalid word, try again!");
    }
  };

  if (!game) return <p>Loading game...</p>;

  const token = getPlayerToken();
  const myHp = game.player1Id === token ? game.player1Hp : game.player2Hp;
  const opponentHp = game.player1Id === token ? game.player2Hp : game.player1Hp;

  return (
    <div>
      <h1>WordsNstuff</h1>

      <div className="health-display">
        <div className="player-section">
          <h2>Du</h2>
          <PlayerHealthIcon hp={myHp} maxHp={100} size={80} showLabel={true} />
          <p>HP: {myHp}</p>
        </div>

        <div className="player-section">
          <h2>Opponent</h2>
          <PlayerHealthIcon
            hp={opponentHp}
            maxHp={100}
            size={80}
            showLabel={true}
          />
          <p>HP: {opponentHp}</p>
        </div>
      </div>

      {/* Letter pool */}
      <div>
        <h2>Letter Pool</h2>
        <div>
          {game.pool.map((letter, index) => (
            <span
              key={index}
              style={{
                margin: "4px",
                padding: "8px",
                border: "1px solid black",
              }}
            >
              {letter}
            </span>
          ))}
        </div>
      </div>

      {/* Word input */}
      <div>
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value.toUpperCase())}
          disabled={submitted}
          placeholder="Type your word..."
        />
        <button onClick={handleSubmit} disabled={submitted}>
          {submitted ? "Waiting..." : "Submit Word"}
        </button>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
}

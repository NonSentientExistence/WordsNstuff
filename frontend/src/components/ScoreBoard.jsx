import React from 'react';
import './ScoreBoard.css';

export default function ScoreBoard({
  player1Name,
  player1Score,
  player1Accepts,
  player1Disputes,
  player2Name,
  player2Score,
  player2Accepts,
  player2Disputes,
}) {
  return (
    <div className="scoreboard" data-testid="scoreboard">
      <div className="score-item" data-testid="score-player-1">
        <div className="player-name">{player1Name}</div>
        <div className="score" data-testid="score-player-1-value">{player1Score}</div>
        <div className="actions">
          <span data-testid="score-player-1-accepts" title="Accepts remaining">✓ {player1Accepts}</span>
          <span data-testid="score-player-1-disputes" title="Disputes remaining">✗ {player1Disputes}</span>
        </div>
      </div>

      <div className="score-item" data-testid="score-player-2">
        <div className="player-name">{player2Name}</div>
        <div className="score" data-testid="score-player-2-value">{player2Score}</div>
        <div className="actions">
          <span data-testid="score-player-2-accepts" title="Accepts remaining">✓ {player2Accepts}</span>
          <span data-testid="score-player-2-disputes" title="Disputes remaining">✗ {player2Disputes}</span>
        </div>
      </div>
    </div>
  );
}

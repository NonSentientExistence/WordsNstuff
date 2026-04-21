import { useEffect, useRef, useState } from "react";
import "./PlayerHealthIcon.css";

interface PlayerHealthIconProps {
  hp: number;
  maxHp?: number;
  size?: number;
  showLabel?: boolean;
  onDamageTaken?: () => void;
}

export default function PlayerHealthIcon({
  hp,
  maxHp = 100,
  size = 64,
  showLabel = false,
  onDamageTaken,
}: PlayerHealthIconProps) {
  const previousHpRef = useRef(hp);
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  // Detektera skada och triggera callback + animation
  useEffect(() => {
    if (previousHpRef.current > hp) {
      if (onDamageTaken) onDamageTaken();
      setTriggerAnimation(true);
      const timer = setTimeout(() => setTriggerAnimation(false), 400);
      return () => clearTimeout(timer);
    }
    previousHpRef.current = hp;
  }, [hp, onDamageTaken]);

  const healthPercent = Math.max(0, Math.min(1, hp / maxHp));

  const status =
    healthPercent > 0.6
      ? "healthy"
      : healthPercent > 0.3
        ? "damaged"
        : healthPercent > 0
          ? "critical"
          : "defeated";

  const segmentCount = 6;
  const activeSegments = Math.ceil(healthPercent * segmentCount);

  return (
    <div
      className="player-health-icon"
      style={{ "--size": `${size}px` } as any}
    >
      <div
        className={`head-container status-${status} ${triggerAnimation ? "damage-animation" : ""}`}
      >
        <div className="head">
          <div className="face" />

          <div className={`eye left ${healthPercent < 0.3 ? "x-eye" : ""}`} />
          <div className={`eye right ${healthPercent < 0.3 ? "x-eye" : ""}`} />

          <div className={`mouth ${healthPercent < 0.5 ? "sad" : ""}`} />

          {status === "critical" && (
            <>
              <div className="blood-overlay" />
              <div className="crack-overlay crack-1" />
              <div className="crack-overlay crack-2" />
            </>
          )}

          {status === "defeated" && (
            <>
              <div className="crack-overlay crack-1" />
              <div className="crack-overlay crack-2" />
              <div className="crack-overlay crack-3" />
              <div className="crack-overlay crack-4" />
            </>
          )}
        </div>

        {status === "damaged" && <div className="bandage bandage-head" />}
      </div>

      <div className="health-segments">
        {Array.from({ length: segmentCount }).map((_, i) => (
          <div
            key={i}
            className={`segment ${i < activeSegments ? "active" : "broken"}`}
            style={{
              animationDelay: `${i * 0.08}s`,
            }}
          />
        ))}
      </div>

      {showLabel && (
        <div className={`health-label status-${status}`}>
          {Math.round(healthPercent * 100)}%
        </div>
      )}
    </div>
  );
}

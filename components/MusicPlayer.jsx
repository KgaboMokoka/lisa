import { useEffect, useState } from "react";

export default function MusicPlayer({ audioRef, playing, setPlaying }) {
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      if (!audio) return;
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };

    audio?.addEventListener("timeupdate", updateProgress);

    return () => {
      audio?.removeEventListener("timeupdate", updateProgress);
    };
  }, [audioRef]);

  return (
    <div className={`player ${playing ? "playing" : ""}`}>
      <div className="player-content">
        <div className="song-info">
          <p className="song-title">Coffee Bean</p>
          <p className="song-artist">Travis Scott</p>
        </div>

        <input
          type="range"
          value={progress}
          readOnly
          className="progress-bar"
        />

        <button className="play-btn" onClick={togglePlay}>
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
    </div>
  );
}
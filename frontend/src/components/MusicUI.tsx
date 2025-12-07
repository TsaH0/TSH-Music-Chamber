import {
  useState,
  useRef,
  ChangeEvent,
  MouseEvent,
  KeyboardEvent,
} from "react";

interface SongResult {
  status: string;
  title: string;
  audio_url: string;
}

export default function MusicUI() {
  const [song, setSong] = useState<string>("");
  const [result, setResult] = useState<SongResult | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const api = "http://localhost:8080/download";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleChange = (val: string) => {
    setSong(val);
  };

  // Handles both Button Click and Enter Key press
  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!song) return;

    try {
      const reqBody = { query: song };
      const req = await fetch(api, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      const resp: SongResult = await req.json();
      setResult(resp);
      setIsPlaying(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-2 sm:p-4 lg:p-6">
      <div className="w-full max-w-[1600px] bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-purple-900/50 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-12 shadow-2xl shadow-purple-900/20">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12 pb-4 sm:pb-6 border-b border-purple-900/30">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent tracking-widest uppercase">
            TSH Music Chamber
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
          {/* Left Panel - Album Art & Controls */}
          <div className="w-full lg:w-5/12 flex flex-col gap-4 sm:gap-6">
            {/* Album Art */}
            <div className="aspect-square bg-linear-to-br from-purple-900/30 via-black to-purple-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-purple-800/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-tr from-purple-500/10 via-transparent to-purple-600/10"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-400 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 relative z-10"
              >
                <path d="M9 18V5l12-2v13"></path>
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="18" cy="16" r="3"></circle>
              </svg>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8">
              <button className="text-purple-400 hover:text-purple-300 transition p-2 sm:p-3 rounded-full border border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                >
                  <polygon points="19 20 9 12 19 4 19 20"></polygon>
                  <line x1="5" y1="19" x2="5" y2="5"></line>
                </svg>
              </button>

              <button
                onClick={togglePlay}
                disabled={!result?.audio_url}
                className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white p-4 sm:p-5 lg:p-6 rounded-full shadow-lg shadow-purple-600/30 transform active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  >
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 sm:w-8 sm:h-8"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </button>

              <button className="text-purple-400 hover:text-purple-300 transition p-2 sm:p-3 rounded-full border border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7"
                >
                  <polygon points="5 4 15 12 5 20 5 4"></polygon>
                  <line x1="19" y1="5" x2="19" y2="19"></line>
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 sm:gap-4 text-purple-400 px-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 flex-shrink-0"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-linear-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30"
              />
            </div>
          </div>

          {/* Right Panel - Now Playing & Controls */}
          <div className="w-full lg:w-7/12 flex flex-col justify-between gap-6 lg:gap-8">
            {/* Now Playing */}
            <div>
              <h3 className="text-purple-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-2">
                Now Playing
              </h3>
              <h2 className="text-white text-2xl sm:text-3xl lg:text-5xl font-light overflow-hidden text-ellipsis leading-tight">
                {result ? result.title : "No song playing"}
              </h2>
            </div>

            {/* Progress Bar */}
            <div className="w-full">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 sm:h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-linear-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-purple-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-purple-500/30 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-125"
                style={{
                  background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, #27272a ${
                    duration ? (currentTime / duration) * 100 : 0
                  }%, #27272a 100%)`,
                }}
              />
              <div className="flex justify-between text-xs sm:text-sm text-zinc-500 mt-2 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Add Song Section */}
            <div className="mt-auto pt-4 sm:pt-6 border-t border-purple-900/30">
              <h3 className="text-purple-400 text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 sm:mb-4">
                Add Song to Queue
              </h3>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Enter song name..."
                  value={song}
                  className="flex-1 bg-zinc-900 border border-purple-900/50 text-white placeholder-zinc-600 px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition text-sm sm:text-base lg:text-lg"
                  onChange={(e) => handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                />
                <button
                  onClick={handleSubmit}
                  className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl shadow-lg shadow-purple-600/30 transform active:scale-95 transition text-sm sm:text-base lg:text-lg tracking-wide"
                >
                  Add Song
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Audio Element */}
        {result?.audio_url && (
          <audio
            ref={audioRef}
            src={result.audio_url}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          />
        )}
      </div>
    </div>
  );
}

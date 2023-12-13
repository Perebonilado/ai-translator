import React, { FC, useEffect, useRef } from "react";
import PauseIcon from "../icons/PauseIcon";
import PlayIcon from "../icons/PlayIcon";
import Button from "./Button";

interface Props {
  isPlaying: boolean;
  handlePlay: () => void;
  handlePause: () => void;
  timeElapsedPercentage: number
}

const AudioPlayer: FC<Props> = ({
  isPlaying,
  handlePause,
  handlePlay,
  timeElapsedPercentage
}) => {

  return (
    <div className="flex items-center gap-1">
      {isPlaying ? (
        <Button
          title=""
          startIcon={<PauseIcon />}
          className="!bg-transparent !p-0"
          onClick={handlePause}
        />
      ) : (
        <Button
          title=""
          startIcon={<PlayIcon />}
          className="!bg-transparent !p-0"
          onClick={handlePlay}
        />
      )}

      <div className="w-[180px] h-[4px] rounded-full bg-gray-400 relative overflow-hidden">
        <div
          className={`bg-blue-600 h-full absolute top-0 left-0 rounded-full transition-[width] duration-[0.03] ease-linear`}
          style={{width: `${timeElapsedPercentage}%`}}
        ></div>
      </div>
    </div>
  );
};

export default AudioPlayer;

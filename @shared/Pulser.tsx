import React, { FC } from "react";

import cn from "classnames";

interface Props {
  isRecording?: boolean;
}

const Pulser: FC<Props> = ({ isRecording = false }) => {
  const recStyles = cn({
    "animate-pulse": isRecording,
  });
  return (
    <div
      className={`w-[30px] h-[30px] bg-red-700 rounded-full ${recStyles}`}
    ></div>
  );
};

export default Pulser;

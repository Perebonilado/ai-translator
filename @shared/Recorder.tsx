import React, { ElementRef, FC, useEffect, useRef, useState } from "react";
import Button from "./Button";
import Container from "./Container";
import Pulser from "./Pulser";
import AudioPlayer from "./AudioPlayer";

const Recorder: FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const recordingInterval = useRef<NodeJS.Timeout | undefined>();
  const audioPlayingInterval = useRef<NodeJS.Timeout | undefined>();
  const [recordTimeSec, setRecordTimeSec] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeElapsedPercentage, setTimeElapsedPercentage] = useState(0);

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current?.stop();
    mediaRecorder.current?.stream
      .getAudioTracks()
      .forEach((track) => track.stop());

    if (mediaRecorder.current) {
      mediaRecorder.current.onstop = (e) => {
        if (chunks) {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);

          if (audioRef.current) {
            audioRef.current.src = audioURL;
          }
        }
      };
    }
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioPlayingInterval.current = setInterval(() => {
        if (audioRef.current) {
          const currentTime = audioRef.current.currentTime || 0;
          const duration = audioRef.current.duration || 0;
          const timeElapsed = currentTime / duration;
          setTimeElapsedPercentage(timeElapsed * 100);

          if (audioRef.current.ended) {
            setIsPlaying(false);
          }
        }
      }, 100);
    } else {
      if (audioPlayingInterval.current)
        clearInterval(audioPlayingInterval.current);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isRecording) {
      clearInterval(recordingInterval.current);
    } else {
      recordingInterval.current = setInterval(() => {
        setRecordTimeSec((recordTime) => recordTime + 1);
      }, 1000);
    }
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      if (navigator.mediaDevices) {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const mediaRecorder_ = new MediaRecorder(audioStream);

        mediaRecorder.current = mediaRecorder_;

        setRecordTimeSec(0);
        setIsRecording(true);
        mediaRecorder.current.start();

        mediaRecorder.current.onstart = (e) => {};

        const localChunks: Blob[] = [];

        mediaRecorder.current.ondataavailable = (e) => {
          localChunks.push(e.data);
        };

        setChunks(localChunks);
      }
    } catch (error) {
      console.error(error);
      alert("Your device does not support audio recording");
    }
  };

  const handleFormatRecordTime = () => {
    const minutes = Math.floor(recordTimeSec / 60);
    const seconds = recordTimeSec % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlay = () => {
    setIsPlaying(true);
    audioRef.current?.play();
  };
  const handlePause = () => {
    setIsPlaying(false);
    audioRef.current?.pause();
  };

  return (
    <Container>
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-[500px] bg-gray-300 px-6 py-10 flex flex-col items-center justify-center gap-6 rounded-xl">
          <p className="text-center font-bold text-xl text-gray-950">
            {handleFormatRecordTime()}
          </p>
          {isRecording && <Pulser isRecording={isRecording} />}
          {<audio ref={audioRef} controls className="hidden"></audio>}
          {!isRecording && (
            <AudioPlayer
              isPlaying={isPlaying}
              handlePlay={handlePlay}
              handlePause={handlePause}
              timeElapsedPercentage={timeElapsedPercentage}
            />
          )}
          {isRecording ? (
            <Button
              title="Stop Recording"
              color="secondary"
              onClick={handleStopRecording}
            />
          ) : (
            <Button title="Start Recording" onClick={handleStartRecording} />
          )}
        </div>
      </div>
    </Container>
  );
};

export default Recorder;

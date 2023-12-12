import React, { ElementRef, FC, useEffect, useRef, useState } from "react";
import Button from "./Button";
import Container from "./Container";
import Pulser from "./Pulser";

const Recorder: FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [chunks, setChunks] = useState<Blob[]>([]);
  const audioRef = useRef<ElementRef<"audio">>(null);
  const timeInterval = useRef<NodeJS.Timeout | undefined>()
  const [recordTimeSec, setRecordTimeSec] = useState(0);

  const handleStopRecording = () => {
    setIsRecording(false);
    mediaRecorder.current?.stop();

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
    if (!isRecording) {
      clearInterval(timeInterval.current);
    } else {
      timeInterval.current = setInterval(() => {
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

        setRecordTimeSec(0)
        setIsRecording(true);
        mediaRecorder.current.start();

        mediaRecorder.current.onstart = (e) => {
        };

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

  return (
    <Container>
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-[500px] bg-gray-300 px-6 py-10 flex flex-col items-center justify-center gap-6 rounded-xl">
          <p className="text-center font-bold text-xl text-gray-950">
            {handleFormatRecordTime()}
          </p>
          {isRecording && <Pulser isRecording={isRecording} />}
          {!isRecording && <audio ref={audioRef} controls></audio>}
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

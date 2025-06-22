import React, { useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (file: Blob) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('Не удалось получить доступ к камере');
      }
    })();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
    // eslint-disable-next-line
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          setCaptured(true);
          onCapture(blob);
        }
      }, 'image/jpeg');
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col items-center space-y-4">
      {!captured && (
        <>
          <video ref={videoRef} autoPlay playsInline className="rounded-lg border w-full max-w-xs" />
          <button onClick={handleCapture} className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-2">Сделать фото</button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default CameraCapture; 

import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, X, Check, RotateCcw } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onPhotoTaken: (photoUrl: string) => void;
  onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onPhotoTaken, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cameraStarted, setCameraStarted] = useState(false);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      
      setStream(mediaStream);
      setCameraStarted(true);
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      toast({
        title: "Ошибка камеры",
        description: "Не удалось получить доступ к камере. Проверьте разрешения.",
        variant: "destructive"
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhoto(photoDataUrl);
      }
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  const uploadPhoto = async () => {
    if (!capturedPhoto) return;

    setUploading(true);
    
    try {
      // Конвертируем data URL в blob
      const response = await fetch(capturedPhoto);
      const blob = await response.blob();
      
      // Создаем уникальное имя файла
      const fileName = `quiz-photo-${Date.now()}.jpg`;
      
      // Загружаем в Supabase Storage
      const { data, error } = await supabase.storage
        .from('quiz-photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg'
        });

      if (error) {
        console.error('Ошибка загрузки фото:', error);
        toast({
          title: "Ошибка загрузки",
          description: `Не удалось загрузить фото: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('quiz-photos')
        .getPublicUrl(fileName);

      onPhotoTaken(urlData.publicUrl);
      stopCamera();
      onClose();
      
      toast({
        title: "Фото сохранено",
        description: "Ваше фото успешно добавлено к результатам викторины!",
      });
    } catch (error) {
      console.error('Ошибка при загрузке фото:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при сохранении фото",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Сделать фото
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cameraStarted ? (
            <div className="text-center py-8">
              <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">
                Нажмите кнопку ниже, чтобы запустить камеру и сделать фото
              </p>
              <Button onClick={startCamera} className="bg-blue-600 hover:bg-blue-700">
                <Camera className="h-4 w-4 mr-2" />
                Запустить камеру
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {!capturedPhoto ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-80 object-cover rounded-lg bg-gray-900"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Button
                      onClick={capturePhoto}
                      size="lg"
                      className="rounded-full w-16 h-16 bg-white hover:bg-gray-100 text-blue-600"
                    >
                      <Camera className="h-8 w-8" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <img
                    src={capturedPhoto}
                    alt="Captured"
                    className="w-full h-80 object-cover rounded-lg"
                  />
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={retakePhoto}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Переснять
                    </Button>
                    <Button
                      onClick={uploadPhoto}
                      disabled={uploading}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      {uploading ? 'Сохранение...' : 'Сохранить фото'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <canvas ref={canvasRef} className="hidden" />
        </CardContent>
      </Card>
    </div>
  );
};

export default CameraCapture;

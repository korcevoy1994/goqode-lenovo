import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import CameraCapture from "@/components/ui/CameraCapture";

const questions = [
  {
    id: 1,
    question: "В каком году была основана компания Lenovo?",
    options: ["1980", "1984", "1990", "1995"],
    correctAnswer: 1, // index 1 = "1984"
    explanation: "Компания Lenovo была основана в 1984 году"
  },
  {
    id: 2,
    question: "Как называется платформа Lenovo для edge-компьютинга с поддержкой ИИ?",
    options: ["ThinkAI", "Lenovo Edge", "ThinkEdge", "SmartCompute"],
    correctAnswer: 2,
    explanation: "ThinkEdge - это платформа Lenovo для граничных вычислений с поддержкой ИИ"
  },
  {
    id: 3,
    question: "В скольких странах работает Lenovo по всему миру?",
    options: ["60", "100", "160", "200"],
    correctAnswer: 2,
    explanation: "Lenovo работает в 160 странах по всему миру"
  },
  {
    id: 4,
    question: "Как звучит видение Lenovo по развитию технологий?",
    options: ["Умные технологии для всех", "Инновации для будущего", "Сила прогресса", "Технологии для жизни"],
    correctAnswer: 0,
    explanation: "Видение Lenovo: 'Умные технологии для всех'"
  },
  {
    id: 5,
    question: "На защиту чего направлена платформа безопасности ThinkShield?",
    options: ["Только аппаратуры", "Только ПО", "Устройств и данных (End-to-end devices and data)", "Только облачных сервисов"],
    correctAnswer: 2,
    explanation: "ThinkShield обеспечивает комплексную защиту устройств и данных"
  },
  {
    id: 6,
    question: "Для чего служит услуга CO2 Offset от Lenovo?",
    options: ["Уменьшение веса устройства", "Компенсация углеродного следа за производство и доставку устройств", "Повышение срока службы батареи", "Увеличение скорости обработки"],
    correctAnswer: 1,
    explanation: "CO2 Offset помогает компенсировать углеродный след производства и доставки"
  },
  {
    id: 7,
    question: "Какая платформа Lenovo предназначена для «умных» переговорных комнат?",
    options: ["ThinkSmart", "SmartOffice", "Lenovo Meet", "ThinkConnect"],
    correctAnswer: 0,
    explanation: "ThinkSmart - это решение Lenovo для умных переговорных комнат"
  },
  {
    id: 8,
    question: "Как называется глобальная партнёрская программа Lenovo?",
    options: ["Lenovo Alliance", "Lenovo 360", "PartnerFirst", "ThinkPartner"],
    correctAnswer: 1,
    explanation: "Lenovo 360 - это глобальная партнерская программа компании"
  },
  {
    id: 9,
    question: "Какая инновация от Lenovo была представлена на Гран-при США Формулы 1 в 2023 году?",
    options: ["Автономный болид", "Виртуальный комментатор", "Кубки, активируемые поцелуем", "Голографический флаг"],
    correctAnswer: 2,
    explanation: "На Гран-при США 2023 были представлены кубки, активируемые поцелуем"
  },
  {
    id: 10,
    question: "Как Lenovo поддерживает устойчивое развитие в рамках партнёрства с Формулой 1?",
    options: ["Использует солнечные панели на трассах", "Предоставляет электрокары для команд", "Обеспечивает переработку 95% устаревшего оборудования", "Спонсирует посадку деревьев"],
    correctAnswer: 2,
    explanation: "Lenovo обеспечивает переработку 95% устаревшего оборудования в рамках устойчивого развития"
  }
];

const Quiz = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resultId, setResultId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const startGame = () => {
    if (!playerName.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваше имя",
        variant: "destructive"
      });
      return;
    }
    setStartTime(new Date());
    setGameStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) {
      toast({
        title: "Выберите ответ",
        description: "Пожалуйста, выберите один из вариантов ответа",
        variant: "destructive"
      });
      return;
    }

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);
    setShowResult(true);

    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const endTime = new Date();
        const durationInSeconds = Math.round((endTime.getTime() - (startTime?.getTime() || endTime.getTime())) / 1000);

        const result = {
          player_name: playerName,
          score: newAnswers.filter(a => a).length,
          total_questions: questions.length,
          percentage: Math.round((newAnswers.filter(a => a).length / questions.length) * 100),
          answers: newAnswers,
          duration_seconds: durationInSeconds
        };
        
        console.log('Сохраняем результат в Supabase:', result);
        
        try {
          const { data, error } = await supabase
            .from('quiz_results')
            .insert([result])
            .select();
          
          if (error) {
            console.error('Ошибка при сохранении в Supabase:', error);
            toast({
              title: "Ошибка сохранения",
              description: `Не удалось сохранить результат: ${error.message}`,
              variant: "destructive"
            });
          } else if (data && data[0]) {
            setResultId(data[0].id);
            setShowCamera(true);
          }
        } catch (err) {
          console.error('Неожиданная ошибка:', err);
          toast({
            title: "Ошибка",
            description: "Произошла неожиданная ошибка при сохранении",
            variant: "destructive"
          });
        }
        
        setGameComplete(true);
      }
    }, 3000);
  };

  const restartGame = () => {
    setPlayerName('');
    setGameStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswers([]);
    setGameComplete(false);
  };

  const viewResults = () => {
    navigate('/results');
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Викторина Lenovo</CardTitle>
            <p className="text-blue-100">Проверьте свои знания о компании Lenovo</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Введите ваше имя
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Ваше имя"
                  className="text-center text-lg"
                  onKeyPress={(e) => e.key === 'Enter' && startGame()}
                />
              </div>
              <Button 
                onClick={startGame}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-3"
              >
                Начать игру
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameComplete && showCamera && resultId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Сделайте фото для результата</CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex flex-col items-center">
            <CameraCapture onCapture={async (blob) => {
              console.log('Начинаем загрузку фото...');
              console.log('Blob size:', blob.size);
              console.log('Blob type:', blob.type);
              
              setUploading(true);
              const fileName = `quiz_photos/${resultId}_${Date.now()}.jpg`;
              console.log('Имя файла:', fileName);
              
              try {
                const { data, error } = await supabase.storage.from('photos').upload(fileName, blob, { 
                  upsert: true, 
                  contentType: 'image/jpeg' 
                });
                
                if (error) {
                  console.error('Ошибка загрузки в Supabase Storage:', error);
                  toast({ 
                    title: 'Ошибка загрузки', 
                    description: error.message, 
                    variant: 'destructive' 
                  });
                  setUploading(false);
                  return;
                }
                
                console.log('Фото успешно загружено:', data);
                
                const { data: publicUrlData } = supabase.storage.from('photos').getPublicUrl(fileName);
                const url = publicUrlData.publicUrl;
                console.log('Публичная ссылка:', url);
                
                setPhotoUrl(url);
                
                console.log('Обновляем запись с ID:', resultId, 'photo_url:', url);
                
                const { data: updateData, error: updateError } = await supabase
                  .from('quiz_results')
                  .update({ photo_url: url })
                  .eq('id', resultId)
                  .select();
                
                console.log('Результат обновления:', { updateData, updateError });
                
                if (updateError) {
                  console.error('Ошибка обновления записи:', updateError);
                  toast({ 
                    title: 'Ошибка обновления', 
                    description: updateError.message, 
                    variant: 'destructive' 
                  });
                } else {
                  console.log('Запись успешно обновлена:', updateData);
                  toast({
                    title: "Фото загружено",
                    description: "Ваше фото успешно добавлено к результату!",
                  });
                }
                
              } catch (err) {
                console.error('Неожиданная ошибка при загрузке:', err);
                toast({ 
                  title: 'Неожиданная ошибка', 
                  description: 'Произошла ошибка при загрузке фото', 
                  variant: 'destructive' 
                });
              }
              
              setUploading(false);
              setShowCamera(false);
            }} />
            {uploading && <div className="mt-4 text-blue-600">Загрузка фото...</div>}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameComplete) {
    const correctAnswers = answers.filter(a => a).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader className="text-center bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Игра завершена!</CardTitle>
            <p className="text-green-100">Поздравляем, {playerName}!</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-gray-800">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-xl text-gray-600">
                Правильных ответов: {percentage}%
              </div>
              
              <div className="grid gap-2 mt-6">
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-700">Вопрос {index + 1}</span>
                    {answers[index] ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <Button 
                  onClick={restartGame}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Играть снова
                </Button>
                <Button 
                  onClick={viewResults}
                  variant="outline"
                  className="flex-1"
                >
                  Посмотреть результаты
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Игрок: {playerName}</span>
            <span className="text-sm text-gray-600">
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-4">
              {currentQ.options.map((option, index) => {
                let buttonClass = "p-4 text-left border-2 rounded-lg transition-all duration-200 ";
                
                if (showResult) {
                  if (index === currentQ.correctAnswer) {
                    buttonClass += "bg-green-100 border-green-500 text-green-800";
                  } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                    buttonClass += "bg-red-100 border-red-500 text-red-800";
                  } else {
                    buttonClass += "bg-gray-100 border-gray-300 text-gray-600";
                  }
                } else if (selectedAnswer === index) {
                  buttonClass += "bg-blue-100 border-blue-500 text-blue-800";
                } else {
                  buttonClass += "bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                    disabled={showResult}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                      {showResult && index === currentQ.correctAnswer && (
                        <CheckCircle className="ml-auto h-5 w-5 text-green-600" />
                      )}
                      {showResult && index === selectedAnswer && index !== currentQ.correctAnswer && (
                        <XCircle className="ml-auto h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {!showResult && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={submitAnswer}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-3 text-lg"
                  disabled={selectedAnswer === null}
                >
                  Ответить
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;

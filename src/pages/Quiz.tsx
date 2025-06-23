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
    correctAnswer: 1, // Б
    explanation: "Компания Lenovo была основана в 1984 году."
  },
  {
    id: 2,
    question: "В скольких странах работает Lenovo по всему миру?",
    options: ["60", "100", "180", "200"],
    correctAnswer: 1, // Б
    explanation: "Lenovo работает более чем в 100 странах по всему миру."
  },
  {
    id: 3,
    question: "Какой крупный турнир FIFA поддерживает Lenovo в рамках партнёрства?",
    options: [
      "Чемпионат Европы УЕФА 2024",
      "Чемпионат мира FIFA 2026™",
      "Кубок Америки 2024",
      "Кубок Азии AFC 2027"
    ],
    correctAnswer: 1, // Б
    explanation: "Lenovo поддерживает Чемпионат мира FIFA 2026™."
  },
  {
    id: 4,
    question: "Какая инновация Lenovo помогает FIFA принимать решения в режиме реального времени?",
    options: [
      "Информационные панели Lenovo на базе ИИ",
      "Умные термостаты",
      "Беспроводные наушники",
      "Цифровые судьи"
    ],
    correctAnswer: 0, // А
    explanation: "Информационные панели Lenovo на базе ИИ помогают FIFA принимать решения в реальном времени."
  },
  {
    id: 5,
    question: "Платформа безопасности ThinkShield использована на защиту:",
    options: [
      "Только аппаратуры",
      "Только ПО",
      "Устройств и данных (End-to-end devices and data)",
      "Только облачных сервисов"
    ],
    correctAnswer: 2, // В
    explanation: "ThinkShield обеспечивает защиту устройств и данных (End-to-end devices and data)."
  },
  {
    id: 6,
    question: "Какая платформа Lenovo предназначена для «умных» переговорных комнат?",
    options: ["ThinkSmart", "SmartOffice", "Lenovo Meet", "ThinkConnect"],
    correctAnswer: 0, // А
    explanation: "ThinkSmart — платформа Lenovo для умных переговорных комнат."
  },
  {
    id: 7,
    question: "Как называется глобальная партнёрская программа Lenovo?",
    options: ["Lenovo Alliance", "Lenovo 360", "PartnerFirst", "ThinkPartner"],
    correctAnswer: 1, // Б
    explanation: "Lenovo 360 — глобальная партнёрская программа Lenovo."
  },
  {
    id: 8,
    question: "В рамках партнерства Lenovo и Formula 1, какой продукт Lenovo используется создателями контента Формулы-1 для редактирования и рендеринга?",
    options: [
      "ThinkPad X1 Yoga",
      "Рабочие станции ThinkStation",
      "Legion 9",
      "ThinkPad X1 Carbon"
    ],
    correctAnswer: 1, // Б
    explanation: "Рабочие станции ThinkStation используются для редактирования и рендеринга контента Формулы-1."
  },
  {
    id: 9,
    question: "В рамках партнерства Lenovo и Formula 1, какое устройство Lenovo обычно используется инженерами Формулы-1 на трассе?",
    options: [
      "ThinkPad X1 Carbon",
      "Рабочая станция ThinkPad",
      "Yoga 9 2-in-1",
      "Legion Pro 7"
    ],
    correctAnswer: 1, // Б
    explanation: "Инженеры Формулы-1 на трассе обычно используют рабочие станции ThinkPad."
  },
  {
    id: 10,
    question: "Какая инновация от Lenovo была представлена на Гран-при США Формулы 1 в 2023 году?",
    options: [
      "Автономный болид",
      "Виртуальный комментатор",
      "Кубки, активируемые поцелуем",
      "Голографический флаг"
    ],
    correctAnswer: 2, // В
    explanation: "На Гран-при США Формулы 1 в 2023 году были представлены кубки, активируемые поцелуем."
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 80% 40%, #6B183A 0%, #4B2067 60%, #1a1333 100%)' }}>
        <div className="card w-full max-w-md shadow-2xl">
          <div className="text-center bg-gradient-to-r from-[#6B183A] to-[#4B2067] text-white rounded-t-lg p-6">
            <div className="text-2xl font-bold">Lenovo <span className="accent">Quiz</span></div>
            <p className="text-[#f5f5f7]">Проверьте свои знания о компании <span className="accent">Lenovo</span></p>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#f5f5f7] mb-2">
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
              <button
                onClick={startGame}
                className="w-full text-lg py-3 bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition border-none"
              >
                Начать игру
                <ArrowRight className="ml-2 h-5 w-5 text-[#e2231a] inline" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete && showCamera && resultId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 80% 40%, #6B183A 0%, #4B2067 60%, #1a1333 100%)' }}>
        <div className="card w-full max-w-md shadow-2xl">
          <div className="text-center bg-gradient-to-r from-[#6B183A] to-[#4B2067] text-white rounded-t-lg p-6">
            <div className="text-2xl font-bold">Сделайте фото для результата</div>
          </div>
          <div className="p-8 flex flex-col items-center">
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
            {uploading && <div className="mt-4 text-[#e2231a]">Загрузка фото...</div>}
          </div>
        </div>
      </div>
    );
  }

  if (gameComplete) {
    const correctAnswers = answers.filter(a => a).length;
    const percentage = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at 80% 40%, #6B183A 0%, #4B2067 60%, #1a1333 100%)' }}>
        <div className="card w-full max-w-2xl shadow-2xl">
          <div className="text-center bg-gradient-to-r from-[#6B183A] to-[#4B2067] text-white rounded-t-lg p-6">
            <div className="text-3xl font-bold">Игра завершена!</div>
            <p className="text-[#f5f5f7]">Поздравляем, {playerName}!</p>
          </div>
          <div className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl font-bold text-[#e2231a]">
                {correctAnswers}/{questions.length}
              </div>
              <div className="text-xl text-[#f5f5f7]">
                Правильных ответов: {percentage}%
              </div>
              <div className="grid gap-2 mt-6">
                {questions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#1a1333]">
                    <span className="text-sm text-[#f5f5f7]">Вопрос {index + 1}</span>
                    {answers[index] ? (
                      <CheckCircle className="h-5 w-5 text-[#e2231a]" />
                    ) : (
                      <XCircle className="h-5 w-5 text-[#6B183A]" />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={restartGame}
                  className="flex-1 bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition text-lg py-3"
                >
                  Играть снова
                </button>
                <button
                  onClick={viewResults}
                  className="flex-1 bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition text-lg py-3"
                >
                  Посмотреть результаты
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen p-4" style={{ background: 'radial-gradient(ellipse at 80% 40%, #6B183A 0%, #4B2067 60%, #1a1333 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#f5f5f7]">Игрок: {playerName}</span>
            <span className="text-sm text-[#f5f5f7]">
              Вопрос {currentQuestion + 1} из {questions.length}
            </span>
          </div>
          <div className="w-full bg-[#4B2067] rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#e2231a] to-[#6B183A] h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="shadow-2xl rounded-2xl bg-white">
          <div className="bg-gradient-to-r from-[#6B183A] to-[#4B2067] text-white rounded-t-2xl p-6">
            <div className="text-xl">{currentQ.question}</div>
          </div>
          <div className="p-8">
            <div className="grid gap-4">
              {currentQ.options.map((option, index) => {
                let buttonClass = "p-4 text-left border-2 rounded-lg transition-all duration-200 ";
                if (showResult) {
                  if (index === currentQ.correctAnswer) {
                    buttonClass += "bg-green-100 text-green-800 border-green-500 font-bold";
                  } else if (index === selectedAnswer && index !== currentQ.correctAnswer) {
                    buttonClass += "bg-red-100 text-red-800 border-red-500 font-bold";
                  } else {
                    buttonClass += "bg-white text-[#1a1333] border-[#e5e7eb]";
                  }
                } else if (selectedAnswer === index) {
                  buttonClass += "bg-blue-100 text-blue-800 border-blue-500 font-bold";
                } else {
                  buttonClass += "bg-white text-[#1a1333] border-[#e5e7eb] hover:bg-gray-100";
                }
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={buttonClass}
                    disabled={showResult}
                  >
                    <div className="flex items-center">
                      <span className="w-8 h-8 rounded-full bg-[#e2231a] flex items-center justify-center mr-3 text-sm font-medium text-white">
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
              <div className="mt-6 p-4 bg-[#4B2067] rounded-lg">
                <p className="text-[#f5f5f7] font-medium">
                  {currentQ.explanation}
                </p>
              </div>
            )}
            {!showResult && (
              <div className="mt-8 text-center">
                <button
                  onClick={submitAnswer}
                  className="bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition px-8 py-3 text-lg"
                  disabled={selectedAnswer === null}
                >
                  Ответить
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

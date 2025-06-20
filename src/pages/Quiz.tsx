import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from 'react-router-dom';
import { Check, RotateCcw, Trophy, Camera } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import CameraCapture from "@/components/CameraCapture";

// Определяем тип для вопросов викторины
interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

// Используем тип из Supabase для результатов
type QuizResult = Tables<'quiz_results'>;

const Quiz = () => {
  const [playerName, setPlayerName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [lastResultId, setLastResultId] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      // Загрузка вопросов из JSON файла
      const response = await fetch('/questions.json');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Ошибка при загрузке вопросов:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить вопросы викторины",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    if (playerName.trim() === '') {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите ваше имя",
        duration: 3000,
      });
      return;
    }
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setCompleted(false);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const nextQuestion = async () => {
    if (!selectedAnswer) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите ответ",
        duration: 3000,
      });
      return;
    }

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setCompleted(true);
      await saveResults();
    }
  };

  const saveResults = async () => {
    console.log('Сохраняем результаты...');
    try {
      const percentage = Math.round((score / questions.length) * 100);
      const { data, error } = await supabase
        .from('quiz_results')
        .insert([
          {
            player_name: playerName,
            score: score,
            total_questions: questions.length,
            percentage: percentage,
            completed_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Ошибка при сохранении результатов:', error);
        toast({
          title: "Ошибка сохранения",
          description: `Не удалось сохранить результаты: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Результаты успешно сохранены:', data);
        setLastResultId(data.id);
        toast({
          title: "Результаты сохранены",
          description: "Ваши результаты успешно сохранены!",
        });
      }
    } catch (err) {
      console.error('Неожиданная ошибка при сохранении:', err);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка при сохранении результатов",
        variant: "destructive"
      });
    }
  };

  const handlePhotoTaken = async (photoUrl: string) => {
    console.log('Обновляем результат с фото:', photoUrl);
    
    if (lastResultId) {
      try {
        const { error } = await supabase
          .from('quiz_results')
          .update({ photo_url: photoUrl })
          .eq('id', lastResultId);

        if (error) {
          console.error('Ошибка обновления фото:', error);
          toast({
            title: "Ошибка",
            description: `Не удалось сохранить фото: ${error.message}`,
            variant: "destructive"
          });
        } else {
          console.log('Фото успешно сохранено в результате');
          toast({
            title: "Фото сохранено",
            description: "Ваше фото добавлено к результатам!",
          });
        }
      } catch (err) {
        console.error('Неожиданная ошибка при сохранении фото:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Викторина Lenovo
          </h1>
          <p className="text-center text-gray-600">
            Ответьте на вопросы и проверьте свои знания о Lenovo!
          </p>
        </div>

        {!quizStarted ? (
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-center">
                Начать викторину
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Введите ваше имя"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={startQuiz}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-3"
                >
                  Начать игру
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : currentQuestion < questions.length ? (
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
              <CardTitle className="text-xl font-semibold">
                Вопрос {currentQuestion + 1}/{questions.length}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <p className="text-gray-700 text-lg">{questions[currentQuestion].text}</p>
                <RadioGroup onValueChange={handleAnswerSelect} value={selectedAnswer || ''}>
                  <div className="grid gap-2">
                    {questions[currentQuestion].options.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={option} className="peer h-5 w-5 shrink-0 rounded-full border-2 border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                        <Label htmlFor={option} className="cursor-pointer peer-checked:font-semibold">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
                <Button 
                  onClick={nextQuestion}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-lg py-3"
                >
                  {currentQuestion === questions.length - 1 ? 'Завершить' : 'Следующий вопрос'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold text-center">
                🎉 Викторина завершена!
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                <div className="text-6xl mb-4">
                  {score >= 9 ? '🏆' : score >= 7 ? '🥇' : score >= 5 ? '🥈' : '🥉'}
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Ваш результат: {score}/{questions.length}
                  </h3>
                  <p className="text-xl text-gray-600">
                    {Math.round((score / questions.length) * 100)}% правильных ответов
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-700">
                    {score >= 9 ? 'Превосходно! Вы отлично знаете Lenovo!' :
                     score >= 7 ? 'Отлично! У вас хорошие знания о Lenovo!' :
                     score >= 5 ? 'Хорошо! Есть что изучить дополнительно.' :
                     'Стоит больше узнать о компании Lenovo!'}
                  </p>
                </div>

                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={() => setShowCamera(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-lg py-3"
                    size="lg"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Сделать фото
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/results')}
                    variant="outline"
                    className="text-lg py-3"
                    size="lg"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Посмотреть все результаты
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="text-lg py-3"
                    size="lg"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    Пройти снова
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showCamera && (
        <CameraCapture 
          onPhotoTaken={handlePhotoTaken}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};

export default Quiz;

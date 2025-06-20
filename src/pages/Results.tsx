
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Trophy, Medal, Award, RefreshCw, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

// Используем тип из Supabase для результатов
type QuizResult = Tables<'quiz_results'>;

const Results = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchResults = async () => {
    console.log('Загружаем результаты из Supabase...');
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .order('score', { ascending: false })
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Ошибка при загрузке результатов:', error);
        toast({
          title: "Ошибка загрузки",
          description: `Не удалось загрузить результаты: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Результаты успешно загружены:', data);
        setResults(data || []);
      }
    } catch (err) {
      console.error('Неожиданная ошибка при загрузке:', err);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка при загрузке результатов",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();

    // Настройка real-time обновлений
    const channel = supabase
      .channel('quiz-results-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_results'
        },
        (payload) => {
          console.log('Real-time обновление:', payload);
          fetchResults(); // Перезагружаем данные при любых изменениях
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "bg-green-500";
    if (percentage >= 70) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Вернуться к игре
          </Button>
          
          <Button 
            onClick={fetchResults}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">
              🏆 Таблица лидеров
            </CardTitle>
            <p className="text-center text-purple-100">
              Результаты всех участников викторины Lenovo
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Загружаем результаты...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Пока нет результатов
                </h3>
                <p className="text-gray-500">
                  Станьте первым, кто пройдет викторину!
                </p>
                <Button 
                  onClick={() => navigate('/')}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Начать викторину
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                      index < 3 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                        {getRankIcon(index)}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          {result.photo_url ? (
                            <AvatarImage 
                              src={result.photo_url} 
                              alt={result.player_name}
                              className="object-cover"
                            />
                          ) : (
                            <AvatarFallback>
                              <User className="h-6 w-6 text-gray-400" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        
                        <div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            {result.player_name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {result.completed_at ? new Date(result.completed_at).toLocaleString('ru-RU') : 'Время неизвестно'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {result.score}/{result.total_questions}
                        </div>
                        <div className="text-sm text-gray-500">
                          {result.percentage}%
                        </div>
                      </div>
                      
                      <Badge 
                        className={`${getScoreColor(result.score, result.total_questions)} text-white px-3 py-1`}
                      >
                        {result.score >= result.total_questions * 0.9 ? 'Отлично' :
                         result.score >= result.total_questions * 0.7 ? 'Хорошо' :
                         result.score >= result.total_questions * 0.5 ? 'Средне' : 'Плохо'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {results.length > 0 && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Статистика:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.length}
                    </div>
                    <div className="text-sm text-gray-600">Участников</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(results.reduce((acc, r) => acc + (r.score / r.total_questions), 0) / results.length * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Средний балл</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.max(...results.map(r => r.score))}
                    </div>
                    <div className="text-sm text-gray-600">Лучший результат</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.filter(r => r.score === r.total_questions).length}
                    </div>
                    <div className="text-sm text-gray-600">Максимальных баллов</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Results;

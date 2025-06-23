import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Medal, Award, RefreshCw } from 'lucide-react';
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
        .order('duration_seconds', { ascending: true })
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
        console.log('Проверяем photo_url в результатах:');
        data?.forEach((result, index) => {
          console.log(`Результат ${index + 1}:`, {
            id: result.id,
            player_name: result.player_name,
            photo_url: result.photo_url,
            has_photo: !!result.photo_url
          });
        });
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

  const clearResults = async () => {
    console.log('Очищаем все результаты...');
    try {
      const { error } = await supabase
        .from('quiz_results')
        .delete()
        .neq('id', 0); // Удаляем все записи

      if (error) {
        console.error('Ошибка при очистке результатов:', error);
        toast({
          title: "Ошибка",
          description: `Не удалось очистить результаты: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Результаты успешно очищены');
        setResults([]);
        toast({
          title: "Результаты очищены",
          description: "Все результаты викторины удалены",
        });
      }
    } catch (err) {
      console.error('Неожиданная ошибка при очистке:', err);
      toast({
        title: "Ошибка",
        description: "Произошла неожиданная ошибка при очистке результатов",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen p-4" style={{ background: 'radial-gradient(ellipse at 80% 40%, #6B183A 0%, #4B2067 60%, #1a1333 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition px-4 py-2 border-none"
          >
            <ArrowLeft className="h-4 w-4 text-[#e2231a]" />
            Вернуться к игре
          </button>
          <div className="flex gap-2">
            <button
              onClick={fetchResults}
              className="bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition px-4 py-2 border-none text-sm flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} text-[#e2231a]`} />
              <span>Обновить</span>
            </button>
          </div>
        </div>
        <div className="shadow-2xl rounded-2xl bg-white">
          <div className="bg-gradient-to-r from-[#6B183A] to-[#4B2067] text-white rounded-t-2xl p-6">
            <div className="text-2xl font-bold text-center">
              🏆 Таблица лидеров
            </div>
            <p className="text-center text-[#f5f5f7]">
              Результаты всех участников <span className="accent">Lenovo Quiz</span>
            </p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-[#e2231a] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-[#4B2067]">Загружаем результаты...</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-[#e2231a] text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-[#4B2067] mb-2">
                  Пока нет результатов
                </h3>
                <p className="text-[#6B183A]">
                  Станьте первым, кто пройдет викторину!
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition px-6 py-3"
                >
                  Начать викторину
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={result.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                      index < 3
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-md'
                        : 'bg-white border-[#e5e7eb] hover:border-[#4B2067]'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#f5f5f7]">
                        {getRankIcon(index)}
                      </div>
                      {result.photo_url && (
                        <img src={result.photo_url} alt="Фото" className="w-12 h-12 rounded-full object-cover border ml-2" />
                      )}
                      <div>
                        <h3 className="font-semibold text-lg text-[#1a1333]">
                          {result.player_name}
                        </h3>
                        <p className="text-sm text-[#4B2067]">
                          {result.completed_at ? new Date(result.completed_at).toLocaleString('ru-RU') : 'Время неизвестно'}
                        </p>
                        {result.duration_seconds !== null && (
                          <p className="text-sm text-[#6B183A]">
                            Время: {result.duration_seconds} сек
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#e2231a]">
                          {result.score}/{result.total_questions}
                        </div>
                        <div className="text-sm text-[#4B2067]">
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
              <div className="mt-8 p-4 bg-[#f5f5f7] rounded-lg">
                <h4 className="font-semibold text-[#1a1333] mb-2">Статистика:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#4B2067]">
                      {results.length}
                    </div>
                    <div className="text-sm text-[#6B183A]">Участников</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#e2231a]">
                      {Math.round(results.reduce((acc, r) => acc + (r.score / r.total_questions), 0) / results.length * 100)}%
                    </div>
                    <div className="text-sm text-[#6B183A]">Средний балл</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#6B183A]">
                      {Math.max(...results.map(r => r.score))}
                    </div>
                    <div className="text-sm text-[#4B2067]">Лучший результат</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#e2231a]">
                      {results.filter(r => r.score === r.total_questions).length}
                    </div>
                    <div className="text-sm text-[#6B183A]">Максимальных баллов</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

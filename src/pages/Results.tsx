
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Medal, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizResult {
  name: string;
  score: number;
  total: number;
  timestamp: string;
  answers: boolean[];
}

const Results = () => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    // Sort by score (descending) and then by timestamp (most recent first)
    const sortedResults = savedResults.sort((a: QuizResult, b: QuizResult) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    setResults(sortedResults);
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

  const clearResults = () => {
    localStorage.removeItem('quizResults');
    setResults([]);
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
          
          {results.length > 0 && (
            <Button 
              onClick={clearResults}
              variant="destructive"
              size="sm"
            >
              Очистить результаты
            </Button>
          )}
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
            {results.length === 0 ? (
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
                    key={index}
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
                      
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {result.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(result.timestamp).toLocaleString('ru-RU')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {result.score}/{result.total}
                        </div>
                        <div className="text-sm text-gray-500">
                          {Math.round((result.score / result.total) * 100)}%
                        </div>
                      </div>
                      
                      <Badge 
                        className={`${getScoreColor(result.score, result.total)} text-white px-3 py-1`}
                      >
                        {result.score >= result.total * 0.9 ? 'Отлично' :
                         result.score >= result.total * 0.7 ? 'Хорошо' :
                         result.score >= result.total * 0.5 ? 'Средне' : 'Плохо'}
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
                      {Math.round(results.reduce((acc, r) => acc + (r.score / r.total), 0) / results.length * 100)}%
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
                      {results.filter(r => r.score === r.total).length}
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

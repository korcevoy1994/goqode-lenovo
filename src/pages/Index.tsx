
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Play, Trophy } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Викторина Lenovo
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Проверьте свои знания о мировом лидере в области технологий
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Game Card */}
          <Card className="shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Play className="mr-3 h-8 w-8" />
                Начать игру
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Ответьте на 10 вопросов о компании Lenovo и покажите свои знания!
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    10 увлекательных вопросов
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Мгновенная обратная связь
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Подробная статистика
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/quiz')}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-lg py-3 mt-6"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Играть сейчас
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Trophy className="mr-3 h-8 w-8" />
                Таблица лидеров
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <p className="text-gray-600 text-lg">
                  Посмотрите результаты всех участников викторины и найдите себя в рейтинге!
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Рейтинг всех игроков
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                    Общая статистика
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    История результатов
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/results')}
                  variant="outline"
                  className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white text-lg py-3 mt-6"
                >
                  <Trophy className="mr-2 h-5 w-5"  />
                  Посмотреть результаты
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            Викторина создана для демонстрации знаний о компании Lenovo
          </p>
          <p className="text-gray-400 text-sm mt-2">
            © 2024 Lenovo Quiz. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 80% 40%, #6B183A 0%, #4B2067 60%, #1a1333 100%)' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6B183A] to-[#4B2067] text-white shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Lenovo <span className="accent">Quiz</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#f5f5f7] mb-8">
              Проверьте свои знания о компании <span className="accent">Lenovo</span> в увлекательной викторине!
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Game Card */}
          <div className="card shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-r from-[#e2231a] to-[#4B2067] text-white rounded-t-lg p-6">
              <div className="text-2xl font-bold flex items-center">
                <span className="mr-3 h-8 w-8">🎮</span>
                Начать игру
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                <p className="text-[#f5f5f7] text-lg">
                  Ответьте на 10 вопросов о компании <span className="accent">Lenovo</span> и покажите свои знания!
                </p>
                <ul className="space-y-2 text-[#f5f5f7]">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#e2231a] rounded-full mr-3"></div>
                    10 увлекательных вопросов
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#4B2067] rounded-full mr-3"></div>
                    Мгновенная обратная связь
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#6B183A] rounded-full mr-3"></div>
                    Подробная статистика
                  </li>
                </ul>
                <button 
                  onClick={() => navigate('/quiz')}
                  className="w-full text-lg py-3 mt-6 bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition border-none"
                >
                  Играть сейчас
                </button>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="card shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="bg-gradient-to-r from-[#4B2067] to-[#e2231a] text-white rounded-t-lg p-6">
              <div className="text-2xl font-bold flex items-center">
                <span className="mr-3 h-8 w-8">🏆</span>
                Таблица лидеров
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4">
                <p className="text-[#f5f5f7] text-lg">
                  Посмотрите результаты всех участников <span className="accent">Lenovo Quiz</span> и найдите себя в рейтинге!
                </p>
                <ul className="space-y-2 text-[#f5f5f7]">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#4B2067] rounded-full mr-3"></div>
                    Рейтинг всех игроков
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#e2231a] rounded-full mr-3"></div>
                    Общая статистика
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-[#6B183A] rounded-full mr-3"></div>
                    История результатов
                  </li>
                </ul>
                <button 
                  onClick={() => navigate('/results')}
                  className="w-full text-lg py-3 mt-6 bg-white text-[#1a1333] font-bold rounded-xl shadow hover:bg-gray-100 transition border-none"
                >
                  Посмотреть результаты
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        {/* <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">
              О викторине
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-2">Интерактивность</h3>
                <p className="text-gray-600">
                  Удобный интерфейс с мгновенной обратной связью на каждый ответ
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">Обучение</h3>
                <p className="text-gray-600">
                  Узнайте больше о компании Lenovo и её инновационных решениях
                </p>
              </div>
              <div>
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold mb-2">Соревнование</h3>
                <p className="text-gray-600">
                  Сравните свои результаты с другими участниками викторины
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Footer */}
      <div className="bg-[#1a1333] text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#f5f5f7]">
            Lenovo Quiz — Smarter AI for all
          </p>
          <p className="text-gray-400 text-sm mt-2">
            © 2025 Lenovo. Все права защищены.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;

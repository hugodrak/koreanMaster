import React from 'react';
import { Play, Target, Trophy, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import { Theme, UserProgress, Word } from '../types';
import { getAIRecommendations } from '../utils/aiRecommendations';

interface DashboardProps {
  themes: Theme[];
  words: Word[];
  userProgress: UserProgress;
  onStartPractice: (themeId: string, type: 'english-to-korean' | 'korean-to-english') => void;
  onViewChange: (view: string) => void;
}

export function Dashboard({ themes, words, userProgress, onStartPractice, onViewChange }: DashboardProps) {
  const recommendations = getAIRecommendations(words, [], userProgress);
  const todaysPractice = words.filter(word => 
    !word.lastReviewed || 
    new Date().toDateString() !== word.lastReviewed.toDateString()
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Ready to continue your Korean learning journey?</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Points</p>
              <p className="text-2xl font-bold">{userProgress.totalPoints}</p>
            </div>
            <Trophy className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Current Streak</p>
              <p className="text-2xl font-bold">{userProgress.currentStreak} days</p>
            </div>
            <Target className="h-8 w-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Words Learned</p>
              <p className="text-2xl font-bold">{userProgress.wordsLearned}</p>
            </div>
            <BookOpen className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Today's Practice</p>
              <p className="text-2xl font-bold">{todaysPractice}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Practice Themes */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Practice Themes</h3>
            <button
              onClick={() => onViewChange('words')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Manage Words →
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {themes.map((theme) => (
              <div key={theme.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: theme.color }}
                    ></div>
                    <h4 className="font-semibold text-gray-900">{theme.name}</h4>
                  </div>
                  <span className="text-sm text-gray-500">{theme.wordCount} words</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{theme.description}</p>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => onStartPractice(theme.id, 'english-to-korean')}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Play size={14} />
                    <span>EN → KO</span>
                  </button>
                  <button
                    onClick={() => onStartPractice(theme.id, 'korean-to-english')}
                    className="flex-1 bg-purple-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Play size={14} />
                    <span>KO → EN</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">AI Recommendations</h3>
            <TrendingUp size={20} className="text-blue-600" />
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {recommendations.length > 0 ? (
              <div className="space-y-4">
                {recommendations.slice(0, 5).map((rec) => (
                  <div key={rec.word.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{rec.word.english}</p>
                      <p className="text-sm text-gray-600">{rec.reason}</p>
                    </div>
                    <div className="text-right">
                      <div className="w-2 h-2 bg-red-500 rounded-full mb-1"></div>
                      <p className="text-xs text-gray-500">Priority</p>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => onViewChange('progress')}
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Recommendations →
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Great job! No urgent recommendations.</p>
                <p className="text-sm text-gray-400 mt-1">Keep practicing to maintain your progress.</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
            <h4 className="font-semibold mb-3">Quick Practice</h4>
            <p className="text-sm text-indigo-100 mb-4">Start a mixed review session with your most challenging words.</p>
            <button
              onClick={() => onStartPractice('mixed', 'english-to-korean')}
              className="w-full bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition-colors"
            >
              Start Mixed Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
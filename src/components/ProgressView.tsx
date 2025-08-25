import React from 'react';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import { Word, Session, UserProgress } from '../types';
import { getAIRecommendations } from '../utils/aiRecommendations';

interface ProgressViewProps {
  words: Word[];
  sessions: Session[];
  userProgress: UserProgress;
}

export function ProgressView({ words, sessions, userProgress }: ProgressViewProps) {
  const recommendations = getAIRecommendations(words, sessions, userProgress);
  
  const recentSessions = sessions
    .filter(s => s.completedAt)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())
    .slice(0, 5);

  const accuracyByTheme = words.reduce((acc, word) => {
    const totalAttempts = word.correctCount + word.incorrectCount;
    if (totalAttempts > 0) {
      if (!acc[word.theme]) {
        acc[word.theme] = { correct: 0, total: 0 };
      }
      acc[word.theme].correct += word.correctCount;
      acc[word.theme].total += totalAttempts;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const difficultyStats = words.reduce((acc, word) => {
    const totalAttempts = word.correctCount + word.incorrectCount;
    if (totalAttempts > 0) {
      if (!acc[word.difficulty]) {
        acc[word.difficulty] = { correct: 0, total: 0 };
      }
      acc[word.difficulty].correct += word.correctCount;
      acc[word.difficulty].total += totalAttempts;
    }
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center mb-8">
        <TrendingUp className="mr-3 text-blue-600" size={28} />
        <h2 className="text-3xl font-bold text-gray-900">Progress & Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overall Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Overall Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{userProgress.totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{userProgress.wordsLearned}</div>
                <div className="text-sm text-gray-600">Words Learned</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{userProgress.currentStreak}</div>
                <div className="text-sm text-gray-600">Current Streak</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{userProgress.bestStreak}</div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
            </div>
          </div>

          {/* Accuracy by Theme */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="mr-2 text-blue-600" size={20} />
              <h3 className="text-xl font-semibold text-gray-900">Accuracy by Theme</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(accuracyByTheme).map(([theme, stats]) => {
                const accuracy = Math.round((stats.correct / stats.total) * 100);
                return (
                  <div key={theme} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-900 capitalize">{theme}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${accuracy}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 w-12">{accuracy}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Difficulty Breakdown */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance by Difficulty</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(difficultyStats).map(([difficulty, stats]) => {
                const accuracy = Math.round((stats.correct / stats.total) * 100);
                const color = difficulty === 'easy' ? 'green' : 
                             difficulty === 'medium' ? 'yellow' : 'red';
                return (
                  <div key={difficulty} className={`p-4 bg-${color}-50 rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium text-${color}-800 capitalize`}>{difficulty}</span>
                      <span className={`text-2xl font-bold text-${color}-600`}>{accuracy}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {stats.correct}/{stats.total} correct
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Calendar className="mr-2 text-blue-600" size={20} />
              <h3 className="text-xl font-semibold text-gray-900">Recent Sessions</h3>
            </div>
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{session.theme}</p>
                      <p className="text-sm text-gray-600">
                        {session.type === 'english-to-korean' ? 'EN → KO' : 'KO → EN'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {session.score}/{session.totalWords}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round((session.score / session.totalWords) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
              {recentSessions.length === 0 && (
                <p className="text-gray-500 text-center py-8">No sessions completed yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Recommendations */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Target className="mr-2 text-purple-600" size={20} />
              <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
            </div>
            <div className="space-y-3">
              {recommendations.slice(0, 8).map((rec) => (
                <div key={rec.word.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-900">{rec.word.english}</p>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                      Priority {rec.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{rec.word.korean}</p>
                  <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                </div>
              ))}
              {recommendations.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Great work! No urgent words to review.
                </p>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {userProgress.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{achievement.title}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-yellow-500 h-1.5 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
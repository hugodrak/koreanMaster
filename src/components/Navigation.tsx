import React from 'react';
import { Home, BookOpen, Users, TrendingUp, Settings } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  userProgress: any;
}

const navigationItems = [
  { id: 'dashboard' as AppView, icon: Home, label: 'Dashboard' },
  { id: 'practice' as AppView, icon: BookOpen, label: 'Practice' },
  { id: 'words' as AppView, icon: Users, label: 'Words' },
  { id: 'progress' as AppView, icon: TrendingUp, label: 'Progress' },
  { id: 'settings' as AppView, icon: Settings, label: 'Settings' }
];

export function Navigation({ currentView, onViewChange, userProgress }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">한</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">KoreanMaster</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navigationItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                  currentView === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:block">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-medium">{userProgress.totalPoints}</span>
              <span>points</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>{userProgress.currentStreak} day streak</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
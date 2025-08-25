import React, { useState, useCallback, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { PracticeSession } from './components/PracticeSession';
import { WordManagement } from './components/WordManagement';
import { ProgressView } from './components/ProgressView';
import { AppView, Word, Theme, Session, UserProgress, Achievement } from './types';
import { initialWords, themes as initialThemes } from './data/initialWords';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateSessionWords } from './utils/aiRecommendations';

const initialUserProgress: UserProgress = {
  totalPoints: 0,
  currentStreak: 0,
  bestStreak: 0,
  sessionsCompleted: 0,
  wordsLearned: 0,
  achievements: [
    {
      id: 'first_word',
      title: 'First Word',
      description: 'Learn your first Korean word',
      icon: '🎯',
      progress: 0,
      target: 1
    },
    {
      id: 'streak_master',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      icon: '🔥',
      progress: 0,
      target: 7
    },
    {
      id: 'vocabulary_builder',
      title: 'Vocabulary Builder',
      description: 'Learn 50 Korean words',
      icon: '📚',
      progress: 0,
      target: 50
    }
  ]
};

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [words, setWords] = useLocalStorage<Word[]>('korean-words', initialWords);
  const [themes, setThemes] = useLocalStorage<Theme[]>('korean-themes', initialThemes);
  const [sessions, setSessions] = useLocalStorage<Session[]>('korean-sessions', []);
  const [userProgress, setUserProgress] = useLocalStorage<UserProgress>('korean-progress', initialUserProgress);
  
  const [practiceSession, setPracticeSession] = useState<{
    words: Word[];
    type: 'english-to-korean' | 'korean-to-english';
    theme: string;
  } | null>(null);

  // Update theme word counts
  useEffect(() => {
    const updatedThemes = themes.map(theme => ({
      ...theme,
      wordCount: words.filter(word => word.theme === theme.id).length
    }));
    setThemes(updatedThemes);
  }, [words, themes, setThemes]);

  const handleStartPractice = useCallback((themeId: string, type: 'english-to-korean' | 'korean-to-english') => {
    let sessionWords: Word[];
    
    if (themeId === 'mixed') {
      // Mix words from all themes, prioritizing difficult ones
      sessionWords = generateSessionWords(words, '', 10);
    } else {
      sessionWords = generateSessionWords(words, themeId, 10);
    }
    
    if (sessionWords.length === 0) {
      alert('No words available for this theme. Please add some words first.');
      return;
    }
    
    setPracticeSession({ words: sessionWords, type, theme: themeId });
    setCurrentView('practice');
  }, [words]);

  const handleSessionComplete = useCallback((session: Session) => {
    // Update session history
    setSessions(prev => [session, ...prev]);
    
    // Update word statistics
    setWords(prev => prev.map(word => {
      const sessionWord = session.words.find(sw => sw.id === word.id);
      if (!sessionWord) return word;
      
      // This is simplified - in a real app, you'd track individual word performance
      return {
        ...word,
        lastReviewed: new Date(),
        correctCount: word.correctCount + Math.floor(Math.random() * 2), // Simplified
        incorrectCount: word.incorrectCount + Math.floor(Math.random() * 1),
        streak: word.streak + (Math.random() > 0.3 ? 1 : 0)
      };
    }));
    
    // Update user progress
    setUserProgress(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + (session.score * 10),
      sessionsCompleted: prev.sessionsCompleted + 1,
      wordsLearned: prev.wordsLearned + session.score,
      currentStreak: prev.currentStreak + 1,
      bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1)
    }));
    
    // Return to dashboard
    setPracticeSession(null);
    setCurrentView('dashboard');
  }, [setSessions, setWords, setUserProgress]);

  const handleAddWord = useCallback((newWord: Omit<Word, 'id' | 'correctCount' | 'incorrectCount' | 'streak'>) => {
    const word: Word = {
      ...newWord,
      id: Date.now().toString(),
      correctCount: 0,
      incorrectCount: 0,
      streak: 0
    };
    setWords(prev => [...prev, word]);
  }, [setWords]);

  const handleEditWord = useCallback((editedWord: Word) => {
    setWords(prev => prev.map(word => word.id === editedWord.id ? editedWord : word));
  }, [setWords]);

  const handleDeleteWord = useCallback((wordId: string) => {
    setWords(prev => prev.filter(word => word.id !== wordId));
  }, [setWords]);

  const handleAddTheme = useCallback((newTheme: Omit<Theme, 'id' | 'wordCount'>) => {
    const theme: Theme = {
      ...newTheme,
      id: Date.now().toString(),
      wordCount: 0
    };
    setThemes(prev => [...prev, theme]);
  }, [setThemes]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            themes={themes}
            words={words}
            userProgress={userProgress}
            onStartPractice={handleStartPractice}
            onViewChange={setCurrentView}
          />
        );
      
      case 'practice':
        if (!practiceSession) {
          setCurrentView('dashboard');
          return null;
        }
        return (
          <PracticeSession
            words={practiceSession.words}
            sessionType={practiceSession.type}
            theme={practiceSession.theme}
            onSessionComplete={handleSessionComplete}
            onBack={() => {
              setPracticeSession(null);
              setCurrentView('dashboard');
            }}
          />
        );
      
      case 'words':
        return (
          <WordManagement
            words={words}
            themes={themes}
            onAddWord={handleAddWord}
            onEditWord={handleEditWord}
            onDeleteWord={handleDeleteWord}
            onAddTheme={handleAddTheme}
          />
        );
      
      case 'progress':
        return (
          <ProgressView
            words={words}
            sessions={sessions}
            userProgress={userProgress}
          />
        );
      
      default:
        return <div className="p-8">Settings view coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        userProgress={userProgress}
      />
      {renderCurrentView()}
    </div>
  );
}

export default App;
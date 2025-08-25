import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Check, X, RotateCcw, Keyboard, Eye, EyeOff } from 'lucide-react';
import { Word, Session, AppView } from '../types';
import { useKoreanInput } from '../hooks/useKoreanInput';

interface PracticeSessionProps {
  words: Word[];
  sessionType: 'english-to-korean' | 'korean-to-english';
  theme: string;
  onSessionComplete: (session: Session) => void;
  onBack: () => void;
}

export function PracticeSession({ words, sessionType, theme, onSessionComplete, onBack }: PracticeSessionProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [sessionWords] = useState(words.slice(0, 10)); // Limit to 10 words per session
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [sessionStartTime] = useState(Date.now());
  const [showRomanization, setShowRomanization] = useState(false);
  
  const { input, isKoreanMode, handleInputChange, clearInput, toggleInputMode } = useKoreanInput();
  
  const currentWord = sessionWords[currentWordIndex];
  const progress = ((currentWordIndex + (showResult ? 1 : 0)) / sessionWords.length) * 100;

  useEffect(() => {
    setUserAnswer('');
    clearInput();
    setShowResult(false);
    setShowRomanization(false);
  }, [currentWordIndex, clearInput]);

  const checkAnswer = useCallback(() => {
    const answer = userAnswer.trim().toLowerCase();
    const correctAnswer = sessionType === 'english-to-korean' 
      ? currentWord.korean.toLowerCase()
      : currentWord.english.toLowerCase();
    
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }
  }, [userAnswer, currentWord, sessionType]);

  const nextWord = useCallback(() => {
    if (currentWordIndex < sessionWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Session complete
      const session: Session = {
        id: Date.now().toString(),
        type: sessionType,
        theme,
        words: sessionWords,
        score,
        totalWords: sessionWords.length,
        completedAt: new Date(),
        duration: Date.now() - sessionStartTime
      };
      onSessionComplete(session);
    }
  }, [currentWordIndex, sessionWords, sessionType, theme, score, sessionStartTime, onSessionComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (showResult) {
      nextWord();
    } else {
      checkAnswer();
    }
  };

  const question = sessionType === 'english-to-korean' ? currentWord.english : currentWord.korean;
  const expectedAnswer = sessionType === 'english-to-korean' ? currentWord.korean : currentWord.english;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} />
          <span>Back to Dashboard</span>
        </button>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {currentWordIndex + 1} of {sessionWords.length}
          </div>
          <div className="text-sm font-medium text-blue-600">
            Score: {score}/{sessionWords.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div 
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Main Practice Area */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="text-center mb-8">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
              {sessionType === 'english-to-korean' ? 'English → Korean' : 'Korean → English'}
            </span>
          </div>
          
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{question}</h2>
            {sessionType === 'korean-to-english' && currentWord.romanization && (
              <button
                onClick={() => setShowRomanization(!showRomanization)}
                className="flex items-center space-x-1 mx-auto text-gray-500 hover:text-gray-700 text-sm"
              >
                {showRomanization ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showRomanization ? 'Hide' : 'Show'} romanization</span>
              </button>
            )}
            {showRomanization && currentWord.romanization && (
              <p className="text-gray-500 text-lg mt-2">({currentWord.romanization})</p>
            )}
          </div>

          {showResult ? (
            <div className="mb-6">
              <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-lg font-medium ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isCorrect ? <Check size={20} /> : <X size={20} />}
                <span>{isCorrect ? 'Correct!' : 'Incorrect'}</span>
              </div>
              
              {!isCorrect && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Correct answer:</p>
                  <p className="text-xl font-semibold text-gray-900">{expectedAnswer}</p>
                  {sessionType === 'english-to-korean' && currentWord.romanization && (
                    <p className="text-gray-500 text-sm mt-1">({currentWord.romanization})</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="relative max-w-md mx-auto">
                {sessionType === 'english-to-korean' && (
                  <div className="flex items-center justify-center mb-2">
                    <button
                      type="button"
                      onClick={toggleInputMode}
                      className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      <Keyboard size={16} />
                      <span>{isKoreanMode ? 'Korean' : 'Roman'} input</span>
                    </button>
                  </div>
                )}
                
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    handleInputChange(e.target.value);
                  }}
                  className="w-full px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  placeholder={sessionType === 'english-to-korean' ? '한국어로 입력하세요' : 'Enter in English'}
                  autoFocus
                />
              </div>
              
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Check Answer
              </button>
            </form>
          )}
          
          {showResult && (
            <button
              onClick={nextWord}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {currentWordIndex < sessionWords.length - 1 ? 'Next Word' : 'Finish Session'}
            </button>
          )}
        </div>
      </div>

      {/* Word Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Theme: {theme}</span>
          <span>Difficulty: {currentWord.difficulty}</span>
        </div>
      </div>
    </div>
  );
}
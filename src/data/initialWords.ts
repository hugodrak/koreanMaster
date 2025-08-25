import { Word, Theme } from '../types';

export const themes: Theme[] = [
  {
    id: 'basics',
    name: 'Basic Words',
    description: 'Essential Korean vocabulary for beginners',
    color: '#3B82F6',
    wordCount: 20
  },
  {
    id: 'food',
    name: 'Food & Dining',
    description: 'Restaurant vocabulary and food items',
    color: '#EF4444',
    wordCount: 15
  },
  {
    id: 'family',
    name: 'Family & People',
    description: 'Family members and relationships',
    color: '#8B5CF6',
    wordCount: 12
  },
  {
    id: 'colors',
    name: 'Colors',
    description: 'Basic color vocabulary',
    color: '#10B981',
    wordCount: 10
  }
];

export const initialWords: Word[] = [
  // Basic Words
  { id: '1', english: 'hello', korean: '안녕하세요', romanization: 'annyeonghaseyo', theme: 'basics', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '2', english: 'goodbye', korean: '안녕히 가세요', romanization: 'annyeonghi gaseyo', theme: 'basics', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '3', english: 'thank you', korean: '감사합니다', romanization: 'gamsahamnida', theme: 'basics', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '4', english: 'yes', korean: '네', romanization: 'ne', theme: 'basics', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '5', english: 'no', korean: '아니요', romanization: 'aniyo', theme: 'basics', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '6', english: 'excuse me', korean: '실례합니다', romanization: 'sillyehamnida', theme: 'basics', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '7', english: 'sorry', korean: '죄송합니다', romanization: 'joesonghamnida', theme: 'basics', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '8', english: 'please', korean: '부탁합니다', romanization: 'butakhamnida', theme: 'basics', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  
  // Food & Dining
  { id: '9', english: 'rice', korean: '밥', romanization: 'bap', theme: 'food', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '10', english: 'water', korean: '물', romanization: 'mul', theme: 'food', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '11', english: 'kimchi', korean: '김치', romanization: 'gimchi', theme: 'food', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '12', english: 'bulgogi', korean: '불고기', romanization: 'bulgogi', theme: 'food', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '13', english: 'bibimbap', korean: '비빔밥', romanization: 'bibimbap', theme: 'food', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  
  // Family & People
  { id: '14', english: 'mother', korean: '어머니', romanization: 'eomeoni', theme: 'family', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '15', english: 'father', korean: '아버지', romanization: 'abeoji', theme: 'family', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '16', english: 'friend', korean: '친구', romanization: 'chingu', theme: 'family', difficulty: 'easy', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '17', english: 'teacher', korean: '선생님', romanization: 'seonsaengnim', theme: 'family', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  
  // Colors
  { id: '18', english: 'red', korean: '빨간색', romanization: 'ppalgansaek', theme: 'colors', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '19', english: 'blue', korean: '파란색', romanization: 'paransaek', theme: 'colors', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '20', english: 'white', korean: '흰색', romanization: 'huinsaek', theme: 'colors', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 },
  { id: '21', english: 'black', korean: '검은색', romanization: 'geomeunsaek', theme: 'colors', difficulty: 'medium', correctCount: 0, incorrectCount: 0, streak: 0 }
];
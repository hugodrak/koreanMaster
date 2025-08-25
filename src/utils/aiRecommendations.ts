import { Word, Session } from '../types';

export interface RecommendedWord {
  word: Word;
  priority: number;
  reason: string;
}

export function getAIRecommendations(
  words: Word[],
  recentSessions: Session[],
  userProgress: any
): RecommendedWord[] {
  const recommendations: RecommendedWord[] = [];

  words.forEach(word => {
    let priority = 0;
    let reasons: string[] = [];

    // Prioritize words with high error rate
    const totalAttempts = word.correctCount + word.incorrectCount;
    if (totalAttempts > 0) {
      const errorRate = word.incorrectCount / totalAttempts;
      if (errorRate > 0.5) {
        priority += 40;
        reasons.push('High error rate');
      }
    }

    // Prioritize words not reviewed recently
    if (!word.lastReviewed || isOlderThanDays(word.lastReviewed, 3)) {
      priority += 30;
      reasons.push('Due for review');
    }

    // Prioritize words with low streak
    if (word.streak < 3) {
      priority += 20;
      reasons.push('Needs reinforcement');
    }

    // Prioritize harder words
    if (word.difficulty === 'hard') {
      priority += 15;
    } else if (word.difficulty === 'medium') {
      priority += 10;
    }

    // Deprioritize words with high streak
    if (word.streak > 5) {
      priority -= 20;
    }

    if (priority > 10) {
      recommendations.push({
        word,
        priority,
        reason: reasons.join(', ')
      });
    }
  });

  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);
}

export function generateSessionWords(
  words: Word[],
  theme: string,
  count: number = 10
): Word[] {
  const themeWords = words.filter(word => word.theme === theme);
  const recommendations = getAIRecommendations(themeWords, [], {});
  
  // Mix recommended words with random selection
  const recommendedWords = recommendations.slice(0, Math.floor(count * 0.7)).map(r => r.word);
  const remainingCount = count - recommendedWords.length;
  
  const otherWords = themeWords
    .filter(word => !recommendedWords.includes(word))
    .sort(() => Math.random() - 0.5)
    .slice(0, remainingCount);

  return [...recommendedWords, ...otherWords].slice(0, count);
}

function isOlderThanDays(date: Date, days: number): boolean {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > days;
}
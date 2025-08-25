import { useState, useCallback } from 'react';

// Simple romanization to Hangul mapping for common characters
const romanToHangul: Record<string, string> = {
  'a': 'ㅏ', 'e': 'ㅓ', 'i': 'ㅣ', 'o': 'ㅗ', 'u': 'ㅜ',
  'ya': 'ㅑ', 'ye': 'ㅖ', 'yo': 'ㅛ', 'yu': 'ㅠ',
  'g': 'ㄱ', 'n': 'ㄴ', 'd': 'ㄷ', 'r': 'ㄹ', 'm': 'ㅁ',
  'b': 'ㅂ', 's': 'ㅅ', 'j': 'ㅈ', 'ch': 'ㅊ', 'k': 'ㅋ',
  't': 'ㅌ', 'p': 'ㅍ', 'h': 'ㅎ'
};

export function useKoreanInput() {
  const [input, setInput] = useState('');
  const [isKoreanMode, setIsKoreanMode] = useState(true);

  const handleInputChange = useCallback((value: string) => {
    setInput(value);
  }, []);

  const convertRomanToKorean = useCallback((romanText: string): string => {
    // This is a simplified conversion - in a real app, you'd use a proper IME
    let result = romanText;
    Object.entries(romanToHangul).forEach(([roman, hangul]) => {
      result = result.replace(new RegExp(roman, 'g'), hangul);
    });
    return result;
  }, []);

  const clearInput = useCallback(() => {
    setInput('');
  }, []);

  const toggleInputMode = useCallback(() => {
    setIsKoreanMode(prev => !prev);
  }, []);

  return {
    input,
    isKoreanMode,
    handleInputChange,
    convertRomanToKorean,
    clearInput,
    toggleInputMode
  };
}
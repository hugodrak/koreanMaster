import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { Word, Theme } from '../types';

interface WordManagementProps {
  words: Word[];
  themes: Theme[];
  onAddWord: (word: Omit<Word, 'id' | 'correctCount' | 'incorrectCount' | 'streak'>) => void;
  onEditWord: (word: Word) => void;
  onDeleteWord: (wordId: string) => void;
  onAddTheme: (theme: Omit<Theme, 'id' | 'wordCount'>) => void;
}

export function WordManagement({ words, themes, onAddWord, onEditWord, onDeleteWord, onAddTheme }: WordManagementProps) {
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddWord, setShowAddWord] = useState(false);
  const [showAddTheme, setShowAddTheme] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);

  const filteredWords = words.filter(word => {
    const matchesTheme = selectedTheme === 'all' || word.theme === selectedTheme;
    const matchesSearch = word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.korean.includes(searchTerm);
    return matchesTheme && matchesSearch;
  });

  const [newWord, setNewWord] = useState({
    english: '',
    korean: '',
    romanization: '',
    theme: themes[0]?.id || '',
    difficulty: 'medium' as const
  });

  const [newTheme, setNewTheme] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    onAddWord(newWord);
    setNewWord({
      english: '',
      korean: '',
      romanization: '',
      theme: themes[0]?.id || '',
      difficulty: 'medium'
    });
    setShowAddWord(false);
  };

  const handleEditWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWord) {
      onEditWord(editingWord);
      setEditingWord(null);
    }
  };

  const handleAddTheme = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTheme(newTheme);
    setNewTheme({
      name: '',
      description: '',
      color: '#3B82F6'
    });
    setShowAddTheme(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Word Management</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddTheme(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Add Theme
          </button>
          <button
            onClick={() => setShowAddWord(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Word</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none bg-white min-w-[150px]"
          >
            <option value="all">All Themes</option>
            {themes.map(theme => (
              <option key={theme.id} value={theme.id}>{theme.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Words Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">English</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Korean</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Romanization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Theme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWords.map((word) => (
                <tr key={word.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{word.english}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{word.korean}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{word.romanization}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {themes.find(t => t.id === word.theme)?.name || word.theme}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      word.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      word.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {word.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>✓{word.correctCount} ✗{word.incorrectCount}</div>
                    <div>Streak: {word.streak}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingWord(word)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteWord(word.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Word Modal */}
      {showAddWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Word</h3>
            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                <input
                  type="text"
                  value={newWord.english}
                  onChange={(e) => setNewWord({...newWord, english: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Korean</label>
                <input
                  type="text"
                  value={newWord.korean}
                  onChange={(e) => setNewWord({...newWord, korean: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Romanization (optional)</label>
                <input
                  type="text"
                  value={newWord.romanization}
                  onChange={(e) => setNewWord({...newWord, romanization: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  value={newWord.theme}
                  onChange={(e) => setNewWord({...newWord, theme: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  required
                >
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={newWord.difficulty}
                  onChange={(e) => setNewWord({...newWord, difficulty: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddWord(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Theme Modal */}
      {showAddTheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Theme</h3>
            <form onSubmit={handleAddTheme} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newTheme.name}
                  onChange={(e) => setNewTheme({...newTheme, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTheme.description}
                  onChange={(e) => setNewTheme({...newTheme, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  type="color"
                  value={newTheme.color}
                  onChange={(e) => setNewTheme({...newTheme, color: e.target.value})}
                  className="w-full h-10 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddTheme(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Add Theme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Word Modal */}
      {editingWord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Word</h3>
            <form onSubmit={handleEditWord} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English</label>
                <input
                  type="text"
                  value={editingWord.english}
                  onChange={(e) => setEditingWord({...editingWord, english: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Korean</label>
                <input
                  type="text"
                  value={editingWord.korean}
                  onChange={(e) => setEditingWord({...editingWord, korean: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Romanization</label>
                <input
                  type="text"
                  value={editingWord.romanization || ''}
                  onChange={(e) => setEditingWord({...editingWord, romanization: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  value={editingWord.theme}
                  onChange={(e) => setEditingWord({...editingWord, theme: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                  required
                >
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={editingWord.difficulty}
                  onChange={(e) => setEditingWord({...editingWord, difficulty: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingWord(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
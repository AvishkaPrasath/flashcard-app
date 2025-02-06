import React, { useState, useEffect } from 'react';

const FlashcardApp = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newCard, setNewCard] = useState({ question: '', answer: '' });

  // Load flashcards from local storage on initial render
  useEffect(() => {
    const savedCards = JSON.parse(localStorage.getItem('flashcards') || '[]');
    setFlashcards(savedCards);
  }, []);

  // Save flashcards to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const addCard = () => {
    if (newCard.question.trim() && newCard.answer.trim()) {
      const updatedCards = [...flashcards, { ...newCard }];
      setFlashcards(updatedCards);
      setNewCard({ question: '', answer: '' });
    }
  };

  const deleteCard = (indexToRemove) => {
    const updatedCards = flashcards.filter((_, index) => index !== indexToRemove);
    setFlashcards(updatedCards);
    
    // Reset index if needed
    if (currentCardIndex >= updatedCards.length) {
      setCurrentCardIndex(Math.max(0, updatedCards.length - 1));
    }
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentCardIndex(0);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => 
      (prev + 1) % (flashcards.length || 1)
    );
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => 
      prev > 0 ? prev - 1 : (flashcards.length - 1)
    );
    setIsFlipped(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Flashcard Study App</h1>
      
      {/* New Card Input */}
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Question" 
          value={newCard.question}
          onChange={(e) => setNewCard(prev => ({ ...prev, question: e.target.value }))}
          className="w-full p-2 border rounded mb-2"
        />
        <input 
          type="text" 
          placeholder="Answer" 
          value={newCard.answer}
          onChange={(e) => setNewCard(prev => ({ ...prev, answer: e.target.value }))}
          className="w-full p-2 border rounded mb-2"
        />
        <button 
          onClick={addCard} 
          className="w-full bg-green-500 text-white p-2 rounded flex items-center justify-center"
        >
          + Add Card
        </button>
      </div>

      {/* Flashcard Display */}
      {flashcards.length > 0 ? (
        <div className="relative">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`
              transition-all duration-500 
              ${isFlipped ? 'rotate-y-180' : ''}
              bg-blue-100 p-6 rounded-lg 
              cursor-pointer min-h-[200px] flex 
              items-center justify-center text-center
            `}
          >
            {isFlipped 
              ? flashcards[currentCardIndex].answer 
              : flashcards[currentCardIndex].question
            }
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-4">
            <button 
              onClick={prevCard} 
              className="bg-gray-200 p-2 rounded"
            >
              Previous
            </button>
            <div className="flex space-x-2">
              <button 
                onClick={shuffleCards} 
                className="bg-yellow-500 text-white p-2 rounded"
              >
                🔀 Shuffle
              </button>
              <button 
                onClick={() => setIsFlipped(!isFlipped)} 
                className="bg-blue-500 text-white p-2 rounded"
              >
                ↔️ Flip
              </button>
              <button 
                onClick={() => deleteCard(currentCardIndex)} 
                className="bg-red-500 text-white p-2 rounded"
              >
                🗑️ Delete
              </button>
            </div>
            <button 
              onClick={nextCard} 
              className="bg-gray-200 p-2 rounded"
            >
              Next
            </button>
          </div>

          {/* Card Counter */}
          <div className="text-center mt-2 text-gray-600">
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No flashcards. Add a new card to get started!
        </p>
      )}
    </div>
  );
};

export default FlashcardApp;

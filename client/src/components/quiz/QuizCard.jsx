import React from 'react';
import ChoiceButton from './ChoiceButton.jsx';
import FeedbackBox from './FeedbackBox.jsx';

export default function QuizCard({
  quiz,
  quizNumber,
  totalCount,
  selectedPosition,
  onSelect,
}) {
  const isAnswered = Boolean(selectedPosition);

  return (
    <article className="quiz-card">
      <header className="quiz-header">
        <span className="quiz-count">
          {quizNumber} / {totalCount}
        </span>
        <h1>{quiz.question}</h1>
      </header>

      <div className="choice-grid">
        {quiz.choices.map((choice, index) => (
          <ChoiceButton
            key={choice.position}
            choice={choice}
            index={index}
            isAnswered={isAnswered}
            isSelected={selectedPosition === choice.position}
            isCorrect={quiz.answerPosition === choice.position}
            onSelect={onSelect}
          />
        ))}
      </div>

      <FeedbackBox
        selectedPosition={selectedPosition}
        answerPosition={quiz.answerPosition}
        correctAnswer={quiz.correctAnswer}
        explanation={quiz.explanation}
      />
    </article>
  );
}

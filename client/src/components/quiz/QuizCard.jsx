import React from 'react';
import RichText from '../common/RichText.jsx';
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
        <div className="quiz-question" role="heading" aria-level="1">
          <RichText source={quiz.question} />
        </div>
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

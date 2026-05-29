import React from 'react';

export default function FeedbackBox({ selectedPosition, answerPosition, correctAnswer, explanation }) {
  if (!selectedPosition) {
    return null;
  }

  const isCorrect = selectedPosition === answerPosition;

  return (
    <section className={`feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`}>
      <p className="feedback-title">{isCorrect ? '정답입니다' : '오답입니다'}</p>
      <p className="feedback-answer">정답: {correctAnswer}</p>
      <p className="feedback-explanation">{explanation}</p>
    </section>
  );
}

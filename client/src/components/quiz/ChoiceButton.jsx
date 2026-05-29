import { Check, X } from 'lucide-react';
import React from 'react';

const labelByIndex = ['A', 'B', 'C', 'D'];

export default function ChoiceButton({
  choice,
  index,
  isAnswered,
  isSelected,
  isCorrect,
  onSelect,
}) {
  const stateClass = getStateClass({ isAnswered, isSelected, isCorrect });

  return (
    <button
      type="button"
      className={`choice-button ${stateClass}`}
      disabled={isAnswered}
      onClick={() => onSelect(choice.position)}
    >
      <span className="choice-letter">{labelByIndex[index] || index + 1}</span>
      <span className="choice-text">{choice.text}</span>
      <span className="choice-result" aria-hidden="true">
        {isAnswered && isCorrect ? <Check size={18} /> : null}
        {isAnswered && isSelected && !isCorrect ? <X size={18} /> : null}
      </span>
    </button>
  );
}

function getStateClass({ isAnswered, isSelected, isCorrect }) {
  if (!isAnswered) {
    return 'choice-idle';
  }

  if (isCorrect) {
    return 'choice-correct';
  }

  if (isSelected) {
    return 'choice-incorrect';
  }

  return 'choice-muted';
}

import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { statusOptions } from '../../constants/adminOptions.js';

export function LoadingRows() {
  return (
    <div className="loading-block">
      <LoaderCircle className="spin" size={20} />
      <span>불러오는 중</span>
    </div>
  );
}

export function StatusBadge({ status }) {
  const option = statusOptions.find((item) => item.value === status);
  return <span className={`status-badge ${status}`}>{option?.label || status}</span>;
}

export function CompletionBadge({ quizSet }) {
  return (
    <span className={`completion-badge ${quizSet.isComplete ? 'complete' : ''}`}>
      {quizSet.quizCount}/{quizSet.requiredQuizCount}
    </span>
  );
}

import { RotateCcw } from 'lucide-react';

export default function ResultSummary({ correctCount, totalCount, onRetry }) {
  return (
    <section className="result-summary">
      <span className="result-kicker">완료</span>
      <h1>
        {totalCount}문제 중 {correctCount}문제를 맞혔습니다
      </h1>
      <p>처음부터 다시 풀면서 정답과 해설을 다시 확인할 수 있습니다.</p>
      <button type="button" className="primary-action" onClick={onRetry}>
        <RotateCcw size={18} />
        다시 풀기
      </button>
    </section>
  );
}

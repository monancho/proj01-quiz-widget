import { ArrowRight, LoaderCircle, RefreshCw } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchEmbedQuizzes } from '../api/embedApi.js';
import QuizCard from '../components/quiz/QuizCard.jsx';
import ResultSummary from '../components/quiz/ResultSummary.jsx';
import StaticBanner from '../components/quiz/StaticBanner.jsx';

export default function EmbedQuizPage({ postSlug }) {
  const [quizzes, setQuizzes] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    setStatus('loading');
    setErrorMessage('');
    setCurrentIndex(0);
    setAnswers({});

    fetchEmbedQuizzes(postSlug, controller.signal)
      .then((items) => {
        setQuizzes(items);
        setStatus(items.length > 0 ? 'ready' : 'empty');
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          return;
        }

        setErrorMessage('문제를 불러오지 못했습니다.');
        setStatus('error');
      });

    return () => controller.abort();
  }, [postSlug]);

  const currentQuiz = quizzes[currentIndex];
  const selectedPosition = currentQuiz ? answers[currentQuiz.id] : undefined;
  const isAnswered = Boolean(selectedPosition);
  const isLastQuiz = currentIndex === quizzes.length - 1;
  const correctCount = useMemo(
    () =>
      quizzes.reduce((count, quiz) => {
        return count + (answers[quiz.id] === quiz.answerPosition ? 1 : 0);
      }, 0),
    [answers, quizzes],
  );

  function handleSelect(position) {
    if (!currentQuiz || answers[currentQuiz.id]) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuiz.id]: position,
    }));
  }

  function handleNext() {
    if (!isAnswered) {
      return;
    }

    if (isLastQuiz) {
      setStatus('completed');
      return;
    }

    setCurrentIndex((value) => value + 1);
  }

  function handleRetry() {
    setCurrentIndex(0);
    setAnswers({});
    setStatus(quizzes.length > 0 ? 'ready' : 'empty');
  }

  return (
    <main className="embed-shell antialiased">
      <div className="embed-panel">
        {status === 'loading' ? <StateMessage icon={<LoaderCircle className="spin" />} title="불러오는 중" /> : null}
        {status === 'empty' ? <StateMessage title="공개된 문제가 없습니다" /> : null}
        {status === 'error' ? (
          <StateMessage
            icon={<RefreshCw />}
            title={errorMessage}
            actionLabel="다시 시도"
            onAction={() => window.location.reload()}
          />
        ) : null}
        {status === 'ready' && currentQuiz ? (
          <>
            <QuizCard
              quiz={currentQuiz}
              quizNumber={currentIndex + 1}
              totalCount={quizzes.length}
              selectedPosition={selectedPosition}
              onSelect={handleSelect}
            />
            <div className="quiz-actions">
              <button type="button" className="primary-action" disabled={!isAnswered} onClick={handleNext}>
                {isLastQuiz ? '결과 보기' : '다음 문제'}
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : null}
        {status === 'completed' ? (
          <ResultSummary correctCount={correctCount} totalCount={quizzes.length} onRetry={handleRetry} />
        ) : null}
      </div>

      <StaticBanner />
    </main>
  );
}

function StateMessage({ icon, title, actionLabel, onAction }) {
  return (
    <section className="state-message">
      {icon ? <span className="state-icon">{icon}</span> : null}
      <h1>{title}</h1>
      {actionLabel ? (
        <button type="button" className="secondary-action" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}

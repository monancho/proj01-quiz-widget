import {
  Check,
  Code2,
  Copy,
  Edit3,
  ExternalLink,
  Filter,
  GripVertical,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { embedThemeOptions, statusOptions } from '../constants/adminOptions.js';
import { CompletionBadge, LoadingRows, StatusBadge } from '../components/admin/AdminIndicators.jsx';
import RichText from '../components/common/RichText.jsx';
import QuizCard from '../components/quiz/QuizCard.jsx';
import { buildEmbedUrl, buildIframeCode } from '../utils/embedTools.js';
import { getMarkdownContinuation } from '../utils/markdownAuthoring.js';
import {
  checkPostSlug,
  createQuiz,
  createQuizSet,
  deleteQuiz,
  deleteQuizSet,
  generateTextQuizzes,
  generateWebQuizzes,
  generateYoutubeQuizzes,
  getQuiz,
  listQuizSets,
  listQuizzes,
  reorderQuizzes,
  updateQuiz,
  updateQuizSet,
} from '../api/adminApi.js';

const emptySetForm = {
  id: null,
  postSlug: '',
  postTitle: '',
  status: 'draft',
};

const emptyQuizForm = {
  id: null,
  setId: null,
  question: '',
  choices: ['', '', '', ''],
  correctPosition: 1,
  explanation: '',
};

const aiSourceOptions = [
  { value: 'text', label: '텍스트' },
  { value: 'web', label: '웹 URL' },
  { value: 'youtube', label: 'YouTube' },
];

const aiDifficultyOptions = [
  { value: 'beginner', label: 'beginner' },
  { value: 'intermediate', label: 'intermediate' },
  { value: 'advanced', label: 'advanced' },
];

const aiErrorMessages = {
  SOURCE_TEXT_TOO_SHORT: '내용이 너무 짧습니다. 문제를 만들 수 있도록 더 긴 내용을 입력하세요.',
  SOURCE_TEXT_TOO_LONG: '입력 내용이 너무 깁니다. 핵심 부분만 남기고 줄여서 다시 시도하세요.',
  WEB_URL_INVALID: '올바른 웹 URL을 입력하세요.',
  WEB_URL_BLOCKED: '허용되지 않는 URL입니다. 다른 페이지를 사용하세요.',
  WEB_CONTENT_EXTRACT_FAILED: '페이지 내용을 가져오지 못했습니다. 직접 입력하거나 다른 페이지를 사용하세요.',
  YOUTUBE_URL_INVALID: '올바른 YouTube URL을 입력하세요.',
  YOUTUBE_TRANSCRIPT_NOT_FOUND: '자막이 있는 YouTube 영상을 사용하세요.',
  AI_RATE_LIMIT_EXCEEDED: '요청이 잠시 많습니다. 조금 후 다시 시도하세요.',
  AI_DAILY_USAGE_LIMIT_EXCEEDED: '오늘 AI 생성 사용량이 제한되었습니다. 나중에 다시 시도하세요.',
  QUIZ_GENERATION_FAILED: '퀴즈 생성에 실패했습니다. 다시 시도하세요.',
  OUTPUT_SCHEMA_INVALID: 'AI 응답 구조가 올바르지 않습니다. 다시 시도하세요.',
  AI_GENERATION_REQUIRES_EMPTY_SET: 'AI 생성은 문제가 없는 빈 Slug Group에서만 사용할 수 있습니다.',
};

const aiWarningMessages = {
  CONTENT_TRUNCATED: '일부 콘텐츠가 길어 잘린 상태로 사용되었습니다.',
  YOUTUBE_AUTO_TRANSCRIPT_USED: '자동 생성 자막을 사용했습니다.',
};

function getAiErrorMessage(error) {
  return aiErrorMessages[error?.code] || 'AI 퀴즈 생성에 실패했습니다. 잠시 후 다시 시도하세요.';
}

function getAiWarningMessage(warning) {
  if (!warning) {
    return '';
  }

  return aiWarningMessages[warning] || warning;
}

function getAiLoadingCopy(sourceType) {
  if (sourceType === 'web') {
    return {
      title: '웹 페이지를 읽고 3문항을 만들고 있습니다.',
      description: '본문 추출과 문제 저장까지 한 번에 처리합니다. 페이지 길이에 따라 수십 초 걸릴 수 있습니다.',
    };
  }

  if (sourceType === 'youtube') {
    return {
      title: 'YouTube 자막을 확인하고 3문항을 만들고 있습니다.',
      description: '자막 확인, 문제 생성, 저장을 순서대로 처리합니다. 이 창을 닫지 말고 잠시 기다려주세요.',
    };
  }

  return {
    title: '입력한 텍스트로 3문항을 만들고 있습니다.',
    description: '문제와 보기, 해설을 생성한 뒤 바로 Slug Group에 저장합니다.',
  };
}

export default function AdminQuizManagerPage() {
  const [filters, setFilters] = useState({ query: '', status: '' });
  const [draftFilters, setDraftFilters] = useState({ query: '', status: '' });
  const [summary, setSummary] = useState(null);
  const [quizSets, setQuizSets] = useState([]);
  const [expandedSetId, setExpandedSetId] = useState(null);
  const [quizzesBySetId, setQuizzesBySetId] = useState({});
  const [setModal, setSetModal] = useState(null);
  const [quizModal, setQuizModal] = useState(null);
  const [aiModal, setAiModal] = useState(null);
  const [aiNotice, setAiNotice] = useState(null);
  const [utilityModal, setUtilityModal] = useState(null);
  const [draggedQuizId, setDraggedQuizId] = useState(null);
  const draggedQuizIdRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuizSets();
  }, [filters]);

  function handleResetAdminView() {
    setSummary(null);
    setQuizSets([]);
    setExpandedSetId(null);
    setQuizzesBySetId({});
    setSetModal(null);
    setQuizModal(null);
    setUtilityModal(null);
    setError('');
    setMessage('');
  }

  async function loadQuizSets() {
    setLoading(true);
    setError('');

    try {
      const data = await listQuizSets(filters);
      setSummary(data.summary);
      setQuizSets(data.items);

      const nextSelectedId = expandedSetId && data.items.some((item) => item.id === expandedSetId)
        ? expandedSetId
        : data.items[0]?.id;

      if (nextSelectedId) {
        setExpandedSetId(nextSelectedId);
        await loadQuizzes(nextSelectedId);
      } else {
        setExpandedSetId(null);
      }
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadQuizzes(setId) {
    setError('');

    try {
      const data = await listQuizzes(setId);
      setQuizzesBySetId((current) => ({
        ...current,
        [setId]: data.items,
      }));
    } catch (apiError) {
      setError(apiError.message);
    }
  }

  async function handleExpand(setId) {
    setExpandedSetId(setId);

    if (!quizzesBySetId[setId]) {
      await loadQuizzes(setId);
    }
  }

  function openCreateSetModal() {
    setSetModal({
      mode: 'create',
      form: { ...emptySetForm },
      quizCount: 0,
      slugCheck: null,
      error: '',
    });
  }

  function openEditSetModal(quizSet) {
    setSetModal({
      mode: 'edit',
      form: {
        id: quizSet.id,
        postSlug: quizSet.postSlug,
        postTitle: quizSet.postTitle,
        status: quizSet.isComplete ? quizSet.status : 'draft',
      },
      quizCount: quizSet.quizCount,
      originalSlug: quizSet.postSlug,
      slugCheck: null,
      error: '',
    });
  }

  async function handleCheckSlug() {
    if (!setModal?.form.postSlug.trim()) {
      setSetModal((current) => ({ ...current, slugCheck: null, error: 'post_slug를 입력하세요.' }));
      return;
    }

    try {
      const result = await checkPostSlug(setModal.form.postSlug, setModal.form.id);
      setSetModal((current) => ({ ...current, slugCheck: result, error: '' }));
    } catch (apiError) {
      setSetModal((current) => ({ ...current, slugCheck: null, error: apiError.message }));
    }
  }

  async function handleSaveSet(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');

    try {
      const payload = {
        postSlug: setModal.form.postSlug,
        postTitle: setModal.form.postTitle,
        status: setModal.quizCount === 3 ? setModal.form.status : 'draft',
      };

      const saved = setModal.mode === 'create'
        ? await createQuizSet(payload)
        : await updateQuizSet(setModal.form.id, payload);

      setSetModal(null);
      setExpandedSetId(saved.id);
      await loadQuizSets();
      await loadQuizzes(saved.id);
    } catch (apiError) {
      setSetModal((current) => ({ ...current, error: apiError.message }));
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteSet(quizSet) {
    if (!window.confirm(`${quizSet.postSlug} Slug Group을 삭제할까요?`)) {
      return;
    }

    setBusy(true);
    setMessage('');
    setError('');

    try {
      await deleteQuizSet(quizSet.id);
      setExpandedSetId(null);
      await loadQuizSets();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  function openCreateQuizModal(quizSet) {
    setQuizModal({
      mode: 'create',
      postSlug: quizSet.postSlug,
      form: {
        ...emptyQuizForm,
        setId: quizSet.id,
      },
      error: '',
    });
  }

  function openAiGenerateModal(quizSet, quizzes) {
    if (!quizSet || quizzes.length > 0) {
      return;
    }

    setAiModal({
      setId: quizSet.id,
      postSlug: quizSet.postSlug,
      sourceType: 'text',
      difficulty: 'beginner',
      content: '',
      url: '',
      error: '',
    });
  }

  async function handleGenerateAiQuizzes(event) {
    event.preventDefault();

    if (!aiModal || busy) {
      return;
    }

    setBusy(true);
    setMessage('');
    setError('');
    setAiModal((current) => ({ ...current, error: '' }));

    try {
      const difficulty = aiModal.difficulty;
      const result = aiModal.sourceType === 'text'
        ? await generateTextQuizzes(aiModal.setId, { content: aiModal.content, difficulty })
        : aiModal.sourceType === 'web'
          ? await generateWebQuizzes(aiModal.setId, { url: aiModal.url, difficulty })
          : await generateYoutubeQuizzes(aiModal.setId, { url: aiModal.url, difficulty });

      const warning = result.warning || result.source?.warning;
      const warningMessage = getAiWarningMessage(warning);

      setAiNotice(warningMessage ? { setId: aiModal.setId, message: warningMessage } : null);
      setAiModal(null);
      setMessage('AI가 3문항을 생성했습니다.');
      await loadQuizzes(aiModal.setId);
      await loadQuizSets();
    } catch (apiError) {
      setAiModal((current) => (current ? { ...current, error: getAiErrorMessage(apiError) } : current));
    } finally {
      setBusy(false);
    }
  }

  async function openEditQuizModal(quiz, quizSet) {
    setBusy(true);
    setError('');

    try {
      const detail = await getQuiz(quiz.id);
      setQuizModal({
        mode: 'edit',
        postSlug: quizSet.postSlug,
        form: {
          id: detail.id,
          setId: detail.quizSetId,
          question: detail.question,
          choices: detail.choices,
          correctPosition: detail.correctPosition,
          explanation: detail.explanation,
        },
        error: '',
      });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveQuiz(event) {
    event.preventDefault();
    setBusy(true);

    try {
      const payload = {
        question: quizModal.form.question,
        choices: quizModal.form.choices,
        correctPosition: Number(quizModal.form.correctPosition),
        explanation: quizModal.form.explanation,
      };

      const saved = quizModal.mode === 'create'
        ? await createQuiz(quizModal.form.setId, payload)
        : await updateQuiz(quizModal.form.id, payload);

      setQuizModal(null);
      await loadQuizzes(saved.quizSetId);
      await loadQuizSets();
    } catch (apiError) {
      setQuizModal((current) => ({ ...current, error: apiError.message }));
    } finally {
      setBusy(false);
    }
  }

  async function handleDeleteQuiz(quiz, setId) {
    if (!window.confirm(`${quiz.sortOrder}번 문제를 삭제할까요?`)) {
      return;
    }

    setBusy(true);
    setError('');

    try {
      await deleteQuiz(quiz.id);
      await loadQuizzes(setId);
      await loadQuizSets();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  function handleDragStartQuiz(quizId) {
    draggedQuizIdRef.current = quizId;
    setDraggedQuizId(quizId);
  }

  async function handleDropQuiz(quizSet, targetQuizId) {
    const sourceQuizId = draggedQuizIdRef.current;

    if (!sourceQuizId || sourceQuizId === targetQuizId) {
      draggedQuizIdRef.current = null;
      setDraggedQuizId(null);
      return;
    }

    const currentQuizzes = quizzesBySetId[quizSet.id] || [];
    const sourceIndex = currentQuizzes.findIndex((quiz) => quiz.id === sourceQuizId);
    const targetIndex = currentQuizzes.findIndex((quiz) => quiz.id === targetQuizId);

    if (sourceIndex === -1 || targetIndex === -1) {
      draggedQuizIdRef.current = null;
      setDraggedQuizId(null);
      return;
    }

    const nextQuizzes = [...currentQuizzes];
    const [moved] = nextQuizzes.splice(sourceIndex, 1);
    nextQuizzes.splice(targetIndex, 0, moved);

    setQuizzesBySetId((current) => ({
      ...current,
      [quizSet.id]: nextQuizzes.map((quiz, index) => ({ ...quiz, sortOrder: index + 1 })),
    }));

    draggedQuizIdRef.current = null;
    setDraggedQuizId(null);
    setBusy(true);

    try {
      const result = await reorderQuizzes(quizSet.id, nextQuizzes.map((quiz) => quiz.id));
      setQuizzesBySetId((current) => ({
        ...current,
        [quizSet.id]: result.items,
      }));
    } catch (apiError) {
      setError(apiError.message);
      await loadQuizzes(quizSet.id);
    } finally {
      setBusy(false);
    }
  }

  function openEmbedToolsModal(quizSet) {
    setUtilityModal({
      quizSet,
      themeMode: 'system',
    });
  }

  function handleChangeEmbedTheme(themeMode) {
    setUtilityModal((current) => (current ? { ...current, themeMode } : current));
  }

  async function handleCopyIframeCode(iframeCode) {
    if (!iframeCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(iframeCode);
    } catch {
      // The code field is selected by the caller so manual copy remains available.
    }
  }

  function handleFilterSubmit(event) {
    event.preventDefault();
    setFilters({
      query: draftFilters.query.trim(),
      status: draftFilters.status,
    });
  }

  const selectedSet = useMemo(
    () => quizSets.find((quizSet) => quizSet.id === expandedSetId),
    [expandedSetId, quizSets],
  );
  const selectedQuizzes = selectedSet ? quizzesBySetId[selectedSet.id] || [] : [];

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar" aria-label="관리자 탐색">
        <div className="admin-sidebar-brand">
          <span>Quiz Admin</span>
        </div>
        <nav className="admin-sidebar-nav">
          <button type="button" className="admin-nav-item active" aria-current="page">
            <LayoutDashboard size={18} />
            대시보드
          </button>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">Quiz Widget Admin</p>
            <h1>Slug Group 관리</h1>
          </div>
          <div className="admin-topbar-actions">
            <button type="button" className="admin-button secondary" onClick={loadQuizSets}>
              <RefreshCw size={17} />
              새로고침
            </button>
            <button type="button" className="admin-button secondary" onClick={handleResetAdminView}>
              <LogOut size={17} />
              초기화
            </button>
            <button type="button" className="admin-button primary" onClick={openCreateSetModal}>
              <Plus size={17} />
              Slug Group
            </button>
          </div>
        </header>

        <StatusStrip message={message} error={error} busy={busy || loading} />

        <section className="admin-toolbar">
          <form className="admin-filter-form" onSubmit={handleFilterSubmit}>
            <label>
              <span>검색</span>
              <div className="admin-input-with-icon">
                <Search size={16} />
                <input
                  value={draftFilters.query}
                  onChange={(event) => setDraftFilters((current) => ({ ...current, query: event.target.value }))}
                  placeholder="post_slug 또는 제목"
                />
              </div>
            </label>
            <label>
              <span>상태</span>
              <select
                value={draftFilters.status}
                onChange={(event) => setDraftFilters((current) => ({ ...current, status: event.target.value }))}
              >
                <option value="">전체</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <button type="submit" className="admin-button secondary">
              <Filter size={17} />
              적용
            </button>
          </form>
        </section>

        <StatsBar summary={summary} />

        <section className="admin-workspace">
          <div className="admin-list-panel">
            <div className="panel-heading">
              <h2>Slug Groups</h2>
              <span>{quizSets.length}개</span>
            </div>
            {loading ? <LoadingRows /> : null}
            {!loading && quizSets.length === 0 ? <p className="admin-empty">조건에 맞는 Slug Group이 없습니다.</p> : null}
            {!loading && quizSets.map((quizSet) => (
              <button
                type="button"
                key={quizSet.id}
                className={`slug-row ${expandedSetId === quizSet.id ? 'active' : ''}`}
                onClick={() => handleExpand(quizSet.id)}
              >
                <span>
                  <strong>{quizSet.postSlug}</strong>
                  <small>{quizSet.postTitle}</small>
                </span>
                <StatusBadge status={quizSet.status} />
                <CompletionBadge quizSet={quizSet} />
              </button>
            ))}
          </div>

          <div className="admin-detail-panel">
            {!selectedSet ? (
              <p className="admin-empty">Slug Group을 선택하세요.</p>
            ) : (
              <SetDetail
                quizSet={selectedSet}
                quizzes={selectedQuizzes}
                aiNotice={aiNotice?.setId === selectedSet.id ? aiNotice.message : ''}
                draggedQuizId={draggedQuizId}
                onDragStart={handleDragStartQuiz}
                onDropQuiz={handleDropQuiz}
                onEditSet={() => openEditSetModal(selectedSet)}
                onDeleteSet={() => handleDeleteSet(selectedSet)}
                onNewQuiz={() => openCreateQuizModal(selectedSet)}
                onAiGenerate={() => openAiGenerateModal(selectedSet, selectedQuizzes)}
                onEditQuiz={(quiz) => openEditQuizModal(quiz, selectedSet)}
                onDeleteQuiz={(quiz) => handleDeleteQuiz(quiz, selectedSet.id)}
                onEmbedTools={() => openEmbedToolsModal(selectedSet)}
              />
            )}
          </div>
        </section>
      </div>

      {setModal ? (
        <SetModal
          modal={setModal}
          setModal={setSetModal}
          onSubmit={handleSaveSet}
          onCancel={() => setSetModal(null)}
          onCheckSlug={handleCheckSlug}
          busy={busy}
        />
      ) : null}

      {quizModal ? (
        <QuizModal
          quizModal={quizModal}
          setQuizModal={setQuizModal}
          onSubmit={handleSaveQuiz}
          onCancel={() => setQuizModal(null)}
          busy={busy}
        />
      ) : null}

      {aiModal ? (
        <AiGenerateModal
          modal={aiModal}
          setModal={setAiModal}
          onSubmit={handleGenerateAiQuizzes}
          onCancel={() => setAiModal(null)}
          busy={busy}
        />
      ) : null}

      {utilityModal ? (
        <UtilityModal
          modal={utilityModal}
          onClose={() => setUtilityModal(null)}
          onThemeChange={handleChangeEmbedTheme}
          onCopy={handleCopyIframeCode}
        />
      ) : null}
    </main>
  );
}

function StatusStrip({ message, error, busy }) {
  if (!message && !error && !busy) {
    return null;
  }

  return (
    <section className={`admin-status ${error ? 'error' : ''}`}>
      {busy ? <LoaderCircle className="spin" size={17} /> : null}
      <span>{error || message || '처리 중입니다.'}</span>
    </section>
  );
}

function StatsBar({ summary }) {
  const items = [
    ['전체', summary?.totalSets || 0],
    ['준비중', summary?.draftSets || 0],
    ['공개', summary?.publishedSets || 0],
    ['비공개', summary?.privateSets || 0],
  ];

  return (
    <section className="admin-stats">
      {items.map(([label, value]) => (
        <div key={label} className="stat-item">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

function SetDetail({
  quizSet,
  quizzes,
  aiNotice,
  draggedQuizId,
  onDragStart,
  onDropQuiz,
  onEditSet,
  onDeleteSet,
  onNewQuiz,
  onAiGenerate,
  onEditQuiz,
  onDeleteQuiz,
  onEmbedTools,
}) {
  const aiDisabled = quizzes.length > 0;

  return (
    <>
      <div className="detail-heading">
        <div>
          <div className="detail-title-line">
            <h2>{quizSet.postSlug}</h2>
            <StatusBadge status={quizSet.status} />
            <CompletionBadge quizSet={quizSet} />
          </div>
          <p>{quizSet.postTitle}</p>
        </div>
        <div className="detail-actions">
          <button type="button" className="icon-action" onClick={onEmbedTools} title="iframe 미리보기 및 코드 복사">
            <Code2 size={17} />
          </button>
          <button type="button" className="icon-action" onClick={onEditSet} title="Slug Group 수정">
            <Edit3 size={17} />
          </button>
          <button type="button" className="icon-action danger" onClick={onDeleteSet} title="Slug Group 삭제">
            <Trash2 size={17} />
          </button>
        </div>
      </div>

      {aiNotice ? <p className="form-warning ai-generation-notice">{aiNotice}</p> : null}

      <div className="quiz-table-header">
        <h3>Quizzes</h3>
        <div className="quiz-table-actions">
          <button
            type="button"
            className="admin-button secondary"
            disabled={aiDisabled}
            onClick={onAiGenerate}
            title={aiDisabled ? 'AI 생성은 문제가 없는 빈 Slug Group에서만 사용할 수 있습니다.' : 'AI로 3문항 생성'}
          >
            <Sparkles size={17} />
            AI 생성
          </button>
          <button type="button" className="admin-button primary" disabled={quizzes.length >= 3} onClick={onNewQuiz}>
            <Plus size={17} />
            문제 추가
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table className="quiz-table">
          <thead>
            <tr>
              <th>이동</th>
              <th>순서</th>
              <th>문제</th>
              <th>정답</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan="5">등록된 문제가 없습니다.</td>
              </tr>
            ) : quizzes.map((quiz) => (
              <tr
                key={quiz.id}
                className={draggedQuizId === quiz.id ? 'dragging-row' : ''}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = 'move';
                }}
                onDrop={() => onDropQuiz(quizSet, quiz.id)}
              >
                <td className="drag-cell" title="드래그해서 순서 변경">
                  <button
                    type="button"
                    className="drag-handle"
                    draggable
                    aria-label={`${quiz.sortOrder}번 문제 순서 변경`}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      event.dataTransfer.setData('text/plain', String(quiz.id));
                      onDragStart(quiz.id);
                    }}
                    onDragEnd={() => onDragStart(null)}
                  >
                    <GripVertical size={17} />
                  </button>
                </td>
                <td>{quiz.sortOrder}</td>
                <td>
                  <RichText source={quiz.question} inline />
                </td>
                <td>
                  <RichText source={quiz.choices[quiz.correctPosition - 1]} inline />
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-action" onClick={() => onEditQuiz(quiz)} title="문제 수정">
                      <Edit3 size={16} />
                    </button>
                    <button type="button" className="icon-action danger" onClick={() => onDeleteQuiz(quiz)} title="문제 삭제">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SetModal({ modal, setModal, onSubmit, onCancel, onCheckSlug, busy }) {
  const isComplete = modal.quizCount === 3;
  const slugChanged = modal.mode === 'edit' && modal.originalSlug !== modal.form.postSlug;

  return (
    <div className="modal-backdrop">
      <form className="admin-modal" onSubmit={onSubmit}>
        <div className="modal-heading">
          <h2>{modal.mode === 'create' ? 'Slug Group 생성' : 'Slug Group 수정'}</h2>
          <button type="button" className="icon-action" onClick={onCancel} title="닫기">
            <X size={18} />
          </button>
        </div>
        {slugChanged ? <p className="form-warning">post_slug 변경 시 기존 iframe URL이 달라집니다.</p> : null}
        {!isComplete ? <p className="form-warning">문제 3개가 모두 등록되기 전에는 자동으로 준비중 상태로 관리됩니다.</p> : null}
        {modal.error ? <p className="form-error">{modal.error}</p> : null}
        <label>
          <span>post_slug</span>
          <div className="slug-check-row">
            <input
              required
              value={modal.form.postSlug}
              onChange={(event) => setModal((current) => ({
                ...current,
                slugCheck: null,
                form: { ...current.form, postSlug: event.target.value },
              }))}
              placeholder="my-tistory-post"
            />
            <button type="button" className="admin-button secondary" onClick={onCheckSlug}>
              중복 확인
            </button>
          </div>
        </label>
        {modal.slugCheck ? (
          <p className={modal.slugCheck.available ? 'form-ok' : 'form-error'}>
            {modal.slugCheck.available ? '사용 가능한 slug입니다.' : '이미 사용 중인 slug입니다.'}
          </p>
        ) : null}
        <label>
          <span>post_title</span>
          <input
            required
            value={modal.form.postTitle}
            onChange={(event) => setModal((current) => ({
              ...current,
              form: { ...current.form, postTitle: event.target.value },
            }))}
            placeholder="티스토리 글 제목"
          />
        </label>
        {isComplete ? (
          <label>
            <span>status</span>
            <select
              value={modal.form.status}
              onChange={(event) => setModal((current) => ({
                ...current,
                form: { ...current.form, status: event.target.value },
              }))}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <div className="readonly-status">
            <span>status</span>
            <strong>준비중</strong>
          </div>
        )}
        <div className="modal-actions">
          <button type="button" className="admin-button secondary" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="admin-button primary" disabled={busy}>
            <Check size={17} />
            저장
          </button>
        </div>
      </form>
    </div>
  );
}

function QuizModal({ quizModal, setQuizModal, onSubmit, onCancel, busy }) {
  const form = quizModal.form;

  function updateForm(patch) {
    setQuizModal((current) => ({
      ...current,
      form: {
        ...current.form,
        ...patch,
      },
    }));
  }

  function updateChoice(index, value) {
    const nextChoices = [...form.choices];
    nextChoices[index] = value;
    updateForm({ choices: nextChoices });
  }

  function handleMarkdownTextareaKeyDown(event, field) {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.nativeEvent?.isComposing
    ) {
      return;
    }

    const textarea = event.currentTarget;
    const next = getMarkdownContinuation(textarea.value, textarea.selectionStart, textarea.selectionEnd);

    if (!next) {
      return;
    }

    event.preventDefault();
    updateForm({ [field]: next.value });
    requestAnimationFrame(() => {
      textarea.setSelectionRange(next.cursor, next.cursor);
    });
  }

  return (
    <div className="modal-backdrop">
      <form className="admin-modal quiz-modal" onSubmit={onSubmit}>
        <div className="modal-heading">
          <div>
            <h2>{quizModal.mode === 'create' ? '문제 추가' : '문제 수정'}</h2>
            <p>post_slug: <code>{quizModal.postSlug}</code></p>
          </div>
          <button type="button" className="icon-action" onClick={onCancel} title="닫기">
            <X size={18} />
          </button>
        </div>
        {quizModal.error ? <p className="form-error">{quizModal.error}</p> : null}
        <label>
          <span>question</span>
          <textarea
            required
            rows="3"
            value={form.question}
            onChange={(event) => updateForm({ question: event.target.value })}
            onKeyDown={(event) => handleMarkdownTextareaKeyDown(event, 'question')}
          />
        </label>
        <div className="choice-edit-grid">
          {form.choices.map((choice, index) => (
            <label key={index}>
              <span>choice_{index + 1}</span>
              <input required value={choice} onChange={(event) => updateChoice(index, event.target.value)} />
            </label>
          ))}
        </div>
        <label>
          <span>correct_position</span>
          <select value={form.correctPosition} onChange={(event) => updateForm({ correctPosition: event.target.value })}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
        <label>
          <span>explanation</span>
          <textarea
            required
            rows="4"
            value={form.explanation}
            onChange={(event) => updateForm({ explanation: event.target.value })}
            onKeyDown={(event) => handleMarkdownTextareaKeyDown(event, 'explanation')}
          />
        </label>
        <WidgetQuestionPreview form={form} />
        <div className="modal-actions">
          <button type="button" className="admin-button secondary" onClick={onCancel}>
            취소
          </button>
          <button type="submit" className="admin-button primary" disabled={busy}>
            <Check size={17} />
            저장
          </button>
        </div>
      </form>
    </div>
  );
}

function AiGenerateModal({ modal, setModal, onSubmit, onCancel, busy }) {
  const isTextMode = modal.sourceType === 'text';
  const loadingCopy = getAiLoadingCopy(modal.sourceType);

  function updateModal(patch) {
    setModal((current) => ({
      ...current,
      ...patch,
      error: patch.error === undefined ? current.error : patch.error,
    }));
  }

  return (
    <div className="modal-backdrop">
      <form className="admin-modal ai-generate-modal" onSubmit={onSubmit}>
        <div className="modal-heading">
          <div>
            <h2>AI 퀴즈 생성</h2>
            <p>post_slug: <code>{modal.postSlug}</code></p>
          </div>
          <button type="button" className="icon-action" onClick={onCancel} title="닫기" disabled={busy}>
            <X size={18} />
          </button>
        </div>

        <p className="ai-generate-note">빈 Slug Group에만 3문항을 자동 생성합니다.</p>

        {modal.error ? <p className="form-error">{modal.error}</p> : null}

        {busy ? (
          <div className="ai-loading-panel" role="status" aria-live="polite">
            <LoaderCircle className="spin" size={22} />
            <div>
              <strong>{loadingCopy.title}</strong>
              <p>{loadingCopy.description}</p>
              <span>중복 제출은 자동으로 막아두었습니다.</span>
            </div>
          </div>
        ) : null}

        <fieldset className="ai-mode-field">
          <legend>생성 방식</legend>
          <div className="ai-mode-control">
            {aiSourceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={modal.sourceType === option.value ? 'active' : ''}
                onClick={() => updateModal({ sourceType: option.value, error: '' })}
                disabled={busy}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          <span>difficulty</span>
          <select
            value={modal.difficulty}
            onChange={(event) => updateModal({ difficulty: event.target.value })}
            disabled={busy}
          >
            {aiDifficultyOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        {isTextMode ? (
          <label>
            <span>source_text</span>
            <textarea
              required
              rows="9"
              value={modal.content}
              onChange={(event) => updateModal({ content: event.target.value, error: '' })}
              placeholder="퀴즈로 만들 원문을 붙여넣으세요."
              disabled={busy}
            />
          </label>
        ) : (
          <label>
            <span>{modal.sourceType === 'web' ? 'web_url' : 'youtube_url'}</span>
            <input
              required
              type="url"
              value={modal.url}
              onChange={(event) => updateModal({ url: event.target.value, error: '' })}
              placeholder={modal.sourceType === 'web' ? 'https://example.com/article' : 'https://www.youtube.com/watch?v=...'}
              disabled={busy}
            />
          </label>
        )}

        <div className="modal-actions">
          <button type="button" className="admin-button secondary" onClick={onCancel} disabled={busy}>
            취소
          </button>
          <button type="submit" className="admin-button primary" disabled={busy}>
            {busy ? <LoaderCircle className="spin" size={17} /> : <Sparkles size={17} />}
            {busy ? '생성 중' : '생성'}
          </button>
        </div>
      </form>
    </div>
  );
}

function WidgetQuestionPreview({ form }) {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const answerPosition = Number(form.correctPosition) || 1;
  const choices = form.choices.map((choice, index) => ({
    position: index + 1,
    text: choice || `보기 ${index + 1}`,
  }));
  const previewQuiz = {
    question: form.question || '문제 본문이 여기에 표시됩니다.',
    choices,
    answerPosition,
    correctAnswer: choices[answerPosition - 1]?.text || '',
    explanation: form.explanation || '해설이 여기에 표시됩니다.',
  };

  useEffect(() => {
    setSelectedPosition(null);
  }, [form.question, form.choices, form.correctPosition, form.explanation]);

  return (
    <section className="quiz-preview widget-preview">
      <div className="widget-preview-heading">
        <strong>위젯 미리보기</strong>
        <span>iframe 사용자에게 보이는 현재 문제 완성본</span>
      </div>
      <div className="admin-widget-preview">
        <QuizCard
          quiz={previewQuiz}
          quizNumber={1}
          totalCount={1}
          selectedPosition={selectedPosition}
          onSelect={setSelectedPosition}
        />
      </div>
    </section>
  );
}

function UtilityModal({ modal, onClose, onThemeChange, onCopy }) {
  const themeMode = modal.themeMode || 'system';
  const embedUrl = buildEmbedUrl(modal.quizSet.postSlug, themeMode);
  const iframeCode = buildIframeCode(modal.quizSet.postSlug, themeMode);

  function handleCodeInteraction(event) {
    event.currentTarget.select();
    onCopy(iframeCode);
  }

  return (
    <div className="modal-backdrop">
      <section className="admin-modal utility-modal">
        <div className="modal-heading">
          <div>
            <h2>iframe 미리보기 / 코드 복사</h2>
            <p><code>{modal.quizSet.postSlug}</code></p>
          </div>
          <button type="button" className="icon-action" onClick={onClose} title="닫기">
            <X size={18} />
          </button>
        </div>
        <label>
          <span>preview_url</span>
          <input readOnly value={embedUrl} />
        </label>
        <fieldset className="theme-mode-field">
          <legend>theme</legend>
          <div className="theme-mode-control">
            {embedThemeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={themeMode === option.value ? 'active' : ''}
                onClick={() => onThemeChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          <span>iframe_code</span>
          <textarea
            readOnly
            rows="4"
            value={iframeCode}
            title="클릭하면 iframe 코드가 복사됩니다."
            onClick={handleCodeInteraction}
            onFocus={handleCodeInteraction}
          />
        </label>
        <div className="iframe-preview-box">
          <iframe title={`${modal.quizSet.postSlug} preview`} src={embedUrl} />
        </div>
        <div className="modal-actions">
          <a className="admin-button secondary" href={embedUrl} target="_blank" rel="noreferrer">
            <ExternalLink size={17} />
            새 창
          </a>
          <button type="button" className="admin-button primary" onClick={() => onCopy(iframeCode)}>
            <Copy size={17} />
            복사
          </button>
        </div>
      </section>
    </div>
  );
}

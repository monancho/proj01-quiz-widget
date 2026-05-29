import {
  BarChart3,
  Bell,
  BookOpen,
  Check,
  Code2,
  Copy,
  Edit3,
  ExternalLink,
  Filter,
  FileText,
  GripVertical,
  LayoutDashboard,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import RichText from '../components/common/RichText.jsx';
import QuizCard from '../components/quiz/QuizCard.jsx';
import {
  checkPostSlug,
  createQuiz,
  createQuizSet,
  deleteQuiz,
  deleteQuizSet,
  getQuiz,
  listQuizSets,
  listQuizzes,
  reorderQuizzes,
  updateQuiz,
  updateQuizSet,
} from '../api/adminApi.js';

const statusOptions = [
  { value: 'draft', label: '준비중' },
  { value: 'published', label: '공개' },
  { value: 'private', label: '비공개' },
];

const embedThemeOptions = [
  { value: 'system', label: '시스템' },
  { value: 'light', label: '화이트' },
  { value: 'dark', label: '다크' },
];

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

export default function AdminQuizManagerPage() {
  const [filters, setFilters] = useState({ query: '', status: '' });
  const [draftFilters, setDraftFilters] = useState({ query: '', status: '' });
  const [summary, setSummary] = useState(null);
  const [quizSets, setQuizSets] = useState([]);
  const [expandedSetId, setExpandedSetId] = useState(null);
  const [quizzesBySetId, setQuizzesBySetId] = useState({});
  const [setModal, setSetModal] = useState(null);
  const [quizModal, setQuizModal] = useState(null);
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

  return (
    <main className="admin-shell">
      <AdminSidebar />
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-kicker">퀴즈 관리 &gt; 퀴즈 목록</p>
            <h1>Slug Group Manager</h1>
          </div>
          <div className="admin-topbar-actions">
            <button type="button" className="icon-action" title="알림">
              <Bell size={17} />
            </button>
            <button type="button" className="admin-button secondary" onClick={loadQuizSets}>
              <RefreshCw size={17} />
              새로고침
            </button>
            <button type="button" className="admin-button primary" onClick={openCreateSetModal}>
              <Plus size={17} />
              새 퀴즈 만들기
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
              검색
            </button>
          </form>
        </section>

        <StatsBar summary={summary} />

        <section className="admin-workspace">
          <div className="admin-list-panel">
            <div className="panel-heading">
              <h2>퀴즈 목록</h2>
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
                quizzes={quizzesBySetId[selectedSet.id] || []}
                draggedQuizId={draggedQuizId}
                onDragStart={handleDragStartQuiz}
                onDropQuiz={handleDropQuiz}
                onEditSet={() => openEditSetModal(selectedSet)}
                onDeleteSet={() => handleDeleteSet(selectedSet)}
                onNewQuiz={() => openCreateQuizModal(selectedSet)}
                onEditQuiz={(quiz) => openEditQuizModal(quiz, selectedSet)}
                onDeleteQuiz={(quiz) => handleDeleteQuiz(quiz, selectedSet.id)}
                onEmbedTools={() => openEmbedToolsModal(selectedSet)}
              />
            )}
          </div>
        </section>
      </section>

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

function AdminSidebar() {
  const navItems = [
    { label: '대시보드', icon: LayoutDashboard },
    { label: '콘텐츠 관리', icon: BookOpen },
    { label: '글 관리', icon: FileText },
    { label: '퀴즈 관리', icon: Code2, active: true },
    { label: '통계', icon: BarChart3 },
    { label: '설정', icon: Settings },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <strong>TISTORY ADMIN</strong>
        <span>Quiz Widget</span>
      </div>
      <nav className="admin-sidebar-nav" aria-label="Admin navigation">
        {navItems.map(({ label, icon: Icon, active }) => (
          <button key={label} type="button" className={active ? 'active' : ''}>
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="admin-sidebar-user">
        <span className="admin-avatar">M</span>
        <span>
          <strong>manager</strong>
          <small>관리자</small>
        </span>
      </div>
    </aside>
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
  draggedQuizId,
  onDragStart,
  onDropQuiz,
  onEditSet,
  onDeleteSet,
  onNewQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onEmbedTools,
}) {
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

      <div className="quiz-table-header">
        <h3>Quizzes</h3>
        <button type="button" className="admin-button primary" disabled={quizzes.length >= 3} onClick={onNewQuiz}>
          <Plus size={17} />
          문제 추가
        </button>
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
          <textarea required rows="3" value={form.question} onChange={(event) => updateForm({ question: event.target.value })} />
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
          <textarea required rows="4" value={form.explanation} onChange={(event) => updateForm({ explanation: event.target.value })} />
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

function LoadingRows() {
  return (
    <div className="loading-block">
      <LoaderCircle className="spin" size={20} />
      <span>불러오는 중</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const option = statusOptions.find((item) => item.value === status);
  return <span className={`status-badge ${status}`}>{option?.label || status}</span>;
}

function CompletionBadge({ quizSet }) {
  return (
    <span className={`completion-badge ${quizSet.isComplete ? 'complete' : ''}`}>
      {quizSet.quizCount}/{quizSet.requiredQuizCount}
    </span>
  );
}

function buildEmbedUrl(postSlug, themeMode = 'system') {
  const theme = embedThemeOptions.some((option) => option.value === themeMode) ? themeMode : 'system';
  return `${window.location.origin}/embed/${encodeURIComponent(postSlug)}?theme=${theme}`;
}

function buildIframeCode(postSlug, themeMode = 'system') {
  return `<iframe src="${buildEmbedUrl(postSlug, themeMode)}" width="100%" height="720" loading="lazy" allowtransparency="true" style="border:0;max-width:100%;background:transparent;"></iframe>`;
}

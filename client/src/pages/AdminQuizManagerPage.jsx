import {
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Filter,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import RichText from '../components/common/RichText.jsx';
import {
  checkPostSlug,
  createQuiz,
  createQuizSet,
  deleteQuiz,
  deleteQuizSet,
  getQuiz,
  listQuizSets,
  listQuizzes,
  updateQuiz,
  updateQuizSet,
} from '../api/adminApi.js';

const emptySetForm = {
  id: null,
  postSlug: '',
  postTitle: '',
  status: 'private',
};

const emptyQuizForm = {
  id: null,
  setId: null,
  sortOrder: 1,
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
  const [quizForm, setQuizForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState('');
  const [copyFallbackCode, setCopyFallbackCode] = useState('');

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
      if (!expandedSetId && data.items[0]) {
        setExpandedSetId(data.items[0].id);
        await loadQuizzes(data.items[0].id);
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
        status: quizSet.status,
      },
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
        status: setModal.form.status,
      };

      const saved = setModal.mode === 'create'
        ? await createQuizSet(payload)
        : await updateQuizSet(setModal.form.id, payload);

      setSetModal(null);
      setExpandedSetId(saved.id);
      setMessage(setModal.mode === 'create' ? 'Slug Group이 생성되었습니다.' : 'Slug Group이 저장되었습니다.');
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
      setMessage('Slug Group이 삭제되었습니다.');
      setExpandedSetId(null);
      await loadQuizSets();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  function openCreateQuizForm(quizSet) {
    const existing = quizzesBySetId[quizSet.id] || [];
    const used = new Set(existing.map((quiz) => quiz.sortOrder));
    const nextSortOrder = [1, 2, 3].find((order) => !used.has(order)) || 1;

    setQuizForm({
      mode: 'create',
      postSlug: quizSet.postSlug,
      form: {
        ...emptyQuizForm,
        setId: quizSet.id,
        sortOrder: nextSortOrder,
      },
      error: '',
    });
  }

  async function openEditQuizForm(quiz, quizSet) {
    setBusy(true);
    setError('');

    try {
      const detail = await getQuiz(quiz.id);
      setQuizForm({
        mode: 'edit',
        postSlug: quizSet.postSlug,
        form: {
          id: detail.id,
          setId: detail.quizSetId,
          sortOrder: detail.sortOrder,
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
        sortOrder: Number(quizForm.form.sortOrder),
        question: quizForm.form.question,
        choices: quizForm.form.choices,
        correctPosition: Number(quizForm.form.correctPosition),
        explanation: quizForm.form.explanation,
      };

      const saved = quizForm.mode === 'create'
        ? await createQuiz(quizForm.form.setId, payload)
        : await updateQuiz(quizForm.form.id, payload);

      setQuizForm(null);
      setMessage(quizForm.mode === 'create' ? '문제가 생성되었습니다.' : '문제가 저장되었습니다.');
      await loadQuizzes(saved.quizSetId);
      await loadQuizSets();
    } catch (apiError) {
      setQuizForm((current) => ({ ...current, error: apiError.message }));
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
      setMessage('문제가 삭제되었습니다.');
      await loadQuizzes(setId);
      await loadQuizSets();
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleCopyIframe(quizSet) {
    const code = buildIframeCode(quizSet.postSlug);
    setCopyState('');
    setCopyFallbackCode('');

    try {
      await navigator.clipboard.writeText(code);
      setCopyState(`${quizSet.postSlug} iframe 코드가 복사되었습니다.`);
    } catch {
      setCopyFallbackCode(code);
      setCopyState('브라우저 clipboard 권한이 없어 복사용 코드를 표시했습니다.');
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
      <header className="admin-topbar">
        <div>
          <p className="admin-kicker">Quiz Widget Admin</p>
          <h1>Slug Group Manager</h1>
        </div>
        <div className="admin-topbar-actions">
          <button type="button" className="admin-button secondary" onClick={loadQuizSets}>
            <RefreshCw size={17} />
            새로고침
          </button>
          <button type="button" className="admin-button primary" onClick={openCreateSetModal}>
            <Plus size={17} />
            Slug Group
          </button>
        </div>
      </header>

      <StatusStrip message={message || copyState} error={error} busy={busy || loading} />
      {copyFallbackCode ? (
        <section className="copy-fallback">
          <div>
            <strong>iframe 코드</strong>
            <p>아래 코드를 직접 선택해서 복사하세요.</p>
          </div>
          <textarea readOnly rows="3" value={copyFallbackCode} />
          <button type="button" className="icon-action" onClick={() => setCopyFallbackCode('')} title="복사 fallback 닫기">
            <X size={17} />
          </button>
        </section>
      ) : null}

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
              <option value="private">비공개</option>
              <option value="published">공개</option>
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
              quizzes={quizzesBySetId[selectedSet.id] || []}
              onEditSet={() => openEditSetModal(selectedSet)}
              onDeleteSet={() => handleDeleteSet(selectedSet)}
              onNewQuiz={() => openCreateQuizForm(selectedSet)}
              onEditQuiz={(quiz) => openEditQuizForm(quiz, selectedSet)}
              onDeleteQuiz={(quiz) => handleDeleteQuiz(quiz, selectedSet.id)}
              onCopyIframe={() => handleCopyIframe(selectedSet)}
            />
          )}
        </div>
      </section>

      {quizForm ? (
        <QuizEditor
          quizForm={quizForm}
          setQuizForm={setQuizForm}
          onSubmit={handleSaveQuiz}
          onCancel={() => setQuizForm(null)}
          busy={busy}
        />
      ) : null}

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
    ['공개', summary?.publishedSets || 0],
    ['비공개', summary?.privateSets || 0],
    ['완료', summary?.completedSets || 0],
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
  onEditSet,
  onDeleteSet,
  onNewQuiz,
  onEditQuiz,
  onDeleteQuiz,
  onCopyIframe,
}) {
  const embedUrl = buildEmbedUrl(quizSet.postSlug);

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
          <a className="icon-action" href={embedUrl} target="_blank" rel="noreferrer" title="iframe 미리보기">
            <ExternalLink size={17} />
          </a>
          <button type="button" className="icon-action" onClick={onCopyIframe} title="iframe 코드 복사">
            <Copy size={17} />
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
              <th>순서</th>
              <th>문제</th>
              <th>정답</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length === 0 ? (
              <tr>
                <td colSpan="4">등록된 문제가 없습니다.</td>
              </tr>
            ) : quizzes.map((quiz) => (
              <tr key={quiz.id}>
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
        <label>
          <span>status</span>
          <select
            value={modal.form.status}
            onChange={(event) => setModal((current) => ({
              ...current,
              form: { ...current.form, status: event.target.value },
            }))}
          >
            <option value="private">private</option>
            <option value="published">published</option>
          </select>
        </label>
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

function QuizEditor({ quizForm, setQuizForm, onSubmit, onCancel, busy }) {
  const form = quizForm.form;
  const answerPreview = form.choices[Number(form.correctPosition) - 1] || '';

  function updateForm(patch) {
    setQuizForm((current) => ({
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
    <section className="quiz-editor">
      <form className="quiz-form" onSubmit={onSubmit}>
        <div className="panel-heading">
          <div>
            <h2>{quizForm.mode === 'create' ? '문제 등록' : '문제 수정'}</h2>
            <p>post_slug: <code>{quizForm.postSlug}</code></p>
          </div>
          <button type="button" className="icon-action" onClick={onCancel} title="닫기">
            <X size={18} />
          </button>
        </div>
        {quizForm.error ? <p className="form-error">{quizForm.error}</p> : null}
        <div className="form-grid">
          <label>
            <span>sort_order</span>
            <select value={form.sortOrder} onChange={(event) => updateForm({ sortOrder: event.target.value })}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </label>
          <label>
            <span>correct_position</span>
            <select value={form.correctPosition} onChange={(event) => updateForm({ correctPosition: event.target.value })}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </label>
        </div>
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
          <span>explanation</span>
          <textarea required rows="4" value={form.explanation} onChange={(event) => updateForm({ explanation: event.target.value })} />
        </label>
        <div className="quiz-preview">
          <strong>미리보기</strong>
          <RichText source={form.question} fallback="문제 본문이 여기에 표시됩니다." />
          <ol>
            {form.choices.map((choice, index) => (
              <li key={index} className={index + 1 === Number(form.correctPosition) ? 'preview-answer' : ''}>
                <RichText source={choice} fallback={`보기 ${index + 1}`} inline />
              </li>
            ))}
          </ol>
          <p>
            정답: <RichText source={answerPreview} fallback="정답 보기를 입력하세요." inline />
          </p>
          <RichText source={form.explanation} fallback="해설이 여기에 표시됩니다." />
        </div>
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
    </section>
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
  return <span className={`status-badge ${status}`}>{status}</span>;
}

function CompletionBadge({ quizSet }) {
  return (
    <span className={`completion-badge ${quizSet.isComplete ? 'complete' : ''}`}>
      {quizSet.quizCount}/{quizSet.requiredQuizCount}
    </span>
  );
}

function buildEmbedUrl(postSlug) {
  return `${window.location.origin}/embed/${encodeURIComponent(postSlug)}`;
}

function buildIframeCode(postSlug) {
  return `<iframe src="${buildEmbedUrl(postSlug)}" width="100%" height="720" loading="lazy" style="border:0;max-width:100%;"></iframe>`;
}

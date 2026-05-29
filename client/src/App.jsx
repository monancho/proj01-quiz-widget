import React, { Suspense, lazy } from 'react';

const EmbedQuizPage = lazy(() => import('./pages/EmbedQuizPage.jsx'));
const AdminQuizManagerPage = lazy(() => import('./pages/AdminQuizManagerPage.jsx'));

function getEmbedSlug(pathname) {
  const marker = '/embed/';
  const index = pathname.indexOf(marker);

  if (index === -1) {
    return '';
  }

  return decodeURIComponent(pathname.slice(index + marker.length).split('/')[0] || '');
}

export default function App() {
  if (window.location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<main className="state-message">Loading admin...</main>}>
        <AdminQuizManagerPage />
      </Suspense>
    );
  }

  const postSlug = getEmbedSlug(window.location.pathname);

  return (
    <Suspense fallback={<main className="state-message">Loading quiz...</main>}>
      <EmbedQuizPage postSlug={postSlug} />
    </Suspense>
  );
}

import React from 'react';
import EmbedQuizPage from './pages/EmbedQuizPage.jsx';
import AdminQuizManagerPage from './pages/AdminQuizManagerPage.jsx';

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
    return <AdminQuizManagerPage />;
  }

  const postSlug = getEmbedSlug(window.location.pathname);

  return <EmbedQuizPage postSlug={postSlug} />;
}

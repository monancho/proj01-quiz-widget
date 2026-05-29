import EmbedQuizPage from './pages/EmbedQuizPage.jsx';

function getEmbedSlug(pathname) {
  const marker = '/embed/';
  const index = pathname.indexOf(marker);

  if (index === -1) {
    return '';
  }

  return decodeURIComponent(pathname.slice(index + marker.length).split('/')[0] || '');
}

export default function App() {
  const postSlug = getEmbedSlug(window.location.pathname);

  return <EmbedQuizPage postSlug={postSlug} />;
}

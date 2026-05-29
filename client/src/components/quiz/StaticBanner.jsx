import { ExternalLink } from 'lucide-react';
import React from 'react';

const bannerText = import.meta.env.VITE_BANNER_TEXT || '관련 글 더 보기';
const bannerUrl = import.meta.env.VITE_BANNER_URL || '';
const bannerCta = import.meta.env.VITE_BANNER_CTA || '열기';

export default function StaticBanner() {
  if (!bannerUrl) {
    return <div className="static-banner">{bannerText}</div>;
  }

  return (
    <a className="static-banner static-banner-link" href={bannerUrl} target="_blank" rel="noreferrer">
      <span>{bannerText}</span>
      <span className="banner-cta">
        {bannerCta}
        <ExternalLink size={15} />
      </span>
    </a>
  );
}

import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "./Icons";

export function PageHero({ index, eyebrow, title, description }: { index: string; eyebrow: string; title: ReactNode; description: string }) {
  return (
    <section className="page-hero section-dark">
      <div className="page-hero-index">{index}</div>
      <div>
        <span className="eyebrow light">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      <p>{description}</p>
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description?: string; action?: { label: string; to: string } }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <div className="section-heading-main">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {action && (
          <Link className="text-link" to={action.to}>
            {action.label} <ArrowRight />
          </Link>
        )}
      </div>
    </div>
  );
}

export function VisualPlaceholder({ label, caption, tone = "dark" }: { label: string; caption: string; tone?: "dark" | "light" | "green" }) {
  return (
    <div className={`visual-placeholder visual-${tone}`} data-media-slot={label} aria-label={`${label} 이미지 자리`}>
      <div className="visual-grid" aria-hidden="true" />
      <span>{label}</span>
      <p>{caption}</p>
    </div>
  );
}

export function ConsultationBand() {
  return (
    <section className="consultation-band">
      <div>
        <span className="eyebrow light">PRIVATE CONSULTATION</span>
        <h2>민감한 자료는 나중에,<br />안전한 경로로 받습니다.</h2>
      </div>
      <p>
        첫 신청에서는 상담에 필요한 최소 정보만 수집합니다. 주민등록번호, 계좌·카드 정보,
        비밀번호와 원본 서류는 입력하지 마세요.
      </p>
      <Link className="button button-light" to="/consultation">
        보안 상담 신청 <ArrowUpRight />
      </Link>
    </section>
  );
}

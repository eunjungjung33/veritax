import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { KAKAO_CHANNEL_URL, PHONE_HREF } from "../data/content";
import { ArrowRight, ArrowUpRight, MessageCircle, Phone } from "./Icons";

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description: string }) {
  return (
    <section className="page-hero">
      <div className="page-hero-inner">
        <span className="eyebrow light">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
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

export function PrincipalPortrait() {
  return (
    <div className="portrait-placeholder">
      <img src="/images/jung-eun-jung.jpg" alt="정은정 대표 공인회계사" width={864} height={1184} loading="lazy" decoding="async" />
    </div>
  );
}

export function PortraitPlaceholder({ initials, caption }: { initials: string; caption: string }) {
  return (
    <div className="portrait-placeholder" aria-label={caption}>
      <div aria-hidden="true">{initials}</div>
      <span>PORTRAIT</span>
      <p>{caption}</p>
    </div>
  );
}

export function ConsultationBand() {
  return (
    <section className="consultation-band">
      <div>
        <span className="eyebrow light">FREE CONSULTATION</span>
        <h2>지금 바로 무료 상담을<br />신청하세요.</h2>
      </div>
      <p className="consultation-band-copy">
        <span>복잡한 세무 문제일수록 빠른 확인이 중요합니다.</span>
        <span>편한 방법으로 문의해 주세요.</span>
      </p>
      <div className="consultation-band-actions">
        <a className="button button-light" href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={18} /> 카카오톡 상담 <ArrowUpRight size={16} />
        </a>
        <a className="button button-ghost" href={PHONE_HREF}>
          <Phone size={18} /> 전화 상담
        </a>
      </div>
    </section>
  );
}

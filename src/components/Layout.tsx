import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { navItems } from "../data/content";
import { ArrowUpRight, Phone } from "./Icons";

const titles: Record<string, string> = {
  "/": "정은정 세무회계컨설팅 | VERITAX",
  "/about": "전문가 소개 | VERITAX",
  "/services": "업무영역 | VERITAX",
  "/special-services": "특별 서비스 | VERITAX",
  "/insights": "세무 인사이트 | VERITAX",
  "/cases": "수행 경험 | VERITAX",
  "/estimate": "세무 보수 간편 견적 | VERITAX",
  "/consultation": "보안 상담 신청 | VERITAX",
  "/location": "오시는 길 | VERITAX",
  "/privacy": "개인정보 처리방침 | VERITAX",
};

export function Layout() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
    document.title = titles[location.pathname] ?? "VERITAX";
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="베리택스 홈">
          <span className="brand-mark" aria-hidden="true">V</span>
          <span>
            <strong>VERITAX</strong>
            <small>정은정 세무회계컨설팅</small>
          </span>
        </Link>
        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-phone" href="tel:02-6426-1654" aria-label="02-6426-1654로 전화">
            <Phone size={17} />
            <span>02-6426-1654</span>
          </a>
          <Link className="button button-small button-dark" to="/consultation">
            상담 신청 <ArrowUpRight size={16} />
          </Link>
          <button
            ref={menuButtonRef}
            className="menu-toggle"
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="모바일 메뉴">
          {navItems.map((item, index) => (
            <NavLink key={item.to} to={item.to} tabIndex={open ? 0 : -1}>
              <span>0{index + 1}</span>{item.label}<ArrowUpRight />
            </NavLink>
          ))}
          <Link className="mobile-consult" to="/consultation" tabIndex={open ? 0 : -1}>보안 상담 신청</Link>
        </nav>
      </div>

      <main id="main-content">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-lead">
          <span className="eyebrow light">LET&apos;S TALK</span>
          <h2>복잡한 세금,<br />명확한 다음 단계로.</h2>
          <Link className="circle-link" to="/consultation" aria-label="상담 신청 페이지로 이동">
            <ArrowUpRight size={30} />
          </Link>
        </div>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">VERITAX</div>
            <p>정은정 세무회계컨설팅</p>
          </div>
          <div>
            <strong>OFFICE</strong>
            <p>서울특별시 강동구 고덕비즈밸리로 26<br />B동 2층 202호</p>
          </div>
          <div>
            <strong>CONTACT</strong>
            <p><a href="tel:02-6426-1654">02-6426-1654</a><br />평일 09:00–18:00</p>
          </div>
          <div>
            <strong>LINK</strong>
            <p><Link to="/privacy">개인정보 처리방침</Link><br /><Link to="/location">오시는 길</Link></p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>사업자등록번호 899-66-00798 · 대표 공인회계사 정은정</span>
          <span>© 2026 VERITAX. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

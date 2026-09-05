import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { KAKAO_CHANNEL_URL, navItems, PHONE_HREF, PHONE_NUMBER } from "../data/content";
import { ArrowUpRight, MessageCircle, Phone } from "./Icons";

const brandName = "정은정 세무회계컨설팅";

const titles: Record<string, string> = {
  "/": `${brandName} | 공인회계사 세무 컨설팅`,
  "/about": `구성원 | ${brandName}`,
  "/services": `주요 업무영역 | ${brandName}`,
  "/estimate": `견적 및 상담 신청 | ${brandName}`,
  "/consultation": `견적 및 상담 신청 | ${brandName}`,
  "/insights": `세무 뉴스 | ${brandName}`,
  "/location": `찾아오시는 길 | ${brandName}`,
  "/privacy": `개인정보 처리방침 | ${brandName}`,
};

export function Layout() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    document.title = titles[location.pathname] ?? brandName;
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "auto" }));
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, location.hash]);

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
        <Link className="brand" to="/" aria-label={`${brandName} 홈`}>
          <img className="brand-logo" src="/images/jej-logo-simple-transparent.png" alt={brandName} width={1400} height={500} />
        </Link>

        <nav className="desktop-nav" aria-label="주요 메뉴">
          {navItems.map((item) => "children" in item ? (
            <div className="nav-group" key={item.to}>
              <NavLink to={item.to}>{item.label}</NavLink>
              <div className="nav-dropdown" aria-label={`${item.label} 하위 메뉴`}>
                {item.children.map((child) => <Link key={child.to} to={child.to}>{child.label}</Link>)}
              </div>
            </div>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.to === "/"}>{item.label}</NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <a className="button button-small button-gold header-cta" href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
            무료 상담 신청 <ArrowUpRight size={15} />
          </a>
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
            <div className="mobile-nav-item" key={item.to}>
              <NavLink to={item.to} end={item.to === "/"} tabIndex={open ? 0 : -1}>
                <span>0{index + 1}</span>{item.label}<ArrowUpRight />
              </NavLink>
              {"children" in item && (
                <div className="mobile-subnav">
                  {item.children.map((child) => <Link key={child.to} to={child.to} tabIndex={open ? 0 : -1}>{child.label}</Link>)}
                </div>
              )}
            </div>
          ))}
          <a className="mobile-consult" href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            <MessageCircle size={18} /> 무료 상담 신청
          </a>
        </nav>
      </div>

      <main id="main-content">
        <Outlet />
      </main>

      <div className="floating-actions" aria-label="빠른 상담">
        <a className="floating-kakao" href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 채널로 상담">
          <MessageCircle /><span>카톡</span>
        </a>
        <a className="floating-phone" href={PHONE_HREF} aria-label={`${PHONE_NUMBER}로 전화`}>
          <Phone /><span>전화</span>
        </a>
      </div>

      <footer className="site-footer">
        <div className="footer-lead">
          <span className="eyebrow light">JEJ TAX ACCOUNTING ADVISORY</span>
          <h2>복잡한 세금,<br />명확하게.</h2>
          <a className="circle-link" href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer" aria-label="카카오톡 무료 상담 신청">
            <ArrowUpRight size={30} />
          </a>
        </div>
        <div className="footer-grid">
          <div>
            <img className="footer-brand" src="/images/jej-logo-full-transparent.png" alt={brandName} width={1800} height={1200} loading="lazy" decoding="async" />
            <p>정은정 세무회계컨설팅<br />JEJ TAX ACCOUNTING ADVISORY</p>
          </div>
          <div>
            <strong>OFFICE</strong>
            <p>서울특별시 강동구 고덕비즈밸리로 26<br />B동 2층 202호</p>
          </div>
          <div>
            <strong>CONTACT</strong>
            <p><a href={PHONE_HREF}>{PHONE_NUMBER}</a><br />평일 09:00–18:00</p>
          </div>
          <div>
            <strong>LINK</strong>
            <p><Link to="/privacy">개인정보 처리방침</Link><br /><Link to="/location">찾아오시는 길</Link></p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>사업자등록번호 899-66-00798 · 대표 공인회계사 정은정</span>
          <span>© 2026 정은정 세무회계컨설팅. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}

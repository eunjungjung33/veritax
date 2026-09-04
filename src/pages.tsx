import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ConsultationForm } from "./components/ConsultationForm";
import { HeroFilm } from "./components/HeroFilm";
import { ArrowRight, ArrowUpRight, Check, Lock, MapPin, MessageCircle, Phone } from "./components/Icons";
import { ConsultationBand, PageHero, PortraitPlaceholder, SectionHeading } from "./components/Shared";
import {
  adviserCareers,
  faqs,
  insights,
  KAKAO_CHANNEL_URL,
  NAVER_BLOG_URL,
  PHONE_HREF,
  PHONE_NUMBER,
  principalCareers,
  principalDuties,
  services,
} from "./data/content";
import { consultationServiceFor, estimateFee, feeScales, feeServiceForConsultation, feeServices } from "./data/fees";

const serviceDescriptionTails: Partial<Record<(typeof services)[number]["number"], string>> = {
  "01": "종합소득세 신고 및 절세 플랜 수립",
  "02": "법인 세무 전반 대행",
  "03": "환급 극대화 전략 수립",
  "05": "설립 전후 세무·회계 설계",
  "06": "불복청구 등 전문 세무 용역",
  "07": "전반적인 기장 서비스",
};

function ServiceDescription({ service }: { service: (typeof services)[number] }) {
  const tail = serviceDescriptionTails[service.number];
  if (!tail || !service.description.endsWith(tail)) return service.description;

  return (
    <>
      {service.description.slice(0, -tail.length)}
      <span className="service-description-tail">{tail}</span>
    </>
  );
}

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <HeroFilm />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-copy">
          <span className="hero-badge">CERTIFIED PUBLIC ACCOUNTANT · SEOUL GANGDONG</span>
          <h1>
            <span className="hero-title-line"><span>복잡한 세금,</span></span>
            <span className="hero-title-line hero-title-accent"><em>명확하게</em></span>
          </h1>
          <p>
            <strong>Big4 출신 공인회계사가 직접 담당합니다</strong>
            <span>개인·법인 세무신고부터 세무 컨설팅까지, 정확하고 신속하게 해결해 드립니다</span>
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href={KAKAO_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={19} /> 카카오톡 상담하기 <ArrowUpRight size={17} />
            </a>
            <Link className="button button-hero-outline" to="/services#service-list">업무 범위 보기 <ArrowRight size={17} /></Link>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><span />SCROLL</div>
      </section>

      <section className="metrics" aria-label="전문 경험">
        <div><strong>Big4</strong><span>출신 공인회계사</span></div>
        <div><strong>한영 · 삼정</strong><span>회계법인 경력</span></div>
        <div><strong>SK · 현대</strong><span>대형 법인 담당</span></div>
        <div><strong>365</strong><span>연중 상담 가능</span></div>
      </section>

      <section className="section home-about">
        <SectionHeading eyebrow="THE PROFESSIONAL" title={<>경험으로 읽고,<br />명확하게 설명합니다.</>} />
        <div className="home-about-grid">
          <PortraitPlaceholder initials="JEJ" caption="정은정 대표 프로필 사진 교체 영역" />
          <div className="home-about-copy">
            <span className="mini-index">01 — PRINCIPAL CPA</span>
            <h3>정은정 <small>공인회계사</small></h3>
            <p>한영회계법인·삼정회계법인 택스본부에서의 풍부한 경험을 바탕으로, 개인사업자·법인·고액 자산가를 위한 맞춤형 세무 컨설팅을 제공합니다. SK하이닉스·현대자동차 등 국내 대형 법인의 법인세 신고부터 세무조사 대응까지, 복잡한 세무 문제를 명확하고 신속하게 해결합니다.</p>
            <div className="badge-row"><span>공인회계사 (KICPA)</span><span>창업기업관리사</span></div>
            <Link className="text-link" to="/about#principal">구성원 자세히 보기 <ArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="section section-cream home-services">
        <SectionHeading eyebrow="WHAT WE DO" title={<>개인부터 기업까지,<br />필요한 세무를 정확히.</>} description="신고부터 전문 세무 컨설팅까지 상황에 맞는 업무를 확인해 보세요." action={{ label: "주요 업무영역 전체", to: "/services" }} />
        <div className="service-preview-grid">
          {services.slice(0, 6).map((service) => (
            <Link key={service.number} className="service-preview-card" to={`/estimate?service=${encodeURIComponent(service.title)}#consultation`}>
              <span className="service-preview-number">{service.number}</span>
              <h3>{service.title}</h3>
              <p className="service-preview-description"><ServiceDescription service={service} /></p>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="section home-news">
        <SectionHeading eyebrow="TAX NEWS" title={<>세무 판단에 도움이 되는<br />최신 이야기를 전합니다.</>} action={{ label: "세무 뉴스 전체", to: "/insights" }} />
        <div className="news-grid">
          {insights.slice(0, 3).map((insight, index) => (
            <a className="news-card" key={insight.href} href={insight.href} target="_blank" rel="noopener noreferrer">
              <div className={`news-art news-art-${index + 1}`}><span>{insight.category}</span></div>
              <small>{insight.date}</small>
              <h3>{insight.title}</h3>
              <p>{insight.summary}</p>
              <span className="news-link">블로그에서 보기 <ArrowUpRight size={15} /></span>
            </a>
          ))}
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="OUR PROFESSIONALS" title={<>깊이 있는 경험,<br /><em>직접 책임지는 상담.</em></>} description="대표 공인회계사와 세무 고문이 각 분야의 경험을 바탕으로 함께 검토합니다." />

      <section className="section profile-section" id="principal">
        <PortraitPlaceholder initials="JEJ" caption="정은정 대표 프로필 사진 교체 영역" />
        <div className="profile-copy">
          <span className="eyebrow">PRINCIPAL CPA</span>
          <h2>정은정 <small>대표 공인회계사</small></h2>
          <p className="role">공인회계사 (KICPA) <b>|</b> 창업기업관리사</p>
          <p className="profile-intro">한영회계법인·삼정회계법인 택스본부에서의 풍부한 경험을 바탕으로, 개인사업자·법인·고액 자산가를 위한 맞춤형 세무 컨설팅을 제공합니다. SK하이닉스·현대자동차 등 국내 대형 법인의 법인세 신고부터 세무조사 대응까지, 복잡한 세무 문제를 명확하고 신속하게 해결합니다.</p>
          <div className="badge-row"><span>공인회계사 (KICPA)</span><span>창업기업관리사</span></div>
          <div className="profile-details">
            <div><strong>경력 사항</strong><ul>{principalCareers.map((career) => <li key={career}>{career}</li>)}</ul></div>
            <div><strong>주요 담당 업무</strong><ul>{principalDuties.map((duty) => <li key={duty}>{duty}</li>)}</ul></div>
          </div>
        </div>
      </section>

      <section className="section profile-section adviser-section section-cream" id="adviser">
        <PortraitPlaceholder initials="HKP" caption="홍광표 고문 프로필 사진 교체 영역" />
        <div className="profile-copy">
          <span className="eyebrow">TAX ADVISER</span>
          <h2>홍광표 고문</h2>
          <p className="role">세무사</p>
          <div className="profile-details single-column">
            <div><strong>약력</strong><ul>{adviserCareers.map((career) => <li key={career}>{career}</li>)}</ul></div>
          </div>
          <p className="profile-note">세부 약력은 추후 추가될 예정입니다.</p>
        </div>
      </section>

      <ConsultationBand />
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="PRACTICE AREAS" title={<>주요<br /><em>업무영역.</em></>} description="개인·법인 세무신고부터 세무조사 대응과 창업·가상자산 세무까지 정확한 기준으로 지원합니다." />
      <section className="section service-detail-section" id="service-list">
        <div className="service-card-grid">
          {services.map((service) => (
            <article className="service-card" key={service.number}>
              <span className="service-number">{service.number}</span>
              <h2>{service.title}</h2>
              <p><ServiceDescription service={service} /></p>
              <Link to={`/estimate?service=${encodeURIComponent(service.title)}#consultation`} aria-label={`${service.title} 상담 신청`}>
                상담하기 <ArrowUpRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function EstimatePage() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service") ?? "";
  const [service, setService] = useState(() => feeServiceForConsultation(requestedService));
  const [scale, setScale] = useState("");
  const fee = useMemo(() => estimateFee(service, scale), [service, scale]);
  const consultationService = consultationServiceFor(service) || requestedService;

  return (
    <>
      <PageHero eyebrow="FEE & CONSULTATION" title={<>예상 견적부터<br /><em>상담 신청까지.</em></>} description="업무 유형과 연 매출 규모를 선택하면 예상 보수를 바로 확인할 수 있습니다." />
      <section className="section estimate-section section-cream">
        <div className="estimate-workspace">
          <div className="fee-calculator" aria-labelledby="fee-calculator-title">
            <span className="eyebrow">QUICK CALCULATOR</span>
            <h2 id="fee-calculator-title">예상 보수 계산</h2>
            <div className="fee-form-grid">
              <div className="field">
                <label htmlFor="fee-service">업무 유형</label>
                <select id="fee-service" value={service} onChange={(event) => setService(event.target.value)}>
                  <option value="">선택해 주세요</option>
                  {feeServices.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="fee-scale">매출 규모 (연)</label>
                <select id="fee-scale" value={scale} onChange={(event) => setScale(event.target.value)}>
                  <option value="">선택해 주세요</option>
                  {feeScales.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </div>
            </div>
            <output className={`fee-result ${fee ? "is-ready" : ""}`} aria-live="polite">
              <span>예상 보수</span>
              <strong>{fee ? `${fee.toLocaleString("ko-KR")}원~` : "두 항목을 선택해 주세요"}</strong>
              <small>VAT 별도 · 상세 내용에 따라 달라질 수 있습니다</small>
            </output>
            <ul className="fee-points">
              <li><Check size={16} /> 서버 전송 없는 즉시 계산</li>
              <li><Check size={16} /> 선택값과 결과는 브라우저에 저장하지 않음</li>
              <li><Check size={16} /> 상담 후 업무 범위에 따라 최종 확정</li>
            </ul>
          </div>

          <div className="consultation-panel" id="consultation">
            <div className="consultation-panel-heading">
              <span className="eyebrow">CONSULTATION FORM</span>
              <h2>상담 신청</h2>
              <p>접수 내용은 암호화해 보관하며, 담당자가 확인 후 연락드립니다.</p>
            </div>
            <ConsultationForm prefillService={consultationService} />
          </div>
        </div>
      </section>
      <section className="section faq-section">
        <SectionHeading eyebrow="FAQ" title={<>상담 전에 많이<br />묻는 질문.</>} />
        <div className="faq-list">
          {faqs.map((faq, index) => <details key={faq.question}><summary><span>0{index + 1}</span>{faq.question}</summary><p>{faq.answer}</p></details>)}
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="TAX NEWS" title={<>알아두면 힘이 되는<br /><em>세무 뉴스.</em></>} description="정은정 공인회계사가 네이버 블로그에 직접 전하는 세무·회계 이야기입니다." />
      <section className="section insights-section">
        <div className="blog-heading">
          <div><span className="eyebrow">NAVER BLOG</span><h2>정은정 회계사의<br />세무·회계 이야기</h2></div>
          <a className="button button-outline" href={NAVER_BLOG_URL} target="_blank" rel="noopener noreferrer">블로그 바로가기 <ArrowUpRight size={16} /></a>
        </div>
        <div className="blog-list">
          {insights.map((insight, index) => (
            <a key={insight.href} href={insight.href} target="_blank" rel="noopener noreferrer">
              <div className={`news-art news-art-${(index % 3) + 1}`}><span>{insight.category}</span></div>
              <div><small>{insight.date} · {insight.category}</small><h3>{insight.title}</h3><p>{insight.summary}</p></div>
              <ArrowUpRight />
            </a>
          ))}
        </div>
        <a className="blog-more-link" href={NAVER_BLOG_URL} target="_blank" rel="noopener noreferrer">블로그에서 세무 정보 더 보기 <ArrowRight /></a>
      </section>
      <ConsultationBand />
    </>
  );
}

export function LocationPage() {
  return (
    <>
      <PageHero eyebrow="LOCATION" title={<>찾아오시는<br /><em>길.</em></>} description="서울 강동구 고덕비즈밸리에서 편안하게 상담받으실 수 있습니다." />
      <section className="section location-section">
        <div className="location-info">
          <span className="eyebrow">SEOUL · GANGDONG</span>
          <h2>정은정<br />세무회계컨설팅</h2>
          <div className="location-row"><MapPin /><div><strong>주소</strong><p>서울특별시 강동구 고덕비즈밸리로 26,<br />B동 2층 202호</p></div></div>
          <div className="location-row"><Phone /><div><strong>전화</strong><p><a href={PHONE_HREF}>{PHONE_NUMBER}</a></p></div></div>
          <div className="location-row"><span className="parking-icon" aria-hidden="true">P</span><div><strong>주차</strong><p>2시간 무료 등록<br />건물 내 주차 후 사무실에서 등록</p></div></div>
          <div className="map-links">
            <a href="https://map.kakao.com/link/search/정은정세무회계컨설팅" target="_blank" rel="noopener noreferrer">카카오맵 <ArrowUpRight /></a>
            <a href="https://map.naver.com/v5/search/정은정세무회계컨설팅" target="_blank" rel="noopener noreferrer">네이버지도 <ArrowUpRight /></a>
          </div>
        </div>
        <div className="map-embed">
          <iframe
            title="정은정 세무회계컨설팅 위치 지도"
            src="https://www.openstreetmap.org/export/embed.html?bbox=127.154%2C37.561%2C127.166%2C37.569&layer=mapnik&marker=37.5652057%2C127.1604727"
            referrerPolicy="no-referrer"
          />
          <p>지도 데이터 © OpenStreetMap contributors</p>
        </div>
      </section>
      <section className="section transit-section section-cream">
        <div><span>SUBWAY + BUS 01</span><h3>5호선 고덕역 4번 출구</h3><p>강동01번 버스 탑승 → 지식산업센터 정류장 하차</p></div>
        <div><span>SUBWAY + BUS 02</span><h3>5호선 고덕역 1번 출구</h3><p>강동02번 버스 탑승 → 지식산업센터 정류장 하차</p></div>
        <div><span>PARKING</span><h3>2시간 무료 등록</h3><p>건물 내 주차 후 사무실에서 등록해 주세요.</p></div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="PRIVACY" title={<>개인정보는<br /><em>필요한 만큼만.</em></>} description="상담을 위해 어떤 정보를 왜 처리하는지 투명하게 안내합니다." />
      <section className="section policy-section">
        <aside><strong>시행일</strong><span>2026.09.03</span><a href="#collection">수집 항목</a><a href="#retention">보유 기간</a><a href="#security">안전성 조치</a><a href="#rights">이용자 권리</a></aside>
        <div className="policy-copy">
          <div className="policy-notice"><Lock /><p>상담 신청 원문은 광고·분석 업체에 제공하지 않으며, 서버에서 암호화해 보관합니다.</p></div>
          <h2>개인정보 처리방침</h2>
          <p>정은정 세무회계컨설팅(이하 “사무소”)은 상담 신청자의 개인정보를 보호하고 관련 문의를 신속하게 처리하기 위해 다음과 같이 개인정보 처리 기준을 공개합니다.</p>
          <h3 id="collection">1. 처리 목적과 수집 항목</h3>
          <div className="policy-table"><div><strong>목적</strong><span>상담 신청 확인, 연락, 서비스 적합성 판단</span></div><div><strong>필수 항목</strong><span>업무 유형, 성함, 연락처, 문의 사항, 동의 여부</span></div><div><strong>수집하지 않는 항목</strong><span>주민등록번호, 계좌·카드번호, 비밀번호, 인증서 정보, 첨부 서류</span></div></div>
          <h3 id="retention">2. 보유 및 이용 기간</h3><p>상담 신청 정보는 접수일로부터 90일 동안 보유한 뒤 자동 삭제합니다. 상담 계약이 체결되어 별도 법적 보존 의무가 발생하는 정보는 별도 절차와 안내에 따라 분리 처리합니다.</p>
          <h3>3. 제3자 제공 및 처리 환경</h3><p>사무소는 상담 신청 원문을 외부 설문·광고·분석 업체에 제공하지 않습니다. 웹 서비스 운영 인프라에 저장되는 원문은 애플리케이션 전용 키로 추가 암호화합니다. 실제 운영 계약의 저장 지역과 국외 이전 고지는 공개 전 운영자가 최종 확인합니다.</p>
          <h3 id="security">4. 안전성 확보 조치</h3><ul><li>전송 구간 HTTPS 강제와 인증서 상태 점검</li><li>AES-256-GCM 방식의 애플리케이션 계층 암호화</li><li>공개 조회 API 미제공 및 복호화 키의 운영 환경 분리</li><li>요청 횟수 제한, CSRF 검증, 입력값 검증, 보안 헤더 적용</li><li>90일 경과 데이터의 자동 삭제</li></ul>
          <h3 id="rights">5. 이용자의 권리와 행사 방법</h3><p>신청자는 자신의 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 본인 확인 후 지체 없이 처리합니다.</p>
          <h3>6. 개인정보 보호 문의</h3><p>개인정보 관련 문의와 권리 행사는 대표번호 <a href={PHONE_HREF}>{PHONE_NUMBER}</a>로 연락해 주세요.</p>
          <h3>7. 방침 변경</h3><p>처리 방식이나 위탁 관계가 달라지면 변경 내용과 시행일을 이 페이지에 공개합니다.</p>
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return <section className="not-found"><span>404</span><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 존재하지 않는 페이지입니다.</p><Link className="button button-dark" to="/">홈으로 돌아가기 <ArrowRight /></Link></section>;
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ConsultationForm } from "./components/ConsultationForm";
import { ArrowRight, ArrowUpRight, Check, Lock, MapPin, Phone } from "./components/Icons";
import { ConsultationBand, PageHero, SectionHeading, VisualPlaceholder } from "./components/Shared";
import { caseStudies, faqs, insightCategories, insights, services, specialServices, type InsightCategory } from "./data/content";
import { consultationServiceFor, estimateFee, feeScales, feeServices } from "./data/fees";

export function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow light">TAX · ACCOUNTING · ADVISORY</span>
          <h1>복잡한 세금,<br /><em>명확하게.</em></h1>
          <p>Big4 출신 공인회계사가 상담부터 실행까지 직접 담당합니다. 개인·법인 신고부터 세무 컨설팅까지 정확한 기준을 세웁니다.</p>
          <div className="hero-actions">
            <Link className="button button-light" to="/consultation">상담 신청 <ArrowUpRight /></Link>
            <Link className="line-link light-link" to="/services">업무 범위 보기 <ArrowRight /></Link>
          </div>
        </div>
        <div className="hero-visual-wrap">
          <VisualPlaceholder label="PRINCIPAL PORTRAIT" caption="대표 공인회계사 인물 이미지 영역" tone="green" />
          <div className="hero-caption"><span>JEJ</span><p>Tax & Accounting<br />Consulting</p></div>
        </div>
        <div className="hero-side-label">CERTIFIED PUBLIC ACCOUNTANT · SEOUL GANGDONG</div>
      </section>

      <section className="metrics" aria-label="업무 지표">
        <div><strong>300<sup>+</sup></strong><span>연평균 신규 상담</span></div>
        <div><strong>13<sup>년</sup></strong><span>임직원 평균 경력</span></div>
        <div><strong>99<sup>%</sup></strong><span>기장 고객 재계약 비율</span></div>
        <p>숫자보다 중요한 것은<br />한 건을 대하는 기준입니다.</p>
      </section>

      <section className="section section-about-preview">
        <SectionHeading eyebrow="THE PROFESSIONAL" title={<>세무와 회계를<br />한 흐름으로 봅니다.</>} />
        <div className="about-preview-grid">
          <VisualPlaceholder label="OFFICE / EXPERT" caption="전문가 또는 사무실 이미지 영역" tone="light" />
          <div className="about-preview-copy">
            <span className="mini-index">01 — PRINCIPAL</span>
            <h3>정은정 공인회계사</h3>
            <p>한영회계법인 감사본부, 삼정회계법인·서현회계법인 택스본부에서 쌓은 경험을 바탕으로 기업과 자산가의 복잡한 세무 문제를 직접 해결합니다.</p>
            <ul className="plain-list">
              <li>공인회계사 (KICPA)</li>
              <li>창업기업관리사</li>
              <li>창업진흥원 원스탑 지원센터 자문단</li>
            </ul>
            <Link className="text-link" to="/about">전문가 자세히 보기 <ArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="section services-preview section-cream">
        <SectionHeading eyebrow="WHAT WE DO" title={<>개인부터 기업까지,<br />필요한 세무를 정확히.</>} description="상담이 필요한 순간을 기준으로 업무를 찾을 수 있도록 구성했습니다." action={{ label: "전체 업무영역", to: "/services" }} />
        <div className="service-list">
          {services.slice(0, 6).map((service) => (
            <Link key={service.number} className="service-row" to={`/consultation?service=${encodeURIComponent(service.title)}`}>
              <span>{service.number}</span>
              <h3>{service.title}</h3>
              <p>{service.short}</p>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="section process-section">
        <SectionHeading eyebrow="HOW WE WORK" title={<>설명할 수 있어야<br />좋은 해법입니다.</>} />
        <div className="process-grid">
          {[
            ["01", "듣고", "사실관계와 원하는 결과, 중요한 기한부터 확인합니다."],
            ["02", "분석하고", "자료와 숫자를 검증해 쟁점과 선택지를 분명히 나눕니다."],
            ["03", "실행합니다", "담당 공인회계사가 신고·자문·사후관리까지 이어갑니다."],
          ].map(([number, title, text]) => (
            <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="section section-dark special-preview">
        <SectionHeading eyebrow="SPECIAL SERVICE" title={<>중요한 결정일수록<br />한 단계 더 깊게.</>} action={{ label: "특별 서비스 전체", to: "/special-services" }} />
        <div className="special-preview-grid">
          {specialServices.map((service, index) => (
            <Link to="/special-services" key={service.title} className="special-preview-card">
              <span>0{index + 1}</span><small>{service.eyebrow}</small><h3>{service.title}</h3><ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="section insight-preview">
        <SectionHeading eyebrow="INSIGHTS" title={<>판단에 도움이 되는<br />세무 이야기.</>} action={{ label: "인사이트 전체", to: "/insights" }} />
        <div className="insight-grid">
          {insights.slice(0, 3).map((insight, index) => (
            <article className="insight-card" key={insight.title}>
              <div className={`insight-visual insight-visual-${index + 1}`}><span>{insight.category}</span></div>
              <small>{insight.date}</small><h3>{insight.title}</h3><p>{insight.summary}</p>
            </article>
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
      <PageHero index="01" eyebrow="ABOUT VERITAX" title={<>경험은 숫자를 읽고,<br /><em>사람은 맥락을 읽습니다.</em></>} description="기업과 개인의 상황을 충분히 이해한 뒤, 설명 가능한 기준으로 해결책을 제시합니다." />
      <section className="section about-intro">
        <div>
          <span className="eyebrow">OUR BELIEF</span>
          <blockquote>“정확한 신고를 넘어,<br />다음 결정을 돕는 세무.”</blockquote>
        </div>
        <div className="long-copy">
          <p>정은정 세무회계컨설팅은 세금을 단순한 신고 업무로만 보지 않습니다. 기업의 거래, 개인의 자산, 가족의 계획을 함께 살펴야 같은 숫자도 올바르게 해석할 수 있기 때문입니다.</p>
          <p>대형 회계법인의 감사·택스본부에서 축적한 검토 기준과 현장 중심의 소통을 결합해, 복잡한 내용을 의뢰인이 이해하고 결정할 수 있는 언어로 설명합니다.</p>
        </div>
      </section>
      <section className="section principal-section section-cream">
        <VisualPlaceholder label="PRINCIPAL PORTRAIT" caption="정은정 공인회계사 프로필 이미지" tone="green" />
        <div className="principal-copy">
          <span className="eyebrow">PRINCIPAL CPA</span>
          <h2>정은정</h2><p className="role">공인회계사 (KICPA) · 창업기업관리사</p>
          <p>한영회계법인·삼정회계법인·서현회계법인에서 회계감사와 조세 업무를 수행했습니다. 현재는 기업과 개인 고객의 신고, 세무조사 대응, 경정청구, 가치평가, 창업 자문을 직접 담당합니다.</p>
          <div className="career-columns">
            <div><strong>CAREER</strong><ul><li>전 한영회계법인 감사본부</li><li>전 삼정회계법인 택스본부</li><li>전 서현회계법인 택스본부</li></ul></div>
            <div><strong>ADVISORY</strong><ul><li>한국창업멘토협회 전문멘토</li><li>창업진흥원 원스탑 지원센터 자문단</li><li>노란우산공제 경영지원단</li><li>서산문화재단 감사직</li></ul></div>
          </div>
        </div>
      </section>
      <section className="section values-section">
        <SectionHeading eyebrow="OUR STANDARD" title={<>세 가지 기준을<br />지키며 일합니다.</>} />
        <div className="value-grid">
          <article><span>01</span><h3>직접</h3><p>첫 상담부터 핵심 판단과 결과 검토까지 담당 공인회계사가 직접 관여합니다.</p></article>
          <article><span>02</span><h3>명료</h3><p>어려운 세법을 나열하기보다 선택지, 영향, 다음 행동이 보이도록 설명합니다.</p></article>
          <article><span>03</span><h3>신뢰</h3><p>필요한 정보만 수집하고, 자료의 접근과 보관 범위를 최소화합니다.</p></article>
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <PageHero index="02" eyebrow="PRACTICE" title={<>필요한 순간에,<br /><em>맞는 세무 서비스를.</em></>} description="신고, 관리, 자산 이전, 분쟁 대응까지 상황별 업무 범위를 확인하세요." />
      <section className="section service-detail-section">
        <div className="service-detail-list">
          {services.map((service) => (
            <article className="service-detail" key={service.number}>
              <span className="service-number">{service.number}</span>
              <div><small>{service.short}</small><h2>{service.title}</h2></div>
              <p>{service.description}</p>
              <ul>{service.bullets.map((bullet) => <li key={bullet}><Check size={16} />{bullet}</li>)}</ul>
              <Link to={`/consultation?service=${encodeURIComponent(service.title)}`} aria-label={`${service.title} 상담 신청`}><ArrowUpRight /></Link>
            </article>
          ))}
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function SpecialServicesPage() {
  return (
    <>
      <PageHero index="03" eyebrow="SPECIAL SERVICE" title={<>중요한 변곡점에는<br /><em>입체적인 검토가 필요합니다.</em></>} description="여러 세목과 이해관계가 얽힌 문제를 하나의 흐름으로 분석합니다." />
      <section className="section special-detail-section">
        {specialServices.map((service, index) => (
          <article className="special-detail" key={service.title}>
            <div className={`special-art special-art-${index + 1}`} aria-hidden="true"><span>0{index + 1}</span></div>
            <div className="special-detail-copy">
              <span className="eyebrow">{service.eyebrow}</span><h2>{service.title}</h2><p>{service.description}</p>
              <ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul>
              <Link className="text-link" to="/consultation">상담 신청 <ArrowRight /></Link>
            </div>
          </article>
        ))}
      </section>
      <ConsultationBand />
    </>
  );
}

export function InsightsPage() {
  const [category, setCategory] = useState<InsightCategory>("전체");
  const filtered = useMemo(() => category === "전체" ? insights : insights.filter((insight) => insight.category === category), [category]);
  return (
    <>
      <PageHero index="04" eyebrow="INSIGHTS" title={<>미리 알수록<br /><em>좋은 선택이 됩니다.</em></>} description="신고와 의사결정에 도움이 되는 세무 체크포인트를 전합니다." />
      <section className="section insight-list-section">
        <div className="filter-row" role="group" aria-label="인사이트 분류">
          {insightCategories.map((item) => <button key={item} type="button" className={category === item ? "active" : ""} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <div className="insight-list" aria-live="polite">
          {filtered.map((insight, index) => (
            <article key={insight.title}>
              <div className={`insight-visual insight-visual-${(index % 3) + 1}`}><span>{insight.category}</span></div>
              <div><small>{insight.date} · {insight.category}</small><h2>{insight.title}</h2><p>{insight.summary}</p></div>
              <span className="coming-label">준비 중</span>
            </article>
          ))}
        </div>
        <p className="content-disclaimer">게시물은 일반적인 세무 정보이며 개별 사안에 대한 자문을 대신하지 않습니다. 적용 전 전문가의 검토를 받으세요.</p>
      </section>
      <ConsultationBand />
    </>
  );
}

export function CasesPage() {
  return (
    <>
      <PageHero index="05" eyebrow="EXPERIENCE" title={<>검토의 깊이는<br /><em>경험에서 시작됩니다.</em></>} description="공개 가능한 범위에서 주요 수행 경험을 소개합니다." />
      <section className="section cases-section">
        <div className="case-lead"><span className="eyebrow">SELECTED EXPERIENCE</span><p>각 사례는 과거 수행 경험이며 동일하거나 유사한 결과를 보장하지 않습니다.</p></div>
        <div className="case-list">
          {caseStudies.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span><small>{item.category}</small><h2>{item.title}</h2><strong>{item.client}</strong><p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section trust-strip section-cream">
        <SectionHeading eyebrow="SCOPE" title={<>다양한 규모와 업종을<br />이해하는 시야.</>} />
        <div className="scope-tags"><span>대형 법인</span><span>중소기업</span><span>스타트업</span><span>개인사업자</span><span>고액 자산가</span><span>해외자회사</span></div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function EstimatePage() {
  const [service, setService] = useState("");
  const [scale, setScale] = useState("");
  const fee = useMemo(() => estimateFee(service, scale), [service, scale]);
  const consultationService = consultationServiceFor(service);

  return (
    <>
      <PageHero index="06" eyebrow="FEE ESTIMATE" title={<>상담 전에,<br /><em>예상 범위를 간단히.</em></>} description="기존 베리택스 보수표를 기준으로 한 참고용 간편 견적입니다." />
      <section className="section fee-section section-cream">
        <div className="fee-intro">
          <span className="eyebrow">HOW IT WORKS</span>
          <h2>개인정보 없이<br />먼저 계산합니다.</h2>
          <p>업무 유형과 연 매출 규모만 브라우저 안에서 계산합니다. 이름과 연락처는 받지 않으며, 상담이 필요할 때만 보안 상담 페이지로 이동합니다.</p>
          <ul><li><Check size={16} /> 서버 전송 없는 즉시 계산</li><li><Check size={16} /> 이름·전화번호 미수집</li><li><Check size={16} /> 상담 페이지에서 분야 자동 선택</li></ul>
        </div>
        <div className="fee-calculator" aria-labelledby="fee-calculator-title">
          <span className="eyebrow">QUICK CALCULATOR</span>
          <h2 id="fee-calculator-title">세무 보수 간편 계산</h2>
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
            <strong>{fee ? `${fee.toLocaleString("ko-KR")}원~` : "업무와 규모를 선택해 주세요"}</strong>
            <small>VAT 별도 · 자료 상태와 업무 범위에 따라 달라질 수 있습니다.</small>
          </output>
          {fee && consultationService ? (
            <Link className="submit-button fee-consult-link" to={`/consultation?service=${encodeURIComponent(consultationService)}`}>이 견적으로 상담하기 <ArrowRight /></Link>
          ) : (
            <span className="submit-button fee-consult-link is-disabled" aria-disabled="true">두 항목을 먼저 선택해 주세요</span>
          )}
          <p className="fee-local-note"><Lock size={14} /> 선택값과 계산 결과는 저장하거나 외부로 전송하지 않습니다.</p>
        </div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function ConsultationPage() {
  return (
    <>
      <PageHero index="07" eyebrow="SECURE CONSULTATION" title={<>필요한 내용만,<br /><em>안전하게 접수합니다.</em></>} description="외부 설문으로 이동하지 않는 베리택스 전용 상담 신청 페이지입니다." />
      <section className="section consultation-page-section">
        <div className="consultation-sidebar">
          <span className="eyebrow">BEFORE YOU BEGIN</span>
          <h2>상담 전<br />확인해 주세요.</h2>
          <ol><li><span>01</span>상담 분야와 중요한 기한을 적어 주세요.</li><li><span>02</span>민감한 번호와 원본 서류는 보내지 않습니다.</li><li><span>03</span>담당자 확인 후 안전한 자료 전달 방법을 안내합니다.</li></ol>
          <div className="privacy-promise"><Lock /><p>신청 원문은 전송 즉시 별도 키로 암호화되며 공개 조회 API를 두지 않습니다.</p></div>
        </div>
        <ConsultationForm />
      </section>
      <section className="section faq-section section-cream">
        <SectionHeading eyebrow="FAQ" title={<>상담 전에 많이<br />묻는 질문.</>} />
        <div className="faq-list">
          {faqs.map((faq, index) => <details key={faq.question}><summary><span>0{index + 1}</span>{faq.question}</summary><p>{faq.answer}</p></details>)}
        </div>
      </section>
    </>
  );
}

export function LocationPage() {
  return (
    <>
      <PageHero index="08" eyebrow="LOCATION" title={<>차분히 이야기할 수 있는<br /><em>상담 공간.</em></>} description="사전 예약 시 주말 상담도 가능합니다." />
      <section className="section location-section">
        <div className="location-info">
          <span className="eyebrow">SEOUL · GANGDONG</span><h2>정은정<br />세무회계컨설팅</h2>
          <div className="location-row"><MapPin /><div><strong>주소</strong><p>서울특별시 강동구 고덕비즈밸리로 26<br />B동 2층 202호</p></div></div>
          <div className="location-row"><Phone /><div><strong>전화</strong><p><a href="tel:02-6426-1654">02-6426-1654</a></p></div></div>
          <div className="location-row"><span className="clock-icon" aria-hidden="true">09</span><div><strong>운영시간</strong><p>평일 09:00–18:00<br />사전 예약 시 주말 상담 가능</p></div></div>
          <div className="map-links"><a href="https://map.kakao.com/link/search/정은정세무회계컨설팅" target="_blank" rel="noopener noreferrer">카카오맵 <ArrowUpRight /></a><a href="https://map.naver.com/v5/search/정은정세무회계컨설팅" target="_blank" rel="noopener noreferrer">네이버지도 <ArrowUpRight /></a></div>
        </div>
        <VisualPlaceholder label="LOCATION MAP" caption="최종 지도 또는 건물 외관 이미지 영역" tone="light" />
      </section>
      <section className="section transit-section section-cream">
        <div><span>SUBWAY + BUS</span><h3>대중교통</h3><p>5호선 고덕역 4번 출구에서 강동01번 버스 탑승 후 지식산업센터 정류장 하차</p><p>5호선 고덕역 1번 출구에서 강동02번 버스 탑승 후 지식산업센터 정류장 하차</p></div>
        <div><span>PARKING</span><h3>주차</h3><p>내비게이션에 ‘정은정 세무회계컨설팅’을 검색해 주세요.</p><p>건물 내 주차 2시간 무료</p></div>
      </section>
      <ConsultationBand />
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageHero index="09" eyebrow="PRIVACY" title={<>개인정보는<br /><em>필요한 만큼만.</em></>} description="상담을 위해 어떤 정보를 왜 처리하는지 투명하게 안내합니다." />
      <section className="section policy-section">
        <aside><strong>시행일</strong><span>2026.09.02</span><a href="#collection">수집 항목</a><a href="#retention">보유 기간</a><a href="#security">안전성 조치</a><a href="#rights">이용자 권리</a></aside>
        <div className="policy-copy">
          <div className="policy-notice"><Lock /><p>이 페이지의 상담 신청서는 외부 설문, 광고·분석 도구, 제3자 이미지 서버로 원문을 전송하지 않습니다.</p></div>
          <h2>개인정보 처리방침</h2>
          <p>정은정 세무회계컨설팅(이하 “사무소”)은 상담 신청자의 개인정보를 보호하고 관련 문의를 신속하게 처리하기 위해 다음과 같이 개인정보 처리 기준을 공개합니다.</p>
          <h3 id="collection">1. 처리 목적과 수집 항목</h3>
          <div className="policy-table"><div><strong>목적</strong><span>상담 신청 확인, 연락, 서비스 적합성 판단</span></div><div><strong>필수 항목</strong><span>상담 분야, 성함, 연락처, 상담 내용, 동의 여부</span></div><div><strong>선택 항목</strong><span>이메일, 선호 연락 방식</span></div><div><strong>수집하지 않는 항목</strong><span>주민등록번호, 계좌·카드번호, 비밀번호, 인증서 정보, 첨부 서류</span></div></div>
          <h3 id="retention">2. 보유 및 이용 기간</h3><p>상담 신청 정보는 접수일로부터 90일 동안 보유한 뒤 자동 삭제합니다. 상담 계약이 체결되어 별도 법적 보존 의무가 발생하는 정보는 별도 절차와 안내에 따라 분리 처리합니다.</p>
          <h3>3. 제3자 제공 및 처리 환경</h3><p>사무소는 상담 신청 원문을 외부 설문·광고·분석 업체에 제공하지 않습니다. 웹 서비스 운영을 위해 Railway의 호스팅·영구 볼륨 인프라를 이용하며, 저장되는 원문은 애플리케이션 전용 키로 추가 암호화합니다. 실제 운영 계약의 저장 지역과 국외 이전 고지는 공개 전 운영자가 최종 확인합니다.</p>
          <h3 id="security">4. 안전성 확보 조치</h3><ul><li>전송 구간 HTTPS 강제와 인증서 상태 자동 점검</li><li>AES-256-GCM 방식의 애플리케이션 계층 암호화</li><li>공개 조회 API 미제공 및 복호화 키의 운영 환경 분리</li><li>요청 횟수 제한, CSRF 검증, 입력값 검증, 보안 헤더 적용</li><li>상담 페이지의 외부 스크립트·폰트·분석 픽셀 차단</li><li>90일 경과 데이터의 자동 삭제</li></ul>
          <h3 id="rights">5. 이용자의 권리와 행사 방법</h3><p>신청자는 자신의 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 본인 확인 후 지체 없이 처리합니다.</p>
          <h3>6. 개인정보 보호 문의</h3><p>개인정보 관련 문의와 권리 행사는 대표번호 <a href="tel:02-6426-1654">02-6426-1654</a>로 연락해 주세요.</p>
          <h3>7. 방침 변경</h3><p>처리 방식이나 위탁 관계가 달라지면 변경 내용과 시행일을 이 페이지에 공개합니다.</p>
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return <section className="not-found"><span>404</span><h1>페이지를 찾을 수 없습니다.</h1><p>주소가 바뀌었거나 존재하지 않는 페이지입니다.</p><Link className="button button-dark" to="/">홈으로 돌아가기 <ArrowRight /></Link></section>;
}

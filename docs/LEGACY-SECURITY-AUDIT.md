# 기존 운영 페이지 점검 기록

점검일: 2026-09-02
대상: `https://veritax.co.kr/`

> 이 주소는 2026-09-02 Railway 운영 주소로 교체했습니다. 아래 내용은 기존 경고의 원인 기록입니다.

## 확인한 문제

### 1. 사용자 도메인과 인증서 불일치 — 치명적

`veritax.co.kr`과 `www.veritax.co.kr` 모두 사용자 도메인이 없는 `*.netlify.app` 인증서를 제시합니다. 브라우저의 `NET::ERR_CERT_COMMON_NAME_INVALID` 경고는 정상적인 보호 동작입니다. 상세 원인과 콘솔 복구 순서는 [TLS-RECOVERY.md](TLS-RECOVERY.md)에 기록했습니다.

### 2. 견적 상담 버튼이 실제로 접수하지 않음 — 높음

기존 `submitEstimate()`는 이름과 연락처 입력 여부만 확인한 뒤 접수 완료 알림을 표시하며 서버에 저장하거나 담당자에게 전달하지 않습니다. 사용자는 접수됐다고 오인할 수 있습니다.

새 구현은 견적 단계에서 개인정보를 받지 않고, 로컬 계산 후 실제 보안 상담 폼으로 연결합니다. 상담 API가 저장에 실패하면 성공 화면을 표시하지 않습니다.

### 3. 브라우저에서 외부 AI API 직접 호출 및 응답 HTML 삽입 — 높음

기존 뉴스 기능은 브라우저에서 `api.anthropic.com`을 직접 호출하고 응답값을 `innerHTML`로 렌더링합니다. 인증 구성이 없어 정상 동작하기 어렵고, 외부 응답이 오염되면 DOM 기반 XSS 경로가 될 수 있습니다. 또한 방문자 브라우저가 제3자 API에 직접 연결됩니다.

새 구현은 이 호출과 `innerHTML` 사용을 제거했습니다. 인사이트는 React의 기본 이스케이프를 거치며 외부 분석·광고·AI 스크립트를 로드하지 않습니다.

### 4. 브라우저 보안 헤더 부족 — 높음

기존 응답에는 HSTS만 있고 CSP, `X-Content-Type-Options`, `Referrer-Policy`, frame 차단 정책이 없습니다. 새 배포 구성에는 동일 출처만 허용하는 CSP, Trusted Types 요구, inline script/style 차단, frame 차단, no-referrer와 MIME sniffing 차단을 적용했습니다.

### 5. 제3자 이미지와 HTTP 외부 링크 — 중간

기존 페이지는 외부 이미지 서버를 사용하고 카카오 채널을 `http://`로 연결합니다. 새 구현은 이미지 담당자가 자사 정적 파일로 교체할 수 있는 자리만 두었고, 상담 화면에는 제3자 리소스가 없습니다.

## 회귀 방지

- 상담 API 단위·경계 테스트와 프로덕션 빌드
- Gitleaks, npm audit, CodeQL, Dependabot
- 주간 OWASP ZAP 수동형 운영 점검
- 일일 인증서 호스트명·체인·만료·HSTS 점검
- 외부 연결을 차단하는 CSP와 공개 읽기 API 미제공
- 보안 관련 파일 CODEOWNERS 검토

운영 인증서 복구와 Netlify 환경변수 설정은 계정 권한이 필요한 별도 배포 단계입니다.

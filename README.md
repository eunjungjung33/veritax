# VERITAX — 정은정 세무회계컨설팅

기존 운영 사이트와 법무법인 웨이브의 정보 구조를 바탕으로 새로 구성한 React + Netlify 애플리케이션입니다. 외부 이미지, 외부 폰트, 외부 상담 폼, 방문 분석 스크립트를 사용하지 않습니다.

## 제공 기능

- 소개, 전문가, 업무영역, 특별 서비스, 세무 인사이트, 수행 경험, 오시는 길
- 개인정보를 받지 않는 세무 보수 간편 계산과 보안 상담 연결
- 반응형 내비게이션과 접근성 기본 지원
- 같은 출처에서만 동작하는 보안 상담 신청
- CSRF 토큰, 입력 검증, 허니팟, Netlify 플랫폼 IP 제한
- 상담 원문 AES-256-GCM 추가 암호화 및 90일 자동 삭제
- 공개 상담 조회 API 없음
- CSP/HSTS 등 보안 헤더
- Gitleaks, npm audit, CodeQL, 일일 TLS 인증서 모니터링

## 로컬 실행

```bash
npm install
npm run dev
```

정적 화면은 Vite로 확인할 수 있습니다. 상담 API까지 확인하려면 `.env.example`의 값을 별도 키로 채운 뒤 Netlify CLI의 로컬 개발 환경을 사용하세요. 실제 키는 저장소에 커밋하지 마세요.

## 배포 전 필수 설정

1. Netlify 환경변수에 `CONSULTATION_ENCRYPTION_KEY`, `CSRF_SECRET`, `CONSULTATION_KEY_VERSION`을 설정합니다.
2. 두 비밀값은 각각 독립된 32바이트 이상의 난수로 만들고 production 컨텍스트에만 둡니다.
3. `veritax.co.kr`과 `www.veritax.co.kr`을 같은 Netlify 사이트의 custom domain으로 등록하고 인증서가 두 호스트를 모두 포함하는지 확인합니다.
4. [기존 페이지 점검 기록](docs/LEGACY-SECURITY-AUDIT.md), [TLS 복구 문서](docs/TLS-RECOVERY.md), [보안 운영 문서](docs/SECURITY-OPERATIONS.md)를 확인합니다.
5. 개인정보 처리방침의 Netlify 저장 지역·국외 이전 문구는 실제 계약정보에 맞춰 최종 법률 검토합니다.

## 품질 확인

```bash
npm run check
npm run security:audit
npm run security:secrets
npm run tls:check
```

`tls:check`는 운영 도메인을 검사하므로 인증서 복구 전에는 의도적으로 실패합니다.

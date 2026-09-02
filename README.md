# 정은정 세무회계컨설팅

정은정 세무회계컨설팅(영문 표기: JEJ TAX ACCOUNTING ADVISORY)의 React + Railway/Netlify 홈페이지입니다.

## 제공 기능

- 홈, 구성원(대표/고문), 주요 업무영역, 견적, 세무 뉴스, 찾아오시는 길
- 업무 유형·연 매출 규모 기반 예상 보수 자동 계산
- CSRF 검증, 입력값 검증, 요청 제한, AES-256-GCM 암호화를 적용한 상담 신청
- 전 페이지 카카오톡·전화 플로팅 버튼 및 하단 상담 CTA
- 데스크톱·태블릿·모바일 반응형 내비게이션
- 네이버 블로그 원문 연결형 세무 뉴스 목록
- OpenStreetMap 임베드와 카카오맵·네이버지도 바로가기

## 로컬 실행

```bash
npm install
npm run dev
```

정적 화면은 Vite로 확인할 수 있습니다. 상담 API까지 확인하려면 `npm run build` 후 `.env.example`의 값을 별도 키로 채우고 `npm start`를 사용하세요. 실제 키는 저장소에 커밋하지 마세요.

## 콘텐츠 수정 위치

- 메뉴·구성원 약력·업무영역·세무 뉴스: `src/data/content.ts`
- 견적 금액표: `src/data/fees.ts`
- 대표/고문 화면 구성과 주소·교통 정보: `src/pages.tsx`
- 공통 헤더·푸터·플로팅 상담 버튼: `src/components/Layout.tsx`

세무 뉴스는 현재 관리자 수동 등록 방식입니다. 네이버 블로그의 제목·요약·원문 링크를 `insights` 배열에 추가하면 카드가 자동으로 늘어납니다.

## 이미지 교체

`public/images/office-hero-1.jpg`, `public/images/office-hero-2.jpg`는 인물과 상호가 없는 임시 오피스 배경입니다. 실제 사무실 사진을 같은 파일명으로 교체하면 켄번스 슬라이드에 바로 반영됩니다. 대표·고문 프로필은 `src/pages.tsx`의 `PortraitPlaceholder` 위치를 로컬 `<img>`로 교체하세요.

## 상담 접수 운영

상담 원문은 전송 즉시 암호화되어 공개 조회 API 없이 저장됩니다. 운영자는 별도 복호화 키를 사용해 `scripts/decrypt-consultation.mjs`로 접수 내용을 확인합니다. 이메일 또는 카카오톡 알림 연동은 수신 주소·채널과 개인정보 전송 범위를 확정한 뒤 연결해야 합니다.

## 배포 전 필수 설정

1. 비밀 환경변수에 `CONSULTATION_ENCRYPTION_KEY`, `CSRF_SECRET`, `CONSULTATION_KEY_VERSION`을 설정합니다.
2. Railway에서는 `consultation-data` 볼륨을 `/data`에 마운트하고 `CONSULTATION_STORAGE_DIR=/data/consultations`로 설정합니다.
3. 개인정보 처리방침의 저장 지역·국외 이전 문구를 실제 운영 계약에 맞춰 최종 검토합니다.
4. 실제 사무실 사진과 대표·고문 프로필 사진을 최종 제공본으로 교체합니다.

## 품질 확인

```bash
npm run check
npm run security:audit
npm run security:secrets
npm run tls:check
```

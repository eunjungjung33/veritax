# 정은정 세무회계컨설팅

정은정 세무회계컨설팅(영문 표기: JEJ TAX ACCOUNTING ADVISORY)의 React + Netlify 홈페이지입니다. (운영 사이트: Netlify `capable-begonia-05d189`, 도메인 veritax.co.kr)

## 제공 기능

- 홈, 구성원(대표/고문), 주요 업무영역, 견적, 세무 뉴스, 찾아오시는 길
- 업무 유형·연 매출 규모 기반 예상 보수 자동 계산
- CSRF 검증, 입력값 검증, 요청 제한, AES-256-GCM 암호화를 적용한 상담 신청
- 전 페이지 카카오톡·전화 플로팅 버튼 및 하단 상담 CTA
- 데스크톱·태블릿·모바일 반응형 내비게이션
- 자체 도메인에 게시하는 세무 칼럼(세무 뉴스): 목록·개별 URL·제목/메타 태그·사이트맵 자동 생성
- OpenStreetMap 임베드와 카카오맵·네이버지도 바로가기

## 로컬 실행

```bash
npm install
npm run dev
```

정적 화면은 Vite로 확인할 수 있습니다. 상담 API까지 확인하려면 `npm run build` 후 `.env.example`의 값을 별도 키로 채우고 `npm start`를 사용하세요. 실제 키는 저장소에 커밋하지 마세요.

## 콘텐츠 수정 위치

- 메뉴·구성원 약력·업무영역·히어로 통계: `src/data/content.ts`
- 세무 뉴스 칼럼 원고: `content/columns/` (아래 참고)
- 견적 금액표: `src/data/fees.ts`
- 대표/고문 화면 구성과 주소·교통 정보: `src/pages.tsx`
- 공통 헤더·푸터·플로팅 상담 버튼: `src/components/Layout.tsx`

## 세무 뉴스(칼럼) 등록 방법

세무 뉴스는 네이버 블로그 연동 없이 홈페이지 안에 직접 게시합니다. 텍스트 파일 하나가 칼럼 하나입니다.

1. `content/columns/` 폴더에 `.md` 또는 `.txt` 파일을 추가합니다. 파일명 예: `2026-09-10-법인-설립-전-체크리스트.md` (파일명이 곧 주소가 됩니다).
2. 파일 맨 위에 아래 머리말을 적고, 빈 줄 하나 뒤에 본문을 씁니다.

```text
제목: 법인 설립 전 꼭 확인할 세무 체크리스트
날짜: 2026-09-10
분류: 법인세
요약: 검색 결과와 목록 카드에 노출되는 한두 문장 설명

본문 첫 문단입니다. 문단은 빈 줄로 구분합니다.

## 소제목
- 항목은 하이픈으로 시작합니다.
1. 번호 목록도 됩니다.
**굵게** 표시할 수 있습니다.
```

3. 저장소에 커밋한 뒤 Netlify 배포(`npx netlify-cli deploy --prod --build --site 0aa6be1f-9eeb-430c-a4e4-205cb7728da5`, 토큰은 `NETLIFY_AUTH_TOKEN`)를 실행하면 반영됩니다. Netlify 콘솔에서 GitHub 저장소를 연결해 두면 이후에는 push만으로 자동 배포됩니다. 파일을 직접 다루기 어려우면 원고 파일을 제작 업체에 전달해 등록을 요청하세요.

빌드 시 `scripts/prerender-columns.ts`가 칼럼마다 `/insights/<파일명>` 정적 페이지(제목 태그·메타 디스크립션·본문 포함)와 `sitemap.xml` 항목을 생성하므로 검색엔진이 각 칼럼을 개별 페이지로 수집합니다.

## 이미지 교체

메인 히어로는 `src/components/HeroFilm.tsx`에서 `src/assets/hero-one-take.mp4`와 `src/assets/hero-gold-path-poster.jpg`를 사용합니다. 데스크톱에서는 영상을 자동 반복 재생하고, 모바일·데이터 절약·저감 모션 환경에서는 포스터를 먼저 표시한 뒤 재생 버튼으로 영상을 시작할 수 있습니다. 대표·고문 프로필은 `src/pages.tsx`의 `PortraitPlaceholder` 위치를 실제 촬영 이미지로 교체하세요.

`public/images/office-hero-1.jpg`, `public/images/office-hero-2.jpg`는 이전 히어로 시안 보관용이며 현재 화면에서는 사용하지 않습니다.

## 상담 접수 운영

상담 원문은 전송 즉시 암호화되어 공개 조회 API 없이 저장됩니다. 운영자는 별도 복호화 키를 사용해 `scripts/decrypt-consultation.mjs`로 접수 내용을 확인합니다. 이메일 또는 카카오톡 알림 연동은 수신 주소·채널과 개인정보 전송 범위를 확정한 뒤 연결해야 합니다.

## 배포 전 필수 설정

1. 비밀 환경변수에 `CONSULTATION_ENCRYPTION_KEY`, `CSRF_SECRET`, `CONSULTATION_KEY_VERSION`을 설정합니다.
2. Netlify에서는 상담 원문이 Netlify Blobs에 암호화 저장되므로 별도 볼륨 설정이 없습니다. (Railway 배포는 2026-09-09에 종료했습니다.)
3. 개인정보 처리방침의 저장 지역·국외 이전 문구를 실제 운영 계약에 맞춰 최종 검토합니다.
4. 실제 사무실 사진과 대표·고문 프로필 사진을 최종 제공본으로 교체합니다.

## 품질 확인

```bash
npm run check
npm run security:audit
npm run security:secrets
npm run tls:check
```

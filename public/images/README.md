# 이미지 교체 위치

현재 화면은 외부 이미지나 추적 가능한 CDN을 사용하지 않고 CSS 플레이스홀더로 구성되어 있습니다.
최종 이미지 파일은 이 폴더에 저장하고 React 컴포넌트의 `VisualPlaceholder`를 로컬 `<img>`로 교체하세요.
각 자리에는 `data-media-slot` 속성이 있어 브라우저 검사와 코드 검색으로 교체 지점을 바로 찾을 수 있습니다.

- `principal-portrait.webp`: 대표 공인회계사 인물 사진
- `office.webp`: 사무실/상담 공간
- `hero.webp`: 메인 히어로 이미지
- `hero.mp4`: 메인 히어로 영상을 쓰는 경우의 로컬 원본 (`muted`, `playsInline`, 포스터 이미지 필수)
- `insights/*.webp`: 콘텐츠 썸네일

개인정보 페이지와 상담 페이지에는 제3자 픽셀, 외부 폰트, 원격 이미지를 추가하지 마세요.

# 상담 데이터 보안 운영

## 키 생성과 보관

두 키는 서로 다른 난수로 생성합니다.

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

- `CONSULTATION_ENCRYPTION_KEY`: 상담 원문 암호화
- `CSRF_SECRET`: 요청 위조 방지 토큰 서명
- `CONSULTATION_KEY_VERSION`: 현재 키 식별자. 예: `2026-09-v1`

키는 Netlify production 환경변수와 승인된 오프라인 복구 보관소에만 둡니다. Deploy Preview, 로컬 공용 파일, GitHub Secrets가 필요 없는 워크플로에는 제공하지 않습니다.

## 상담 확인 절차

1. Netlify Blobs의 `veritax-consultations` 저장소에서 필요한 키의 JSON을 승인된 업무용 장치로 내려받습니다.
2. 다운로드한 파일은 암호문이어야 하며 `ciphertext`, `iv`, `authTag`, `keyVersion`만 포함하는지 확인합니다.
3. 승인된 장치에서 다음 명령으로 새 출력 파일에 복호화합니다. 기존 파일 덮어쓰기는 차단되어 있습니다.

```bash
CONSULTATION_ENCRYPTION_KEY="..." node scripts/decrypt-consultation.mjs \
  --input encrypted.json \
  --output consultation.decrypted.json
```

4. 평문은 터미널에 출력되지 않습니다. 업무가 끝나면 조직의 문서 보존 기준에 따라 안전하게 파기합니다.
5. 암호문 키나 평문을 메신저, 개인 이메일, 공개 이슈에 붙여 넣지 않습니다.

## 보존과 삭제

- 기본 보존기간은 90일입니다.
- `cleanup-consultations` 예약 함수가 매일 오래된 항목을 삭제합니다.
- 보존기간은 1~365일 범위에서만 설정할 수 있습니다.
- 상담 계약으로 전환된 기록은 이 저장소 밖의 승인된 고객관리 절차로 별도 이관하고 목적과 보존기간을 다시 고지합니다.

## 사고 대응

상담 데이터 노출이 의심되면 다음 순서로 대응합니다.

1. 상담 접수 함수를 일시 비활성화하거나 유지보수 응답으로 전환합니다.
2. 암호화 키와 CSRF 비밀값을 각각 회전합니다.
3. Netlify deploy/function 로그와 GitHub 변경 이력을 확인하되 로그에 개인정보를 추가하지 않습니다.
4. 영향받은 키 버전과 기간을 확인합니다.
5. 법정 통지 의무와 당사자 안내 필요성을 개인정보 보호 책임자와 검토합니다.

## 배포 보호

- GitHub Actions는 읽기 전용 토큰을 기본으로 사용합니다.
- 외부 Action은 태그가 아니라 커밋 SHA로 고정합니다.
- workflow, function, `netlify.toml` 변경은 CODEOWNERS 승인을 받습니다.
- Gitleaks, CodeQL, npm audit, 테스트와 빌드가 통과해야 배포합니다.
- Gitleaks Action은 Node 24 기반 v3의 불변 커밋 SHA로 고정합니다. Node 20 기반 v2는 2026-09-16 이후 GitHub 호스팅 러너에서 실행되지 않습니다.
- Netlify 함수 요청 제한의 `windowSize`는 플랫폼 허용 최대값인 180초를 넘기지 않으며 자동 테스트로 고정합니다.

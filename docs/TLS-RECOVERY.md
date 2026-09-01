# veritax.co.kr TLS 장애 진단과 복구

> 현재 운영 주소는 `https://web-production-43f8e.up.railway.app/`입니다. 아래 절차는 기존 사용자 도메인을 다시 사용하려는 경우를 위한 기록입니다.

## 확인된 원인

2026-09-02 점검 결과 두 호스트 모두 `veritax.co.kr`용 인증서가 아니라 Netlify 기본 인증서를 반환합니다.

- `veritax.co.kr` DNS: `75.2.60.5` (Netlify apex 주소)
- `www.veritax.co.kr` DNS: `capable-begonia-05d189.netlify.app` CNAME
- 공개 DNS CAA 응답: 레코드 없음(발급 CA 제한 없음)
- 실제 제시 인증서 Subject: `CN=*.netlify.app`
- 실제 SAN: `*.netlify.app`, `netlify.app`
- 브라우저 오류: `NET::ERR_CERT_COMMON_NAME_INVALID`

즉 DNS는 Netlify를 가리키지만, 현재 Netlify 사이트에 두 사용자 도메인을 포함한 인증서가 정상 발급·연결되지 않았습니다. 애플리케이션 코드나 브라우저의 문제가 아닙니다. 저장소 배포만으로 Netlify 계정의 custom domain 연결 상태를 변경할 수 없으므로 아래 콘솔 조치가 필요합니다.

## 복구 절차

1. Netlify에서 현재 운영 중인 `capable-begonia-05d189` 프로젝트를 엽니다.
2. Domain management에서 `veritax.co.kr`과 `www.veritax.co.kr`이 **같은 프로젝트**에 등록되어 있는지 확인합니다.
3. `veritax.co.kr`을 primary domain으로 지정합니다.
4. 다른 Netlify 프로젝트에 같은 도메인이 중복 연결되어 있으면 운영 소유권을 확인한 뒤 중복을 해제합니다.
5. HTTPS/TLS 영역에서 DNS 검증을 다시 실행하고 인증서 발급 또는 갱신을 요청합니다.
6. 2026-09-02 점검 시 CAA 레코드는 없었습니다. 이후 CAA를 추가했다면 Netlify가 사용하는 CA 발급을 차단하지 않는지 다시 확인하되, 현재 레코드를 확인하지 않고 임의 변경하지 마세요.
7. 아래 명령이 두 호스트 모두 성공할 때까지 운영 홍보나 상담 접수를 재개하지 않습니다.

```bash
curl -fsSI https://veritax.co.kr/
curl -fsSI https://www.veritax.co.kr/
npm run tls:check
```

8. 인증서가 정상화된 뒤 GitHub Actions의 `TLS and security header monitor`를 수동 실행해 통과를 확인합니다.

## 재발 방지

- 일일 모니터가 호스트명 검증, 체인 검증, 14일 이내 만료, HSTS 누락을 실패로 처리합니다.
- `www`는 `netlify.toml`에서 apex로 강제 리디렉션합니다.
- 도메인과 인증서 변경은 한 명이 실행하고 다른 한 명이 검증합니다.
- Netlify 도메인 알림과 GitHub Actions 실패 알림을 운영 책임자 이메일에 연결합니다.
- 인증서가 유효하지 않은 상태에서 HSTS를 우회하거나 사용자에게 브라우저 경고 무시를 안내하지 않습니다.

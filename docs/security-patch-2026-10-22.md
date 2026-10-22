# 보안 패치 — 2026-10-22

## 수정 내용
- 공개 프런트엔드의 고정 관리자 비밀번호 및 localStorage 기반 관리자 세션 제거.
- Firebase 이메일/비밀번호 또는 Google 인증으로만 로그인. 지정 관리자 이메일과 이메일 인증 완료를 함께 검사.
- 인증 실패, Firebase 미설정, 비관리자 상태의 쓰기는 즉시 실패. 브라우저에만 저장한 뒤 성공으로 표시하던 경로 제거.
- 실제 쓰기 권한은 Firestore Rules에서 독립적으로 강제.
- 회사/서비스/포트폴리오 문서의 허용 필드, 링크와 이미지 유형/크기를 제한. 생성 시간 변경 금지 유지. system 문서는 관리자만 읽기 가능.
- 공개 페이지 읽기에서 실행되던 로고 변경 쓰기 제거.
- 포트폴리오 편집 시 id/createdAt을 수정 payload에서 제외. JPEG/PNG/WebP 데이터 이미지는 최대 350,000자로 허용해 기존 업로더와 맞춤.
- RSS API: GET만 허용, 중복 blog 매개변수 거부, 기존 블로그 허용 목록 유지, 리다이렉트 금지, 전체 요청 8초 및 응답 2MiB 제한, 오류 캐시 금지.
- 보안 헤더 추가. Firebase Google 팝업을 방해할 수 있는 COOP 헤더는 추가하지 않음.
- Vite 개발 서버를 루프백에 바인딩. Vercel은 npm ci로 검증한 package-lock.json을 사용.
- Vite, sharp, source-map-js 보안 업데이트. gRPC와 PostCSS selector parser는 수정 버전으로 override; Firebase 에뮬레이터와 전체 빌드에서 호환성 검증.

## 검증
- npm run lint
- npm test (보안 회귀 테스트 포함)
- npm run build (1,591개 공개 경로)
- npm run audit:seo
- Firebase 에뮬레이터에서 익명/다른 사용자/미인증 이메일 쓰기 거부, 공개 읽기, 관리자 CRUD, 스키마/URL/타임스탬프/이미지 검증.
- npm audit --omit=dev: 알려진 취약점 0개.
- 전체 npm audit: 14개 영향 패키지에서 5개로 감소. 남은 항목은 braces <=3.0.3의 중첩 패턴 서비스 거부 취약점 및 이를 사용하는 Tailwind 3 빌드 의존성(chokidar, micromatch, fast-glob, tailwindcss). 조회 시 braces 수정 버전 없음. 브라우저 배포 코드에 포함되는 의존성이 아니지만 신뢰하지 않는 소스를 빌드하면 위험할 수 있음. Tailwind 4 전환은 CSS 마이그레이션 및 시각적 회귀 검증이 필요하므로 이번 인증/API 패치에 섞지 않음.

## 배포 전 확인 및 반영
1. 공개 코드에 있던 기존 비밀번호는 유출된 것으로 취급한다. 다른 계정에서 재사용했다면 변경한다. 이 패치는 Git 과거 이력/기존 배포 파일을 삭제하지 않는다.
2. Firebase Authentication에서 지정 관리자 계정이 존재하고 이메일 인증이 완료됐는지 확인한다. Google 또는 이메일/비밀번호 공급자를 활성화하고 실제 관리자 로그인을 검증한다. 기존 브라우저 자체 아이디는 폐기된다. 비밀번호를 소스나 채팅에 전달하지 않는다.
3. 기존 데이터의 필드/링크가 강화된 스키마와 일치하는지 관리자 콘솔에서 확인한다. 신규 규칙은 읽기 데이터를 삭제하지 않지만 규격 밖 기존 문서를 수정할 때 거부할 수 있다.
4. Java 21+와 Firebase CLI가 있는 환경에서 로컬 규칙 테스트:
   firebase emulators:exec --only firestore --project demo-neutiul-security "npm run test:rules"
   테스트는 데모 프로젝트를 사용하고 FIRESTORE_EMULATOR_HOST 없이 실행하지 않는다.
5. 실제 프로젝트 권한으로 로그인 후 규칙 배포:
   firebase deploy --only firestore:rules --project project-d3a46906-dd76-40a2-9ed
   firebase.json은 운영의 명명된 데이터베이스 ai-studio-0808-84969666-e5d5-45d6-9343-2a2105407806을 지정한다. Vercel/Git 배포만으로 이 규칙이 배포되지는 않는다.
6. 검토한 코드 브랜치를 병합하고 Vercel 배포 결과 확인. 관리자 로그인/저장/로그아웃, 공개 페이지, 네이버 피드, 견적 폼 정상 동작 확인.
7. npm run audit:seo -- --origin=https://www.neutiul.com

## 범위와 한계
저장소 기준 점검 및 로컬 검증이다. 현재 운영 Firestore 규칙, 사용자 계정, 실제 관리자 로그인, 호스팅 설정과 운영 배포 상태를 인증된 콘솔에서 검증한 것은 아니다.
Firestore 권한은 클라이언트 UI와 독립적이다. 기존 UI 우회가 실제 운영 DB 쓰기까지 가능했다는 증거는 확인하지 않았다.
App Check/서비스별 할당량은 콘솔 접근과 실제 트래픽을 바탕으로 별도 설정할 수 있다.
참고: https://firebase.google.com/docs/firestore/security/rules-fields
## 운영 반영 기록 — 2026-10-22
Firebase 콘솔에서 지정 관리자 Google 계정, Google 공급자 활성화, neutiul.com 및 www.neutiul.com 승인 도메인을 확인했다. 운영 공급자에 맞춰 관리자 UI는 Google 로그인만 제공한다.
운영의 명명된 데이터베이스에 보안 규칙을 게시했으며, 콘솔 게시 이력의 새 활성 버전을 확인했다. 편집기 원문이 저장소 규칙과 일치하는지 게시 전에 비교했다.

# 친구들의 새벽방 🌧️

Discord 친구 그룹과 새벽 게임 문화에서 영감을 받은 2D 픽셀아트 소셜 시뮬레이션 게임

## 🎮 게임 소개

5명의 AI 캐릭터(김민선, 염톨이, 카몽, 변경근, 엉덩이)가 가상 공간을 돌아다니며 자동으로 대화하고 반응하는 게임입니다.

### 주요 기능
- 🎭 캐릭터 선택 및 플레이
- 💬 실시간 AI 대화 시스템
- 🎮 게임 트리거 ("발로 ㄱ?", "배그" 입력 시 자동 게임룸 전환)
- 🏠 3개의 방 (민선 개발방, 게임룸, 카몽집)
- 👤 엉덩이의 카몽집 자동 방문 이벤트

## 📦 설치 방법

### 1. 의존성 설치
```bash
pnpm install
```

npm이나 yarn을 사용하는 경우:
```bash
npm install
# 또는
yarn install
```

### 2. 개발 서버 실행
```bash
pnpm dev
```

npm이나 yarn을 사용하는 경우:
```bash
npm run dev
# 또는
yarn dev
```

### 3. 브라우저에서 열기
```
http://localhost:5173
```

## 🛠️ 기술 스택

- **React** 18.3.1
- **TypeScript**
- **Vite** 6.3.5
- **Tailwind CSS** 4.1.12
- **Motion** (Framer Motion) 12.23.24
- **Lucide React** (아이콘)

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── App.tsx                    # 메인 앱 로직
│   └── components/
│       ├── CharacterSelect.tsx    # 캐릭터 선택 화면
│       ├── layout/                # 레이아웃 컴포넌트
│       │   ├── TopBar.tsx
│       │   ├── LeftRooms.tsx
│       │   ├── CenterArea.tsx
│       │   ├── RightPanel.tsx
│       │   └── ChatBox.tsx
│       ├── screens/               # 스크린 컴포넌트
│       │   ├── DevTerminal.tsx
│       │   └── GameScreen.tsx
│       └── shared/                # 공유 컴포넌트
│           └── PixelChar.tsx
└── styles/
    ├── fonts.css
    ├── index.css
    └── theme.css
```

## 🎨 UI/UX

- **다크모드 + RGB 조명** 테마
- **픽셀아트** 캐릭터 및 UI
- **반응형 폰트** (clamp 사용)
- **데스크탑 전용** (1920×1080 권장)

## 🎯 게임 방법

1. **캐릭터 선택**: 5명 중 1명을 선택하여 입장
2. **채팅 참여**: 하단 채팅창에서 대화 입력
3. **게임 시작**: "발로 ㄱ?" 또는 "배그 킬게요" 입력 시 자동으로 게임룸으로 이동
4. **방 전환**: 좌측 패널에서 다른 방 선택 가능

## 📄 라이선스

MIT License

## 🤝 기여

이슈 및 풀 리퀘스트 환영합니다!

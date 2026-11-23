// Dates cover the first and latest public commits on the default branch.
// The Sewer is dated by the publication of its demo video.
window.portfolioCases = {
  SlideIt: {
    period: '2025.11–2026.10',
    status: '0.0.4 개발 기록',
    facts: [
      ['문제', '종이 명함은 연락처를 옮겨 적어야 하고, 디지털 명함은 상대가 열 수 있는 형식으로 건네야 합니다.'],
      ['설계와 구현', 'CameraX로 촬영한 명함에서 ML Kit로 글자를 읽고, 확인한 정보를 Room에 저장하도록 구현했습니다. 내 명함을 위로 밀면 vCard 파일을 Android 공유 창으로 보냅니다.'],
      ['결과', '받은 명함을 기기에서 검색하거나 즐겨찾기에 보관할 수 있습니다. 상대에게는 주소록에서 열 수 있는 연락처 파일이 전달됩니다.']
    ],
    links: [
      ['공유 화면 구현', 'https://github.com/nohseongmin/SlideIt/blob/master/app/src/main/java/com/example/slideit/ui/screens/CardShareScreen.kt'],
      ['버전별 변경 기록', 'https://github.com/nohseongmin/SlideIt/blob/master/CHANGELOG.md']
    ],
    image: {
      src: 'art/cases/slideit.webp',
      alt: 'Android 명함 공유 화면에 세로로 배치된 Example Studio의 예시 명함',
      caption: '로컬 Android 개발 빌드에서 가상 연락처로 촬영한 명함 공유 화면.'
    }
  },
  'the-sewer': { period: '2026.11', periodLabel: '데모 공개' },
  'typing-royale': {
    period: '2026.09–2026.11',
    status: '공개 플레이 일시 중단',
    facts: [
      ['문제', '타자 대결 중 상대의 문장을 바꾸더라도, 이미 친 내용과 막 입력하려는 단어는 그대로여야 합니다.'],
      ['설계와 구현', '입력이 끝난 구간과 다음 단어를 보호하고 그 뒤의 단어만 섞도록 구현했습니다. 방마다 Durable Object 하나가 대결 진행과 탈락을 관리합니다.'],
      ['결과', '문장 하나를 완성하면 상대에게 공격이 전해지고, 20초마다 가장 느린 참가자가 탈락합니다. 봇과 겨루는 연습 모드에서도 같은 규칙을 체험할 수 있습니다.'],
      ['운영 상태', '등급분류 대기 중으로 공개 플레이를 일시 중단했습니다. 원본 저장소에 로컬 실행 방법이 있습니다.']
    ],
    links: [
      ['연습 경기 시연 영상 (7초)', 'art/cases/typing-round.mp4'],
      ['문장 공격 규칙 구현', 'https://github.com/nohseongmin/typing-royale/blob/main/public/combat.js']
    ],
    image: {
      src: 'art/cases/typing-royale.webp',
      alt: '한국어 문장을 입력하며 두 봇과 겨루는 Typing Royale 연습 모드',
      caption: '공개 소스의 연습 모드를 로컬에서 실행해 촬영한 화면.'
    }
  },
  'tracking-ai': {
    period: '2026.10',
    status: '오프라인 실험',
    facts: [
      ['연구 질문', '공포 게임의 적이 플레이어를 추적하려면, 짧은 이동 기록만으로 3초 뒤 위치를 어느 정도 예측할 수 있을까요?'],
      ['실험 설계', '위치와 보행 상태를 여섯 시점에서 관측했습니다. 같은 설정 50개를 GRU·LSTM·MLP 각각에 적용해 150개 모델을 학습하고, 검증 데이터의 평균 거리 오차로 모델을 골랐습니다.'],
      ['측정 결과', '선정한 LSTM은 별도 테스트 표본 6,107,209개 중 4,497,928개에서 예측 위치가 실제 위치의 250 좌표 단위 이내였습니다(73.65%). 같은 기준으로 GRU는 72.69%, MLP는 69.32%였습니다.'],
      ['적용 범위', 'ESTA의 이동 구간을 사용한 오프라인 결과입니다. Unity에서 추적 행동으로 연결하는 단계는 후속 과제입니다.']
    ],
    links: [
      ['150개 실험 결과표', 'https://github.com/nohseongmin/tracking-ai/blob/main/results/sweep_150/comparison.csv'],
      ['ESTA 원자료', 'https://github.com/pnxenopoulos/esta'],
      ['그래프 이용 조건', 'https://creativecommons.org/licenses/by-sa/4.0/']
    ],
    image: {
      src: 'art/cases/tracking-ai.png',
      alt: '모델별 테스트 성공률 분포와 검증 데이터로 선정한 GRU, LSTM, MLP 결과를 표시한 실험 그래프',
      caption: '150개 모델의 실험 결과 원본 그래프. 제작 노성민 · 데이터 ESTA(Xenopoulos 외) · CC BY-SA 4.0.'
    }
  },
  abathur: { period: '2026.08–2026.11' },
  'gonggang-meet': { period: '2026.07–2026.11' },
  'rubber-duck-debugger': { period: '2026.07–2026.11' },
  'git-gardener': { period: '2026.08–2026.11' },
  'daily-tangle': { period: '2026.07–2026.11' },
  'mixtape-studio': { period: '2026.11' },
  'claude-code-silent-mode': { period: '2026.09–2026.11' },
  'claude-skill-finder': { period: '2026.09–2026.11' },
  'NOCAP-Extension': { period: '2026.03–2026.11' },
  VibeGuard: { period: '2026.06–2026.11' },
  'pairing-buddy': { period: '2026.08–2026.11', status: '프로토타입' },
  'stonks-atlas': { period: '2026.09–2026.11' },
  'songeum-lab': { period: '2026.09–2026.11' },
  'vs-arena': { period: '2026.07–2026.11' },
  Refuel: { period: '2026.06–2026.11' },
  'coding-rules': { period: '2026.07–2026.11' },
  python: { period: '2025.04–2026.10', status: '학습 기록' },
  'tic-tac-toe-plus': { period: '2025.03–2026.10', status: '기획 단계' },
  ophey: { period: '2026.05–2026.09' }
};

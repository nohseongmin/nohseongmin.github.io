(() => {
  'use strict';

  // These scenes are portfolio excerpts. Measured values and code are from the
  // corresponding projects. The miniature interactions use fictional sample data.
  const scenes = {
    slideit: {
      label: 'SlideIT의 위로 밀어 명함 공유 기능 예시',
      html: `<span class="pm-slide-backdrop"></span><span class="pm-phone">
        <span class="pm-status"><b>9:41</b><i></i></span>
        <span class="pm-appbar"><img class="pm-slide-logo" src="art/slideit-product.png" alt="">SlideIT</span>
        <span class="pm-device-card"><b>노성민</b><small>프리랜서 개발자</small></span>
        <span class="pm-phone-hint">위로 밀어 공유</span><span class="pm-homebar"></span></span>
        <span class="pm-swipe"><span class="pm-arrow" aria-hidden="true">↑</span><strong>명함 공유</strong><small>Android · 기능 재현</small></span>`
    },
    typing: {
      label: '타자 문장을 완성하면 상대의 남은 단어 순서가 바뀌는 규칙 시연',
      html: `<span class="pm-game-overlay"><span class="pm-game-label">문장 대결 <span>규칙 시연</span></span>
        <span class="pm-round"><small>나</small><strong>준비 <span data-typing-word>완료</span><i class="pm-caret"></i></strong></span>
        <span class="pm-opponent"><small>상대</small><span>지금 다시 <b data-typing-attack>모험을 함께</b> 떠나자</span></span>
        <span class="pm-game-feedback" data-typing-status>단어 순서 교란</span></span>`
    },
    abathur: {
      label: 'abathur 규칙집의 테스트 보고 예문을 압축하면 o200k_base 토큰 수가 13에서 9로 줄어든다.',
      html: `<span class="pm-diff">
        <span class="pm-diff-label"><b>/abathur</b> <span>규칙집 예문</span></span>
        <span class="pm-diff-row"><i>−</i><span>테스트를 실행해서 42개가 <br>모두 통과했습니다</span></span>
        <span class="pm-diff-row added"><i>+</i><strong>테스트 42개 전부 통과</strong></span>
        <span class="pm-bench"><b>13 → 9</b> 토큰 <small>이 문장 실측 · o200k_base</small></span></span>`
    },
    gonggang: {
      label: '예시 시간표 3개의 월요일 13–15시 공통 공강 표시',
      html: `<span class="pm-timetable"><span class="pm-time-title">공통 공강 <b>월요일</b></span>
        <span class="pm-schedule"><span></span><b>A</b><b>B</b><b>C</b>
        <small>11:00</small><i class="busy"></i><i></i><i class="busy"></i>
        <small>12:00</small><i></i><i class="busy"></i><i></i>
        <small>13:00</small><i class="free"></i><i class="free"></i><i class="free"></i>
        <small>14:00</small><i class="free"></i><i class="free"></i><i class="free"></i>
        <small>15:00</small><i class="busy"></i><i class="busy"></i><i></i></span>
        <span class="pm-slot-summary">3명 모두 가능 <b>13:00–15:00</b></span></span>`
    },
    duck: {
      label: '이모지 스킨을 사용한 데스크톱 오리와 사용자 지정 말풍선 예시',
      html: `<span class="pm-desktop"><span class="pm-editor"><span class="pm-tab">debug.js</span>
        <code><em>function</em> solve(input) {</code><code>&nbsp; <em>return</em> input.map(step);</code><code>}</code></span>
        <span class="pm-duck-speech">어디서 막혔어?</span><span class="pm-duck-character" aria-hidden="true">🦆</span></span>`
    },
    gardener: {
      label: 'Git Gardener의 실제 daily-tangle 변경에서 wasClear를 prevPairs로 변경한 코드',
      html: `<span class="pm-git"><span class="pm-git-repo">daily-tangle <b>/ game.js</b></span>
        <span class="pm-git-code"><code><i>−</i> const <em>wasClear</em> =</code><code class="pm-indent">state.crossPairs;</code>
        <code><i>+</i> const <strong>prevPairs</strong> =</code><code class="pm-indent">state.crossPairs;</code></span>
        <span class="pm-git-strip">Issue → Pull request <b>49초</b></span></span>`
    },
    tracking: {
      label: '선정 모델별 3초 후 거리 기준 성공률. LSTM 73.65, GRU 72.69, MLP 69.32퍼센트',
      html: `<span class="pm-benchmark"><span class="pm-test-header">3초 후 위치 예측 <small>테스트 성공률</small></span>
        <span class="pm-score"><b>LSTM</b><span><i style="width:73.65%"></i></span><strong>73.65%</strong></span>
        <span class="pm-score"><b>GRU</b><span><i style="width:72.69%"></i></span><strong>72.69%</strong></span>
        <span class="pm-score"><b>MLP</b><span><i style="width:69.32%"></i></span><strong>69.32%</strong></span>
        <small class="pm-test-note">ESTA · 거리 오차 250 좌표 단위 이내</small></span>`
    },
    'mixtape-studio': {
      label: '여러 트랙을 이어 하나의 MP3로 내보내는 기능 도식',
      html: `<span class="pm-mix-sheet"><span class="pm-mix-title"><strong>Mixtape</strong><small>오디오 편집</small></span>
        <span class="pm-track-line"><b>A</b><i></i></span><span class="pm-track-line"><b>B</b><i></i></span>
        <span class="pm-mix-out"><span>무음 구간 정리</span><strong>MP3</strong></span></span>`
    },
    'claude-code-silent-mode': {
      label: 'Claude Code의 진행 설명을 줄이고 작업 결과 한 줄을 남기는 동작 예시',
      html: `<span class="pm-console"><span class="pm-console-head">CLAUDE CODE <b>SILENT MODE</b></span>
        <span class="pm-muted-lines" aria-hidden="true"><i></i><i></i><i></i></span>
        <strong class="pm-receipt">작업 결과 한 줄<span>▍</span></strong></span>`
    },
    'claude-skill-finder': {
      label: '설치된 스킬부터 공식 카탈로그, 커뮤니티와 GitHub로 이어지는 scout 검색 순서',
      html: `<span class="pm-find"><code>scout</code><span class="pm-search-route"><b>설치된 스킬</b><b>공식 카탈로그</b><b>커뮤니티 · GitHub</b></span></span>`
    },
    'NOCAP-Extension': {
      label: '영상 자막과 자료를 읽어 브라우저에서 분석을 보여주는 기능 도식',
      html: `<span class="pm-video-sample"><i></i><span class="pm-closed-caption">CC</span><span class="pm-subtitle">영상 자막</span></span>
        <span class="pm-nocap-note"><strong>NOCAP</strong><small>자막 분석 위젯</small></span>`
    },
    VibeGuard: {
      label: 'AI가 생성한 코드 및 패키지 이름을 점검하는 방어 도구의 검사 범위',
      html: `<span class="pm-review-sheet"><span class="pm-review-ribbon">VibeGuard</span><strong>코드 점검</strong>
        <span class="pm-review-line"><i></i>보안 취약점</span><span class="pm-review-line"><i></i>패키지 이름 검증</span></span>`
    },
    'pairing-buddy': {
      label: '술과 안주 취향을 카드로 넘기는 앱 프로토타입의 기능 예시',
      html: `<span class="pm-pair-card pm-pair-one"><b>술</b></span><span class="pm-pair-card pm-pair-two"><b>안주</b></span>
        <span class="pm-pair-note">취향 스와이프</span>`
    },
    'stonks-atlas': {
      label: 'Stonks Atlas 프로젝트 표지',
      html: `<span class="pm-atlas-sheet"><small>STONKS</small><strong>Atlas</strong><span class="pm-atlas-caption">Python</span></span>`
    },
    'songeum-lab': {
      label: '브라우저에서 손금을 처리하는 웹 프로토타입의 기능 도식',
      html: `<span class="pm-palm-lines"><i></i><i></i><i></i></span><span class="pm-palm-title"><strong>손금<span>연구소</span></strong><small>브라우저 안에서 분석</small></span>`
    },
    'vs-arena': {
      label: '같은 시드를 공유하면 같은 대결을 재연하는 브라우저 배틀 시뮬레이터의 규칙 도식',
      html: `<span class="pm-arena-floor"><i></i><b>VS</b><i></i></span><span class="pm-arena-note">같은 시드 · 같은 대결</span>`
    },
    Refuel: {
      label: '로컬 사용 기록으로 Claude Code의 5시간 사용 구간을 살펴보는 모니터',
      html: `<span class="pm-refuel-clock"><strong>5<span>h</span></strong></span><span class="pm-refuel-note"><b>Refuel</b><small>Claude Code<br>사용 구간 모니터</small></span>`
    },
    'coding-rules': {
      label: '코딩 규칙 문서와 커밋 전 체크리스트',
      html: `<span class="pm-rules-page"><small>RULES.md</small><strong>코딩 규칙</strong>
        <span>□ &nbsp;설정값 분리</span><span>□ &nbsp;프로젝트 관례 확인</span><span>□ &nbsp;오류 처리</span></span>`
    },
    python: {
      label: 'Python 학습 저장소 표지',
      html: `<span class="pm-python-sheet"><code>&gt;&gt;&gt;</code><strong>Python</strong><small>학습 기록</small></span>`
    },
    'tic-tac-toe-plus': {
      label: '얼티밋 틱택토 게임 구상. 중첩된 판 구조를 나타낸 도식.',
      html: `<span class="pm-ttt-grid">${['×','','○','','×','','○','',''].map(mark => '<i>' + mark + '</i>').join('')}</span>
        <span class="pm-ttt-legend"><strong>× / ○</strong><small>얼티밋 틱택토<br>게임 구상</small></span>`
    },
    ophey: {
      label: '음원을 패드에서 재생하는 강남스타일 밈 사운드보드 예시',
      html: `<span class="pm-ophey"><span class="pm-pad-name"><b>옵</b><b>헤이</b></span><span class="pm-pad-grid">
        <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></span>`
    },
    tangle: {
      label: '매듭 퍼즐 예시. 양쪽 대각선 한 쌍이 교차한다.',
      html: `<span class="pm-puzzle"><span class="pm-puzzle-head">Daily Tangle <small>교차 1쌍</small></span><span class="pm-board"></span></span>`
    }
  };

  function drawPuzzle(board) {
    const points = [[18, 24], [49, 12], [75, 27], [78, 72], [49, 88], [19, 70]];
    const segments = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [2, 5]];
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 270;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const coords = points.map(([x, y]) => [x * 6.4, y * 2.7]);
    ctx.lineCap = 'round';
    for (const [a, b] of segments) {
      const diagonal = a === 0 && b === 3 || a === 2 && b === 5;
      ctx.beginPath();
      ctx.moveTo(...coords[a]);
      ctx.lineTo(...coords[b]);
      ctx.lineWidth = diagonal ? 5 : 3;
      ctx.strokeStyle = diagonal ? '#ec48bd' : '#9cabe9';
      ctx.stroke();
    }
    coords.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#c7ccff';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#5865f2';
      ctx.stroke();
    });
    board.append(canvas);
  }

  function enableReplay(el) {
    const word = el.querySelector('[data-typing-word]');
    const target = el.querySelector('[data-typing-attack]');
    const status = el.querySelector('[data-typing-status]');
    const control = document.createElement('button');
    control.type = 'button';
    control.className = 'pm-replay';
    control.textContent = '대결 시연 재생';
    el.append(control);
    control.addEventListener('click', () => {
      if (control.getAttribute('aria-disabled') === 'true') return;
      const dialog = el.closest('dialog');
      const timers = [];
      function end() {
        timers.forEach(clearTimeout);
        word.textContent = '완료';
        target.textContent = '모험을 함께';
        status.textContent = '단어 순서 교란';
        control.removeAttribute('aria-disabled');
        control.textContent = '시연 다시 보기';
        dialog?.removeEventListener('close', end);
      }
      target.textContent = '함께 모험을';
      word.textContent = '';
      status.textContent = '문장 입력 중';
      control.setAttribute('aria-disabled', 'true');
      control.textContent = '재생 중';
      dialog?.addEventListener('close', end, { once: true });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        end();
        return;
      }
      timers.push(setTimeout(() => { word.textContent = '완'; }, 440));
      timers.push(setTimeout(() => { word.textContent = '완료'; status.textContent = '문장 완성'; }, 900));
      timers.push(setTimeout(end, 1500));
    });
  }

  window.createProjectMedia = function createProjectMedia(project, detail = false) {
    const key = project.artwork;
    const scene = scenes[key];
    if (!scene) throw new Error('Unknown portfolio artwork: ' + key);
    const el = document.createElement('span');
    el.className = 'portfolio-media pm-' + key + (detail ? ' pm-detail' : '');
    const frame = document.createElement('span');
    frame.className = 'pm-scene';
    frame.setAttribute('role', 'img');
    frame.setAttribute('aria-label', scene.label);
    frame.innerHTML = scene.html;
    el.append(frame);
    if (key === 'tangle') drawPuzzle(frame.querySelector('.pm-board'));
    if (key === 'typing' && detail) enableReplay(el);
    return el;
  };
})();

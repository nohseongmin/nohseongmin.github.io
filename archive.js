(() => {
  'use strict';

  const areas = {
    all: '전체',
    app: '앱·SW',
    game: '게임',
    skills: 'Claude 스킬',
    service: '웹 서비스',
    ai: 'AI 실험',
    automation: '개발 자동화'
  };

  const aliases = { desktop: 'app', mobile: 'app' };
  const projects = [
    {
      slug: 'SlideIt', name: 'SlideIT', artwork: 'slideit', areas: ['app'],
      category: '모바일 앱', technology: 'Android',
      summary: '손짓으로 건네고 카메라로 읽는 디지털 명함.',
      detail: '명함에 담을 정보를 직접 편집하고, 손짓으로 상대에게 건넵니다. 카메라로 읽은 종이 명함도 함께 보관하고 검색할 수 있습니다.',
      stack: ['Kotlin', 'Jetpack Compose', 'Room', 'ML Kit']
    },
    {
      slug: 'typing-royale', name: 'Typing Royale', artwork: 'typing', areas: ['game'],
      category: '웹 게임', technology: 'JavaScript',
      summary: '내가 문장을 끝내면 상대의 문장이 뒤섞입니다.',
      detail: '문장 하나를 완성할 때마다 상대가 입력 중인 문장의 글자나 단어 순서를 바꿉니다. 20초마다 한 명씩 탈락하는 타자 배틀로얄입니다.',
      stack: ['JavaScript', 'Cloudflare Workers', 'Durable Objects'],
      demo: 'https://nohseongmin.github.io/typing-royale/', demoLabel: '게임 플레이'
    },
    {
      slug: 'abathur', name: 'abathur', artwork: 'abathur', areas: ['skills'],
      category: 'Claude 스킬', technology: 'Python',
      summary: '한국어 답변의 표현을 바꿔 토큰을 얼마나 아끼는지 잽니다.',
      detail: '한국어 표현을 줄이기 전과 후의 토큰 수를 직접 비교합니다. 실제로 토큰을 줄인 표현과 오히려 늘어난 표현을 기록해 Claude Code의 응답 규칙을 만듭니다.',
      stack: ['Claude Code', 'Python', 'Tokenizer']
    },
    {
      slug: 'gonggang-meet', name: '공강밋', artwork: 'gonggang', areas: ['service'],
      category: '웹 서비스', technology: 'FastAPI',
      summary: '팀원들의 시간표에서 함께 비는 회의 시간 세 곳을 찾습니다.',
      detail: '팀원들이 각자 시간표를 입력하면 30분 단위로 일정을 겹쳐 봅니다. 모두가 한 시간 이상 비는 구간을 찾아 회의 시간 세 곳을 추천합니다.',
      stack: ['FastAPI', 'SQLite', 'JavaScript']
    },
    {
      slug: 'rubber-duck-debugger', name: 'Rubber Duck Debugger', artwork: 'duck', areas: ['app'],
      category: '데스크톱 앱', technology: 'Electron',
      summary: '코드가 막힐 때 바탕화면 한쪽에서 꽥 하고 우는 오리.',
      detail: '러버덕 디버깅에 쓰는 고무오리를 바탕화면에 올려둡니다. 클릭하면 울고, 오리의 이미지와 소리, 표시되는 문구를 내 취향대로 바꿀 수 있습니다.',
      stack: ['Electron', 'JavaScript', 'Windows']
    },
    {
      slug: 'git-gardener', name: 'Git Gardener', artwork: 'gardener', areas: ['automation', 'app'],
      category: '개발 자동화', technology: 'C#',
      summary: 'Windows 트레이에서 저장소를 돌보고 변경 사항을 PR로 보냅니다.',
      detail: '관리 대상 중 가장 오래 손보지 않은 저장소를 골라 Claude Code로 개선을 시도합니다. 변경이 생기면 별도 브랜치에 커밋하고 검토할 수 있도록 PR을 엽니다.',
      stack: ['C#', 'Claude Code', 'GitHub CLI', 'Windows']
    },
    {
      slug: 'tracking-ai', name: 'tracking-ai', artwork: 'tracking', areas: ['ai'],
      category: 'AI 실험', technology: 'Python',
      summary: '공포게임에서 플레이어의 3초 뒤 위치를 예측하는 실험.',
      detail: '플레이어 이동 기록을 바탕으로 GRU, LSTM, MLP의 위치 예측을 비교합니다. 같은 조건으로 짝지은 150개 실험에서 각 모델이 3초 뒤 위치를 얼마나 가깝게 찾는지 측정했습니다.',
      stack: ['Python', 'GRU', 'LSTM', 'MLP']
    },
    {
      slug: 'daily-tangle', name: 'Daily Tangle', artwork: 'tangle', areas: ['game'],
      category: '웹 게임', technology: 'Canvas',
      summary: '하루에 하나, 얽힌 점을 움직여 모든 선의 교차를 푸는 퍼즐.',
      detail: '점들을 끌어서 선이 서로 교차하지 않게 배치합니다. 매일 새 매듭이 열리고, 같은 퍼즐의 시드를 공유해 다른 사람과 풀 수 있습니다.',
      stack: ['JavaScript', 'Canvas']
    },
    {
      slug: 'mixtape-studio', name: 'Mixtape Studio', artwork: 'mixtape-studio', areas: ['app'],
      category: '오디오 도구', technology: 'MP3',
      summary: '여러 곡의 무음 구간을 정리하고 한 파일로 잇습니다.',
      detail: '트랙 사이에 남는 무음을 정리한 뒤, 곡을 연달아 들을 수 있는 MP3 믹스테이프로 내보냅니다.',
      stack: ['오디오 편집', 'MP3']
    },
    {
      slug: 'claude-code-silent-mode', name: 'Claude Code Silent Mode', artwork: 'claude-code-silent-mode', areas: ['skills', 'automation'],
      category: 'Claude Code 도구', technology: 'Claude Code',
      summary: '작업 과정의 중계는 줄이고 결과를 한 줄로 받습니다.',
      detail: 'Claude Code가 작업 중에 남기는 설명을 줄입니다. 명령이 끝난 뒤에는 무엇이 달라졌는지 짧게 읽을 수 있습니다.',
      stack: ['Claude Code']
    },
    {
      slug: 'claude-skill-finder', name: 'Claude Skill Finder', artwork: 'claude-skill-finder', areas: ['skills', 'automation'],
      category: 'Claude 스킬', technology: 'Markdown',
      summary: '새 기능을 만들기 전에 이미 있는 스킬을 찾습니다.',
      detail: 'scout는 설치된 스킬과 공식 제공 목록부터 확인합니다. 적절한 도구가 없으면 커뮤니티 색인과 GitHub까지 검색합니다.',
      stack: ['Claude Code', 'Markdown', 'Python']
    },
    {
      slug: 'NOCAP-Extension', name: 'NOCAP', artwork: 'NOCAP-Extension', areas: ['app', 'ai'],
      category: '브라우저 확장', technology: '온디바이스 AI',
      summary: '유튜브 자막을 분석해 영상의 주장을 살펴봅니다.',
      detail: '유튜브를 시청하는 화면에서 자막을 읽고 AI 분석 결과를 보여주는 브라우저 확장입니다.',
      stack: ['브라우저 확장', '온디바이스 AI']
    },
    {
      slug: 'VibeGuard', name: 'VibeGuard', artwork: 'VibeGuard', areas: ['automation'],
      category: '개발 도구', technology: '코드 검사',
      summary: 'AI가 작성한 코드의 보안 문제와 패키지 이름을 점검합니다.',
      detail: '생성된 코드에서 취약점이 의심되는 부분을 찾고, 제안받은 패키지 이름이 실제로 쓰이는지 함께 살펴봅니다.',
      stack: ['코드 검사', '패키지 검증']
    },
    {
      slug: 'pairing-buddy', name: 'Pairing Buddy', artwork: 'pairing-buddy', areas: ['app'],
      category: '앱 프로토타입', technology: '스와이프 UI',
      summary: '술과 안주 카드를 넘기며 내 취향을 고릅니다.',
      detail: '술과 안주를 카드로 보여주고 스와이프로 선호를 표현하는 앱 프로토타입입니다.',
      stack: ['모바일 UI', '프로토타입']
    },
    {
      slug: 'stonks-atlas', name: 'Stonks Atlas', artwork: 'stonks-atlas', areas: ['app'],
      category: '소프트웨어', technology: 'Python',
      summary: 'Python으로 만든 Stonks Atlas의 공개 작업 기록.',
      detail: 'Stonks Atlas의 코드와 변경 기록을 공개한 저장소입니다.',
      stack: ['Python']
    },
    {
      slug: 'songeum-lab', name: '손금연구소', artwork: 'songeum-lab', areas: ['service'],
      category: '웹 프로토타입', technology: '브라우저',
      summary: '브라우저 안에서 손바닥 사진의 손금을 살펴봅니다.',
      detail: '손바닥 이미지를 브라우저에서 처리해 손금을 분석하는 웹 프로토타입입니다.',
      stack: ['브라우저 이미지 처리', '웹 UI']
    },
    {
      slug: 'vs-arena', name: 'VS Arena', artwork: 'vs-arena', areas: ['game'],
      category: '배틀 시뮬레이터', technology: '브라우저',
      summary: '시드 하나를 공유하면 같은 대결을 다시 볼 수 있습니다.',
      detail: '브라우저에서 대결을 시뮬레이션합니다. 같은 시드를 입력하면 같은 대결이 재현되어 다른 사람과 결과를 공유할 수 있습니다.',
      stack: ['브라우저 게임', '시드 기반 시뮬레이션']
    },
    {
      slug: 'Refuel', name: 'Refuel', artwork: 'Refuel', areas: ['app'],
      category: '데스크톱 도구', technology: 'Claude Code',
      summary: 'Claude Code를 얼마나 썼고 언제 다시 쓸 수 있는지 봅니다.',
      detail: '내 컴퓨터에 남은 로그로 토큰 사용량과 5시간 사용 구간의 재충전 시점을 보여주는 데스크톱 모니터입니다.',
      stack: ['Claude Code', '로컬 로그 분석']
    },
    {
      slug: 'coding-rules', name: 'Coding Rules', artwork: 'coding-rules', areas: ['automation'],
      category: '개발 규칙집', technology: 'Markdown',
      summary: 'AI가 쓴 코드도 같은 기준으로 검토할 수 있게 만든 규칙집.',
      detail: '설정값 하드코딩, 프로젝트 내 표기 불일치, 보안 누락을 줄이기 위한 규칙과 커밋 전 체크리스트를 모았습니다.',
      stack: ['Markdown', '코드 리뷰', 'OWASP']
    },
    {
      slug: 'python', name: 'Python', artwork: 'python', areas: ['app'],
      category: '코드 기록', technology: 'Python',
      summary: 'Python으로 작성한 코드를 모은 저장소.',
      detail: 'Python 코드와 변경 이력을 원본 저장소에서 살펴볼 수 있습니다.',
      stack: ['Python']
    },
    {
      slug: 'tic-tac-toe-plus', name: 'Tic-Tac-Toe Plus', artwork: 'tic-tac-toe-plus', areas: ['game'],
      category: '게임 기획', technology: '규칙 설계',
      summary: '작은 판과 큰 판을 함께 쓰는 얼티밋 틱택토 구상.',
      detail: '얼티밋 틱택토를 바탕으로 확장할 게임 규칙을 README에 정리했습니다. 공개된 결과물은 기획 문서입니다.',
      stack: ['게임 기획', '규칙 설계']
    },
    {
      slug: 'ophey', name: 'Ophey', artwork: 'ophey', areas: ['app'],
      category: '사운드보드', technology: '오디오',
      summary: '패드를 눌러 강남스타일 밈 사운드를 재생합니다.',
      detail: '음원을 패드에 배치해 버튼을 누르면 밈 사운드가 나오는 사운드보드입니다.',
      stack: ['오디오', '사운드보드']
    }
  ];

  function portfolioAreaCounts() {
    return Object.fromEntries(Object.keys(areas).map(key => [
      key, key === 'all' ? projects.length : projects.filter(project => project.areas.includes(key)).length
    ]));
  }

  window.portfolioAreaCounts = portfolioAreaCounts;

  function initialize() {
    const section = document.getElementById('projects');
    const grid = document.getElementById('projects-grid');
    const archiveTitle = document.getElementById('projects-title');
    const resetFilter = document.getElementById('reset-filter');
    const counter = document.getElementById('project-count');
    const dialog = document.getElementById('project-dialog');
    const content = document.getElementById('dialog-content');
    const closeButton = document.getElementById('dialog-close');
    let returnFocus;
    let activeArea = 'all';
    let pressedBackdrop = false;

    function element(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      return node;
    }

    function media(project, detail = false) {
      const wrapper = element(detail ? 'div' : 'span', detail ? 'dialog-art' : 'project-image');
      if (window.createProjectMedia) wrapper.append(window.createProjectMedia(project, detail));
      else wrapper.append(element('span', 'media-fallback', project.name));
      return wrapper;
    }

    function link(label, href, className) {
      const anchor = element('a', className, label);
      anchor.href = href;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      return anchor;
    }

    function showProject(slug, trigger = document.activeElement) {
      const project = projects.find(item => item.slug.toLowerCase() === String(slug).toLowerCase());
      if (!project) return;
      if (!dialog.open) returnFocus = trigger;
      const body = element('div', 'dialog-body');
      const category = element('p', 'dialog-meta', project.category);
      const title = element('h2', 'dialog-title', project.name);
      title.id = 'project-title';
      const description = element('p', 'dialog-description', project.detail);
      const tags = element('ul', 'dialog-tags');
      tags.setAttribute('aria-label', '사용한 기술');
      for (const tag of project.stack) tags.append(element('li', 'tech-tag', tag));
      const actions = element('div', 'dialog-actions');
      if (project.demo) actions.append(link(project.demoLabel, project.demo, 'dialog-demo'));
      actions.append(link('GitHub 저장소', 'https://github.com/nohseongmin/' + project.slug, 'dialog-repo'));
      body.append(category, title, description, tags, actions);
      content.replaceChildren(media(project, true), body);
      dialog.setAttribute('aria-labelledby', title.id);
      if (!dialog.open) dialog.showModal();
      dialog.scrollTop = 0;
      closeButton.focus({ preventScroll: true });
    }

    function projectCard(project) {
      const article = element('article', 'project-item');
      const button = element('button', 'project-card');
      button.type = 'button';
      button.setAttribute('aria-label', project.name + ' 자세히 보기');
      button.setAttribute('aria-haspopup', 'dialog');
      button.dataset.project = project.slug;
      const visual = media(project);
      const meta = element('span', 'project-meta');
      meta.append(element('span', 'project-category', project.category), element('span', 'project-tech', project.technology));
      const heading = element('h3', 'project-title', project.name);
      const summary = element('p', 'project-summary', project.summary);
      // Keep the card's entire hit area usable with either a pointer or keyboard.
      button.append(visual, meta, heading, summary);
      button.addEventListener('click', () => showProject(project.slug, button));
      article.append(button);
      return article;
    }

    function displayArea(area) {
      activeArea = area;
      const visible = area === 'all' ? projects : projects.filter(project => project.areas.includes(area));
      const filtered = area !== 'all';
      grid.replaceChildren(...visible.map(projectCard));
      archiveTitle.textContent = filtered ? areas[area] + ' 작업 ' + visible.length + '개' : '프로젝트 아카이브';
      counter.hidden = filtered;
      counter.textContent = filtered ? '' : '전체 ' + visible.length + '개';
      resetFilter.hidden = !filtered;
      document.dispatchEvent(new CustomEvent('project-area-change', { detail: area }));
    }

    function selectProjectArea(key) {
      const area = aliases[key] || key;
      if (!Object.hasOwn(areas, area)) return;
      if (area !== activeArea) displayArea(area);
      archiveTitle.focus({ preventScroll: true });
      section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    }

    resetFilter.addEventListener('click', () => selectProjectArea('all'));

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('pointerdown', event => {
      pressedBackdrop = event.target === dialog && outsideDialog(event);
    });
    function outsideDialog(event) {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom;
    }
    dialog.addEventListener('click', event => {
      if (pressedBackdrop && event.target === dialog && outsideDialog(event)) dialog.close();
      pressedBackdrop = false;
    });
    dialog.addEventListener('close', () => {
      pressedBackdrop = false;
      content.replaceChildren();
      if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
      returnFocus = null;
    });

    window.selectProjectArea = selectProjectArea;
    window.openPortfolioProject = showProject;
    displayArea('all');
    document.dispatchEvent(new Event('archive-ready'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();


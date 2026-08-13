// 壬辰录·梦见诸葛亮 资料库 - v6.1 下拉筛选器 + 纯文字风格 + 高德地图
(function() {
  'use strict';

  // ========== 配置 ==========
  const CONFIG = {
    contentPath: 'content/',
    originalPath: 'content/original/',
    translationPath: 'content/translation/',
    comparisonPath: 'content/comparison/',
    dataPath: 'content/',
    referencesPath: 'content/references.json',
    amapKey: 'e1f4dde6fe70b3b28c121d8193016a7b'
  };

  // 原文版本列表（壬辰录）
  const RENCHENLU_ORIGINAL = [
    { key: '东洋文库', file: '壬辰录_日本东洋文库本_精校版.txt', tag: 'han', label: '汉文' },
    { key: '国立', file: '壬辰录_韩国国立中央图书馆藏本_精校版.txt', tag: 'han', label: '汉文' },
    { key: '精神文化', file: '壬辰录_韩国精神文化研究院藏本_精校版.txt', tag: 'han', label: '汉文' },
    { key: '柏克莱', file: '壬辰录_美国柏克莱加州大学东亚图书馆藏本_精校版.txt', tag: 'han', label: '汉文' },
    { key: '手抄本', file: '壬辰录_手抄本_原文.md', tag: 'han', label: '简体' },
    { key: '莫斯科', file: '壬辰录_1966莫斯科版 韩文原文.txt', tag: 'kor', label: '韩文' },
    { key: '小说集版', file: '壬辰录_洪吉童传·田禹治传·壬辰录 韩文原文.txt', tag: 'kor', label: '韩文' }
  ];

  // 译文版本列表（壬辰录）
  const RENCHENLU_TRANSLATION = [
    { key: '东洋文库', file: '壬辰录_日本东洋文库本_白话译文.md' },
    { key: '国立', file: '壬辰录_韩国国立中央图书馆藏本_白话译文.md' },
    { key: '精神文化', file: '壬辰录_韩国精神文化研究院藏本_白话译文.md' },
    { key: '柏克莱', file: '壬辰录_美国柏克莱加州大学东亚图书馆藏本_白话译文.md' },
    { key: '莫斯科', file: '壬辰录_1966莫斯科版_白话译文.md' },
    { key: '小说集版', file: '壬辰录_洪吉童传·田禹治传·壬辰录_韩文原文_白话译文.md' }
  ];

  // 梦见诸葛亮版本
  const MENGJIAN_VERSIONS = [
    { key: '原文', file: '梦见诸葛亮_原文.txt', type: 'original' },
    { key: '译文', file: '梦见诸葛亮_白话译文.md', type: 'translation' }
  ];

  // 当前状态
  let currentPage = 'text';
  let currentNovel = 'renchenlu';
  let currentContentType = 'original';
  let currentVersion = '东洋文库';
  let currentShiliaoTab = 'map';
  let currentResearchTab = 'about';
  let charactersData = [];
  let battlesData = [];
  let referencesData = [];
  let litFilters = { type: 'all', region: 'all' };
  let leafletMap = null;
  let isFilterOpen = false;
  let currentTimelinePeriod = 'renchenlu';

  // 壬辰倭乱时间线（10个节点）
  const TIMELINE_DATA = [
    { date: '1592年4月13日', event: '日军登陆釜山', source: '《宣祖实录》卷30', desc: '加藤清正率第一军从釜山浦登陆，壬辰倭乱正式爆发。', lat: 35.18, lng: 129.08 },
    { date: '1592年4月18日', event: '梁山之战', source: '《李忠武公全书》', desc: '李舜臣率朝鲜水军在梁山海域首战告捷，打击日军海上补给线。', lat: 35.22, lng: 128.60 },
    { date: '1592年5月2日', event: '汉城失守', source: '《惩毖录》卷1', desc: '日军攻占汉城，朝鲜国王宣祖仓皇北逃至义州。', lat: 37.57, lng: 127.00 },
    { date: '1592年7月8日', event: '闲山岛海战', source: '《乱中日记》', desc: '李舜臣以龟船为主力，大破日军舰队，歼敌舟船六十余艘。', lat: 34.75, lng: 126.35 },
    { date: '1593年1月27日', event: '平壤收复战', source: '《宣祖实录》卷30', desc: '明军李如松部与朝鲜军队联合收复平壤，扭转战局。', lat: 39.03, lng: 125.75 },
    { date: '1593年4月11日', event: '碧蹄馆之战', source: '《万历朝鲜战争史料》', desc: '明军轻骑突进遭日军伏击，损失较大，促使和谈开启。', lat: 37.45, lng: 126.70 },
    { date: '1597年10月26日', event: '鸣梁海战', source: '《乱中日记》', desc: '李舜臣以12艘船击败日军130余艘，创造海战奇迹。', lat: 34.85, lng: 127.38 },
    { date: '1598年8月10日', event: '顺天之战', source: '《乱中日记》', desc: '明军与朝鲜军队联合围攻顺天倭城，小西行长败退。', lat: 34.96, lng: 127.13 },
    { date: '1598年11月19日', event: '露梁海战', source: '《乱中日记》', desc: '李舜臣与明将陈璘联合歼灭日军主力，李舜臣殉国。', lat: 34.60, lng: 127.85 },
    { date: '1598年12月', event: '壬辰倭乱结束', source: '《宣祖实录》', desc: '日军全部撤离朝鲜半岛，历时七年半的战争正式结束。', lat: 36.00, lng: 127.50 }
  ];

  // 1908年日占朝鲜时期时间线（《梦见诸葛亮》背景）
  const MENGJIAN_TIMELINE_DATA = [
    { date: '1876年', event: '江华岛条约签订', source: '《高宗实录》', desc: '朝鲜被迫开国，日本势力进入朝鲜。' },
    { date: '1882年', event: '壬午兵变', source: '《高宗实录》', desc: '朝鲜士兵发动兵变，反日情绪高涨。' },
    { date: '1894年', event: '东学农民战争', source: '《高宗实录》', desc: '东学党起义，引出中日甲午战争。' },
    { date: '1895年', event: '乙未事变', source: '《高宗实录》', desc: '日本指使刺客杀害明成皇后闵氏。' },
    { date: '1904年', event: '甲辰保护条约', source: '《大韩编年史》', desc: '日俄战争后，日本迫使朝鲜签订保护条约。' },
    { date: '1905年', event: '乙巳保护条约', source: '《高宗实录》', desc: '朝鲜沦为日本保护国，外交权被剥夺。' },
    { date: '1907年', event: '义兵运动爆发', source: '《朝鲜独立运动史》', desc: '高宗退位后，全国义兵抗击日军。' },
    { date: '1908年', event: '刘元杓创作《梦见诸葛亮》', source: '作者自序', desc: '日本保护国时期，借梦游三国表达民族独立渴望。' }
  ];

  // ========== 工具函数 ==========

  function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('show');
  }

  function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.remove('show');
  }

  function renderMarkdown(text) {
    if (!text) return '';
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/^---$/gm, '<hr>');
    html = html.replace(/^\s*\*\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');
    html = html.replace(/\n\n/g, '</p><p>');
    html = html.replace(/\n/g, '<br>');
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<h[1-3]>)/g, '$1');
    html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
    return '<p>' + html + '</p>';
  }

  async function loadFile(path) {
    try {
      const response = await fetch(path + '?t=' + Date.now());
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.text();
    } catch (error) {
      console.error('加载文件失败:', path, error);
      throw error;
    }
  }

  async function loadJSON(path) {
    try {
      const text = await loadFile(path);
      return JSON.parse(text);
    } catch (error) {
      console.error('加载 JSON 失败:', path, error);
      return [];
    }
  }

  // ========== 下拉式筛选器 ==========

  function buildDropdownFilter(categories) {
    let html = '<div class="dropdown-filter">';
    html += '<div class="dropdown-header" onclick="window.app.toggleFilter()">';
    html += '<span class="dropdown-title">筛选</span>';
    html += '<span class="dropdown-arrow" id="filterArrow">▼</span>';
    html += '</div>';
    html += '<div class="dropdown-content" id="filterDropdown" style="display:none">';
    html += '<div class="filter-groups">';

    categories.forEach(function(cat, idx) {
      html += '<div class="filter-group">';
      html += '<div class="filter-group-title">' + cat.label + '</div>';
      html += '<div class="filter-options">';
      cat.options.forEach(function(opt) {
        html += '<button class="filter-chip" data-cat="' + cat.id + '" data-value="' + opt.value + '">' + opt.label + '</button>';
      });
      html += '</div></div>';
    });

    html += '</div>';
    html += '<div class="dropdown-footer">';
    html += '<button class="btn-reset" onclick="window.app.resetFilter()">重置</button>';
    html += '<button class="btn-confirm" onclick="window.app.confirmFilter()">确认</button>';
    html += '</div>';
    html += '</div></div>';
    return html;
  }

  window.app = window.app || {};
  window.app.toggleFilter = function() {
    isFilterOpen = !isFilterOpen;
    const dropdown = document.getElementById('filterDropdown');
    const arrow = document.getElementById('filterArrow');
    if (dropdown) {
      dropdown.style.display = isFilterOpen ? 'block' : 'none';
    }
    if (arrow) {
      arrow.textContent = isFilterOpen ? '▲' : '▼';
    }
  };

  window.app.resetFilter = function() {
    document.querySelectorAll('.filter-chip').forEach(function(btn) {
      btn.classList.remove('active');
    });
    currentNovel = 'renchenlu';
    currentContentType = 'original';
    currentVersion = RENCHENLU_ORIGINAL[0].key;
    window.app.toggleFilter();
    loadTextContent();
  };

  window.app.confirmFilter = function() {
    window.app.toggleFilter();
    loadTextContent();
  };

  window.app.switchTimelinePeriod = function(period) {
    currentTimelinePeriod = period;
    renderShiliao();
  };

  window.app.switchResearchTab = function(tab) {
    currentResearchTab = tab;
    renderResearch();
  };

  // ========== 文本页面 ==========

  async function renderText() {
    const main = document.getElementById('mainContent');
    const isMengjian = currentNovel === 'mengjian';

    const novelOptions = [
      { value: 'renchenlu', label: '壬辰录' },
      { value: 'mengjian', label: '梦见诸葛亮' }
    ];
    const typeOptions = [
      { value: 'original', label: '原文' },
      { value: 'translation', label: '译文' }
    ];
    const versionOptions = !isMengjian ? RENCHENLU_ORIGINAL.concat(RENCHENLU_TRANSLATION).map(function(v) {
      return { value: v.key, label: v.key };
    }).filter(function(v, i, arr) { return arr.findIndex(function(x) { return x.value === v.value; }) === i; }) : [];

    let filterHTML = buildDropdownFilter([
      { id: 'novel', label: '作品', options: novelOptions },
      { id: 'type', label: '类型', options: typeOptions },
      { id: 'version', label: '版本', options: versionOptions }
    ]);

    main.innerHTML = '<section class="page-section active" id="page-text">' +
      filterHTML +
      '<div class="content-area" id="textContent">' +
        '<div class="loading-state"><div class="spinner"></div><p>加载中...</p></div>' +
      '</div>' +
    '</section>';

    // 绑定筛选芯片点击
    document.querySelectorAll('.filter-chip').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const cat = btn.dataset.cat;
        const value = btn.dataset.value;
        document.querySelectorAll('.filter-chip[data-cat="' + cat + '"]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');

        if (cat === 'novel') {
          currentNovel = value;
          currentVersion = RENCHENLU_ORIGINAL[0].key;
        } else if (cat === 'type') {
          currentContentType = value;
          currentVersion = RENCHENLU_ORIGINAL[0].key;
        } else if (cat === 'version') {
          currentVersion = value;
        }
      });
    });

    // 点击外部关闭筛选器
    document.addEventListener('click', function(e) {
      const filterEl = document.querySelector('.dropdown-filter');
      if (filterEl && !filterEl.contains(e.target) && isFilterOpen) {
        window.app.toggleFilter();
      }
    });

    await loadTextContent();
  }

  async function loadTextContent() {
    const contentDiv = document.getElementById('textContent');
    if (!contentDiv) return;

    const isMengjian = currentNovel === 'mengjian';
    const isOriginal = currentContentType === 'original';
    let file, title;

    if (isMengjian) {
      file = isOriginal ? '梦见诸葛亮_原文.txt' : '梦见诸葛亮_白话译文.md';
      title = isOriginal ? '梦见诸葛亮 原文' : '梦见诸葛亮 白话译文';
    } else {
      const list = isOriginal ? RENCHENLU_ORIGINAL : RENCHENLU_TRANSLATION;
      const version = list.find(function(v) { return v.key === currentVersion; });
      if (!version) return;
      file = version.file;
      title = '壬辰录 - ' + currentVersion;
    }

    contentDiv.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>加载中...</p></div>';

    try {
      const content = await loadFile(CONFIG[isOriginal ? 'originalPath' : 'translationPath'] + file);
      if (file.endsWith('.md')) {
        contentDiv.innerHTML = '<h3 style="margin-bottom:16px;color:var(--color-primary)">' + title + '</h3>' + renderMarkdown(content);
      } else {
        const paragraphs = content.split(/\n\s*\n/).filter(function(p) { return p.trim(); });
        let html = paragraphs.map(function(p) { return '<p>' + p.replace(/\n/g, '<br>').replace(/</g, '&lt;') + '</p>'; }).join('');
        if (paragraphs.length > 0) {
          html = '<h3 style="margin-bottom:16px;color:var(--color-primary)">' + title + '</h3>' + html;
        }
        contentDiv.innerHTML = html;
      }
    } catch (error) {
      contentDiv.innerHTML = '<div class="error-state"><p>加载失败，请稍后重试</p></div>';
    }
  }

  // ========== 史料页面 ==========

  async function renderShiliao() {
    const main = document.getElementById('mainContent');

    main.innerHTML = '<section class="page-section active" id="page-shiliao">' +
      '<div class="shiliao-tabs">' +
        '<div class="shiliao-tab ' + (currentShiliaoTab === 'map' ? 'active' : '') + '" data-tab="map">壬辰倭乱战争进程图</div>' +
        '<div class="shiliao-tab ' + (currentShiliaoTab === 'timeline' ? 'active' : '') + '" data-tab="timeline">时间线</div>' +
        '<div class="shiliao-tab ' + (currentShiliaoTab === 'battles' ? 'active' : '') + '" data-tab="battles">战役</div>' +
      '</div>' +
      '<div class="content-area" id="shiliaoContent">' +
        '<div class="loading-state"><div class="spinner"></div><p>加载中...</p></div>' +
      '</div>' +
    '</section>';

    document.querySelectorAll('#page-shiliao .shiliao-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        currentShiliaoTab = tab.dataset.tab;
        renderShiliao();
      });
    });

    await loadShiliaoContent();
  }

  async function loadShiliaoContent() {
    const contentDiv = document.getElementById('shiliaoContent');
    if (!contentDiv) return;

    if (currentShiliaoTab === 'map') {
      await renderMapTab(contentDiv);
    } else if (currentShiliaoTab === 'timeline') {
      await renderTimeline(contentDiv);
    } else if (currentShiliaoTab === 'battles') {
      await renderBattlesTab(contentDiv);
    }
  }

  async function renderTimeline(container) {
    const data = currentTimelinePeriod === 'renchenlu' ? TIMELINE_DATA : MENGJIAN_TIMELINE_DATA;

    let html = '<div class="period-filter" style="margin-bottom:12px;">' +
      '<button class="filter-btn ' + (currentTimelinePeriod === 'renchenlu' ? 'active' : '') + '" onclick="window.app.switchTimelinePeriod(\'renchenlu\')">壬辰倭乱时期</button>' +
      '<button class="filter-btn ' + (currentTimelinePeriod === 'mengjian' ? 'active' : '') + '" onclick="window.app.switchTimelinePeriod(\'mengjian\')">1908年日占时期</button>' +
    '</div><div class="timeline-vertical">';

    data.forEach(function(t, i) {
      html += '<div class="timeline-node" data-index="' + i + '">' +
        '<div class="timeline-date">' + t.date + '</div>' +
        '<div class="timeline-event">' + t.event + '</div>' +
        '<div class="timeline-desc">' + t.desc + '</div>' +
        '<div class="timeline-source">出处：' + t.source + '</div>' +
      '</div>';
    });

    html += '</div>';
    container.innerHTML = html;
  }

  async function renderMapTab(container) {
    container.innerHTML = '<div class="map-container">' +
      '<div class="map-tabs" id="mapTabs">' +
        '<button class="map-tab-btn active" data-map="war">战争进程图</button>' +
        '<button class="map-tab-btn" data-map="provinces">行政区划图</button>' +
        '<button class="map-tab-btn" data-map="zhuge">诸葛亮崇拜分布图</button>' +
        '<button class="map-tab-btn" data-map="colonial">殖民扩张图</button>' +
      '</div>' +
      '<div id="mapContainer" style="width:100%;height:400px;border-radius:8px;margin-top:12px;overflow:hidden"></div>' +
      '<div class="map-legend" style="padding:12px;font-size:13px;color:var(--color-text-light)">' +
        '<p><strong>图例：</strong></p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px">' +
          '<span><span style="display:inline-block;width:12px;height:12px;background:#c0392b;border-radius:50%;margin-right:4px"></span>日军进攻路线</span>' +
          '<span><span style="display:inline-block;width:12px;height:12px;background:#27ae60;border-radius:50%;margin-right:4px"></span>朝鲜/明军反击</span>' +
          '<span><span style="display:inline-block;width:12px;height:12px;background:#3498db;border-radius:50%;margin-right:4px"></span>海战地点</span>' +
        '</div>' +
      '</div>' +
    '</div>';

    document.querySelectorAll('.map-tab-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.map-tab-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderInteractiveMap(btn.dataset.map);
      });
    });

    await renderInteractiveMap('war');
  }

  async function renderInteractiveMap(mapType) {
    const container = document.getElementById('mapContainer');
    if (!container) return;

    // 销毁旧地图
    if (leafletMap) {
      leafletMap.remove();
      leafletMap = null;
    }

    // 创建新地图
    leafletMap = L.map('mapContainer').setView([37.0, 127.5], 7);

    // 地图图层定义
    const modernLayer = L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
      attribution: '高德地图',
      subdomains: ['1', '2', '3', '4']
    });

    const historicalLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'ESRI',
      maxZoom: 18
    });

    // 默认使用历史物理地图
    historicalLayer.addTo(leafletMap);

    // 添加图层控制
    const baseMaps = {
      '历史地图（默认）': historicalLayer,
      '现代地图': modernLayer
    };
    L.control.layers(baseMaps).addTo(leafletMap);

    // 添加标记点
    const markers = [];
    const routes = [];

    if (mapType === 'war') {
      // 添加战役标记
      TIMELINE_DATA.forEach(function(t) {
        const marker = L.marker([t.lat, t.lng]).addTo(leafletMap);
        marker.bindPopup('<div class="map-popup"><h4>' + t.event + '</h4><p>' + t.desc + '</p><p><strong>出处：</strong>' + t.source + '</p></div>');
        markers.push(marker);
      });

      // 绘制日军进攻路线（从釜山到汉城再到平壤）
      const attackRoute = [
        [35.18, 129.08],  // 釜山
        [35.50, 128.50],
        [36.00, 128.00],
        [36.50, 127.80],
        [37.00, 127.50],
        [37.57, 127.00]  // 汉城
      ];
      const routeLine = L.polyline(attackRoute, {
        color: '#c0392b',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 5'
      }).addTo(leafletMap);
      routeLine.bindPopup('<strong>日军进攻路线</strong><br>釜山 → 汉城（1592年）');
      routes.push(routeLine);

      // 绘制朝鲜/明军反击路线
      const counterRoute = [
        [34.75, 126.35],  // 闲山岛
        [35.20, 127.00],
        [37.00, 126.50],
        [39.03, 125.75]   // 平壤
      ];
      const counterLine = L.polyline(counterRoute, {
        color: '#27ae60',
        weight: 3,
        opacity: 0.7,
        dashArray: '8, 4'
      }).addTo(leafletMap);
      counterLine.bindPopup('<strong>朝鲜/明军反击路线</strong><br>闲山岛 → 平壤');
      routes.push(counterLine);

      // 绘制海战位置标记
      const navalBattles = [
        { lat: 34.75, lng: 126.35, name: '闲山岛海战' },
        { lat: 34.85, lng: 127.38, name: '鸣梁海战' },
        { lat: 34.60, lng: 127.85, name: '露梁海战' }
      ];
      navalBattles.forEach(function(b) {
        const circle = L.circleMarker([b.lat, b.lng], {
          radius: 8,
          fillColor: '#3498db',
          color: '#fff',
          weight: 2,
          fillOpacity: 0.8
        }).addTo(leafletMap);
        circle.bindPopup('<div class="map-popup"><h4>' + b.name + '</h4><p>海战地点</p></div>');
        markers.push(circle);
      });

    } else if (mapType === 'provinces') {
      const provinces = [
        { name: '京畿道', lat: 37.3, lng: 127.0, city: '汉城' },
        { name: '庆尚道', lat: 35.7, lng: 128.6, city: '大邱' },
        { name: '全罗道', lat: 35.2, lng: 126.8, city: '全州' },
        { name: '忠清道', lat: 36.5, lng: 127.2, city: '大田' },
        { name: '黄海道', lat: 38.0, lng: 126.0, city: '海州' },
        { name: '江原道', lat: 37.8, lng: 128.2, city: '春川' },
        { name: '平安道', lat: 39.0, lng: 125.7, city: '平壤' },
        { name: '咸镜道', lat: 40.0, lng: 127.5, city: '咸兴' }
      ];
      provinces.forEach(function(p) {
        const marker = L.marker([p.lat, p.lng]).addTo(leafletMap);
        marker.bindPopup('<div class="map-popup"><h4>' + p.name + '</h4><p>首府：' + p.city + '</p></div>');
        markers.push(marker);
      });
    } else if (mapType === 'zhuge') {
      const zhugeSites = [
        { name: '首尔武侯祠', lat: 37.55, lng: 126.98 },
        { name: '平壤武侯祠', lat: 39.03, lng: 125.75 },
        { name: '江陵武侯祠', lat: 38.11, lng: 128.75 },
        { name: '济州武侯祠', lat: 33.47, lng: 126.83 },
        { name: '山东琅琊', lat: 35.85, lng: 119.50 }
      ];
      zhugeSites.forEach(function(s) {
        const marker = L.marker([s.lat, s.lng]).addTo(leafletMap);
        marker.bindPopup('<div class="map-popup"><h4>' + s.name + '</h4><p>诸葛亮崇拜遗址</p></div>');
        markers.push(marker);
      });
    } else if (mapType === 'colonial') {
      const colonialSites = [
        { name: '江华岛', lat: 37.58, lng: 126.55, year: '1876' },
        { name: '釜山', lat: 35.18, lng: 129.08, year: '1876' },
        { name: '汉城', lat: 37.57, lng: 127.00, year: '1910' },
        { name: '首尔', lat: 37.55, lng: 126.98, year: '1910' }
      ];
      colonialSites.forEach(function(s) {
        const marker = L.marker([s.lat, s.lng]).addTo(leafletMap);
        marker.bindPopup('<div class="map-popup"><h4>' + s.name + '</h4><p>' + s.year + '年重要地点</p></div>');
        markers.push(marker);
      });
    }

    leafletMap._markers = markers;
    leafletMap._routes = routes;
  }

  async function renderBattlesTab(container) {
    battlesData = await loadJSON(CONFIG.dataPath + 'battles.json');

    let html = '<div class="battle-list">';
    battlesData.forEach(function(b) {
      html += '<div class="battle-card" onclick="window.app.showBattle(' + b.id + ')">' +
        '<div class="battle-header">' +
          '<div><div class="battle-name">' + b.name + '</div><div class="battle-date">' + b.date + '</div></div>' +
          '<span class="source-badge primary">' + b.source + '</span>' +
        '</div>' +
        '<div class="battle-meta">地点：' + b.location + '</div>' +
        '<div class="battle-summary">' + b.significance + '</div>' +
        '<span class="battle-result ' + (b.result.indexOf('胜') >= 0 ? '' : 'defeat') + '">' + b.result + '</span>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  async function renderCharactersTab(container) {
    charactersData = await loadJSON(CONFIG.dataPath + 'characters.json');

    const novelCounts = {};
    charactersData.forEach(function(c) {
      const novel = c.relatedWork || '壬辰录';
      novelCounts[novel] = (novelCounts[novel] || 0) + 1;
    });

    let html = '<div class="filter-buttons" id="charFilter">' +
      '<button class="filter-btn active" data-novel="all">全部 (' + charactersData.length + ')</button>' +
      '<button class="filter-btn" data-novel="renchenlu">壬辰录 (' + (novelCounts['壬辰录'] || 0) + ')</button>' +
      '<button class="filter-btn" data-novel="mengjian">梦见诸葛亮 (' + (novelCounts['梦见诸葛亮'] || 0) + ')</button>' +
    '</div><div class="char-grid" id="charGrid">';

    charactersData.forEach(function(c) {
      html += '<div class="char-card" onclick="window.app.showCharacter(\'' + c.id + '\')">' +
        '<div class="name">' + c.name + '</div>' +
        '<div class="subtitle">' + c.title.split('·')[0] + '</div>' +
        '<span class="tag">' + c.korean + '</span>' +
        '<span class="char-novel-tag">' + (c.relatedWork || '壬辰录') + '</span>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;

    document.querySelectorAll('#charFilter .filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const novel = btn.dataset.novel;
        document.querySelectorAll('#charFilter .filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filtered = novel === 'all' ? charactersData :
          charactersData.filter(function(c) { return c.relatedWork === (novel === 'renchenlu' ? '壬辰录' : '梦见诸葛亮'); });
        const grid = document.getElementById('charGrid');
        if (grid) {
          let gridHtml = '';
          filtered.forEach(function(c) {
            gridHtml += '<div class="char-card" onclick="window.app.showCharacter(\'' + c.id + '\')">' +
              '<div class="name">' + c.name + '</div>' +
              '<div class="subtitle">' + c.title.split('·')[0] + '</div>' +
              '<span class="tag">' + c.korean + '</span>' +
              '<span class="char-novel-tag">' + (c.relatedWork || '壬辰录') + '</span>' +
            '</div>';
          });
          grid.innerHTML = gridHtml;
        }
      });
    });
  }

  function showCharacter(id) {
    const char = charactersData.find(function(c) { return c.id === id; });
    if (!char) return;

    const modal = document.getElementById('characterModal');
    const body = document.getElementById('modalBody');

    let html = '<div class="modal-body">' +
      '<div class="modal-name">' + char.name + '</div>' +
      '<div class="modal-korean">' + char.korean + '</div>' +
      '<div style="text-align:center;margin:8px 0"><span class="source-badge primary">' + (char.relatedWork || '壬辰录') + '</span></div>' +
      '<div class="modal-section"><h4>历史身份</h4><p>' + char.title + '</p></div>' +
      '<div class="modal-section"><h4>生平简介</h4><p>' + (char.summary || char.biography || '暂无详细信息') + '</p></div>';

    if (char.novelRole) {
      html += '<div class="modal-section"><h4>小说形象 <span class="content-type-tag novel">小说形象</span></h4><p>' + char.novelRole + '</p></div>';
    }
    if (char.source) {
      html += '<div class="modal-section"><h4>史料来源</h4><p>' + char.source + '</p></div>';
    }

    html += '</div>';
    body.innerHTML = html;
    modal.classList.add('show');
  }

  function showBattle(id) {
    const battle = battlesData.find(function(b) { return b.id === id; });
    if (!battle) return;

    const modal = document.getElementById('battleModal');
    const body = document.getElementById('battleModalBody');

    let html = '<div class="modal-body">' +
      '<div class="modal-name">' + battle.name + '</div>' +
      '<div class="modal-korean">' + battle.date + ' · ' + battle.location + '</div>';

    if (battle.source) {
      html += '<div style="text-align:center;margin:8px 0"><span class="source-badge primary">' + battle.source + '</span></div>';
    }

    html += '<div class="modal-section"><h4>参战方</h4><p>' + battle.sides.join(' vs ') + '</p></div>' +
      '<div class="modal-section"><h4>战役结果</h4><p>' + battle.result + '</p></div>' +
      '<div class="modal-section"><h4>历史意义</h4><p>' + battle.significance + '</p></div>';

    if (battle.relatedCharacters && battle.relatedCharacters.length > 0) {
      html += '<div class="modal-section"><h4>相关人物</h4><div class="modal-tags">';
      battle.relatedCharacters.forEach(function(cid) {
        const char = charactersData.find(function(c) { return c.id === cid; });
        if (char) html += '<span class="modal-tag">' + char.name + '</span>';
      });
      html += '</div></div>';
    }

    html += '</div>';
    body.innerHTML = html;
    modal.classList.add('show');
  }

  // ========== 导航与路由 ==========

  function navigateTo(page) {
    currentPage = page;
    window.location.hash = page;
    document.querySelectorAll('.bottom-nav-item').forEach(function(item) {
      item.classList.toggle('active', item.dataset.page === page);
    });

    switch(page) {
      case 'text': renderText(); break;
      case 'literature': renderLiteraturePage(); break;
      case 'shiliao': renderShiliao(); break;
      case 'research': renderResearch(); break;
      case 'profile': renderProfile(); break;
      default: renderText();
    }
  }

  function renderLiteraturePage() {
    const main = document.getElementById('mainContent');
    referencesData = [];
    loadJSON(CONFIG.referencesPath).then(function(data) {
      referencesData = data;
    });

    const typeOptions = [
      { value: 'all', label: '全部' },
      { value: 'thesis', label: '学位论文' },
      { value: 'journal', label: '期刊论文' },
      { value: 'monograph', label: '专著' },
      { value: 'conference', label: '会议论文' }
    ];
    const regionOptions = [
      { value: 'all', label: '全部' },
      { value: 'domestic', label: '国内研究' },
      { value: 'foreign', label: '国外研究' }
    ];

    let filterHTML = buildDropdownFilter([
      { id: 'litType', label: '学术类型', options: typeOptions },
      { id: 'litRegion', label: '地域', options: regionOptions }
    ]);

    main.innerHTML = '<section class="page-section active" id="page-literature">' +
      filterHTML +
      '<div class="content-area">' +
        '<p style="color:#888;font-size:14px;margin-bottom:16px">共收录 ' + referencesData.length + ' 条参考文献，可筛选查看。</p>' +
        '<div id="literatureList"></div>' +
        '<button class="add-btn" onclick="window.app.addLiterature()">＋ 新增文献（本地暂存）</button>' +
      '</div>' +
    '</section>';

    // 绑定筛选芯片点击
    document.querySelectorAll('#page-literature .filter-chip').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const cat = btn.dataset.cat;
        const value = btn.dataset.value;
        document.querySelectorAll('.filter-chip[data-cat="' + cat + '"]').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (cat === 'litType') litFilters.type = value;
        if (cat === 'litRegion') litFilters.region = value;
      });
    });

    renderLiteratureList(referencesData);
  }

  function renderLiteratureList(items) {
    const list = document.getElementById('literatureList');
    if (!list) return;

    const filtered = items.filter(function(item) {
      if (litFilters.type !== 'all' && item.type !== litFilters.type) return false;
      if (litFilters.region !== 'all' && item.region !== litFilters.region) return false;
      return true;
    });

    if (filtered.length === 0) {
      list.innerHTML = '<p style="color:#999;text-align:center;padding:20px">暂无匹配文献</p>';
      return;
    }

    list.innerHTML = filtered.map(function(item) {
      return '<div class="lit-card">' +
        '<div style="display:flex;justify-content:space-between;align-items:flex-start">' +
          '<div style="flex:1">' +
            '<h3 style="font-size:15px;color:var(--color-primary);margin-bottom:4px">' + item.title + '</h3>' +
            '<p style="font-size:13px;color:var(--color-text-light);margin-bottom:6px">' + item.author + ' · ' + item.citation + '</p>' +
            '<p style="font-size:13px;color:var(--color-text)">' + item.note + '</p>' +
          '</div>' +
          '<div style="display:flex;gap:4px;margin-left:8px">' +
            '<button class="copy-btn" onclick="window.app.copyCitation(' + JSON.stringify(item.citation) + ')" title="复制引用格式">复制</button>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:8px">' +
          '<span class="source-badge ' + (item.type === 'thesis' ? 'historical' : item.type === 'journal' ? 'novel' : 'primary') + '">' +
            { thesis: '学位论文', journal: '期刊论文', monograph: '专著', conference: '会议论文' }[item.type] || item.type +
          '</span>' +
          '<span class="source-badge primary">' + (item.region === 'domestic' ? '国内研究' : '国外研究') + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function addLiterature() {
    const saved = localStorage.getItem('renchenlu_literature') || '[]';
    let items = [];
    try { items = JSON.parse(saved); } catch(e) {}
    items.push({ title: '新文献标题', note: '此处填写摘要、观点、引用格式等' });
    localStorage.setItem('renchenlu_literature', JSON.stringify(items));
    renderLiteratureList(items);
  }

  function updateLiterature(index, field, value) {
    const saved = localStorage.getItem('renchenlu_literature') || '[]';
    let items = [];
    try { items = JSON.parse(saved); } catch(e) {}
    if (items[index]) { items[index][field] = value; localStorage.setItem('renchenlu_literature', JSON.stringify(items)); }
  }

  function deleteLiterature(index) {
    const saved = localStorage.getItem('renchenlu_literature') || '[]';
    let items = [];
    try { items = JSON.parse(saved); } catch(e) {}
    items.splice(index, 1);
    localStorage.setItem('renchenlu_literature', JSON.stringify(items));
    renderLiteratureList(items);
  }

  function copyCitation(citation) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(citation).then(function() {
        alert('引用格式已复制！');
      });
    } else {
      alert('引用格式：' + citation);
    }
  }

  // ========== 研究页面 ==========

  function countWork(work) {
    return charactersData.filter(function(c) { return (c.relatedWork || '壬辰录') === work; }).length;
  }

  function renderCharGrid(gridEl, list) {
    if (!gridEl) return;
    let html = '';
    list.forEach(function(c) {
      html += '<div class="char-card" onclick="window.app.showCharacter(\'' + c.id + '\')">' +
        '<div class="name">' + c.name + '</div>' +
        '<div class="subtitle">' + c.title.split('·')[0] + '</div>' +
        '<span class="tag">' + c.korean + '</span>' +
        '<span class="char-novel-tag">' + (c.relatedWork || '壬辰录') + '</span>' +
      '</div>';
    });
    gridEl.innerHTML = html;
  }

  async function renderResearch() {
    const main = document.getElementById('mainContent');
    main.innerHTML =
      '<section class="page-section active" id="page-research">' +
      '<div class="tab-bar">' +
          '<div class="tab-item ' + (currentResearchTab === 'about' ? 'active' : '') + '" data-rtab="about">关于文本</div>' +
          '<div class="tab-item ' + (currentResearchTab === 'literature' ? 'active' : '') + '" data-rtab="literature">文献研究</div>' +
          '<div class="tab-item ' + (currentResearchTab === 'characters' ? 'active' : '') + '" data-rtab="characters">人物</div>' +
        '</div>' +
        '<div class="content-area" id="researchContent">' +
          '<div class="loading-state"><div class="spinner"></div><p>加载中...</p></div>' +
        '</div>' +
      '</section>';

    document.querySelectorAll('#page-research .tab-item').forEach(function(tab) {
      tab.addEventListener('click', function() {
        currentResearchTab = tab.dataset.rtab;
        renderResearch();
      });
    });

    const contentDiv = document.getElementById('researchContent');
    if (currentResearchTab === 'about') {
      await renderResearchAbout(contentDiv);
    } else if (currentResearchTab === 'literature') {
      await renderResearchLiterature(contentDiv);
    } else if (currentResearchTab === 'characters') {
      await renderResearchCharacters(contentDiv);
    }
  }

  async function renderResearchCharacters(container) {
    if (charactersData.length === 0) charactersData = await loadJSON(CONFIG.dataPath + 'characters.json');

    const novelCounts = {};
    charactersData.forEach(function(c) {
      const novel = c.relatedWork || '壬辰录';
      novelCounts[novel] = (novelCounts[novel] || 0) + 1;
    });

    let html = '<div class="filter-buttons" id="researchCharFilter">' +
      '<button class="filter-btn active" data-novel="all">全部 (' + charactersData.length + ')</button>' +
      '<button class="filter-btn" data-novel="renchenlu">壬辰录 (' + (novelCounts['壬辰录'] || 0) + ')</button>' +
      '<button class="filter-btn" data-novel="mengjian">梦见诸葛亮 (' + (novelCounts['梦见诸葛亮'] || 0) + ')</button>' +
    '</div><div class="char-grid" id="researchCharGrid">';

    charactersData.forEach(function(c) {
      html += '<div class="char-card" onclick="window.app.showCharacter(\'' + c.id + '\')">' +
        '<div class="avatar">' + (c.avatar || '👤') + '</div>' +
        '<div class="name">' + c.name + '</div>' +
        '<div class="subtitle">' + c.title.split('·')[0] + '</div>' +
        '<span class="tag">' + c.korean + '</span>' +
        '<span class="char-novel-tag">' + (c.relatedWork || '壬辰录') + '</span>' +
      '</div>';
    });
    html += '</div>';
    container.innerHTML = html;

    document.querySelectorAll('#researchCharFilter .filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const novel = btn.dataset.novel;
        document.querySelectorAll('#researchCharFilter .filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const filtered = novel === 'all' ? charactersData :
          charactersData.filter(function(c) { return c.relatedWork === (novel === 'renchenlu' ? '壬辰录' : '梦见诸葛亮'); });
        const grid = document.getElementById('researchCharGrid');
        if (grid) {
          let gridHtml = '';
          filtered.forEach(function(c) {
            gridHtml += '<div class="char-card" onclick="window.app.showCharacter(\'' + c.id + '\')">' +
              '<div class="avatar">' + (c.avatar || '👤') + '</div>' +
              '<div class="name">' + c.name + '</div>' +
              '<div class="subtitle">' + c.title.split('·')[0] + '</div>' +
              '<span class="tag">' + c.korean + '</span>' +
              '<span class="char-novel-tag">' + (c.relatedWork || '壬辰录') + '</span>' +
            '</div>';
          });
          grid.innerHTML = gridHtml;
        }
      });
    });
  }

  async function renderResearchAbout(container) {
    if (charactersData.length === 0) charactersData = await loadJSON(CONFIG.dataPath + 'characters.json');

    let html = '<div class="content-section">' +
      '<h3 style="font-size:17px;color:var(--color-primary);margin-bottom:8px">版本对比分析</h3>' +
      '<p style="font-size:14px;color:var(--color-text-light);margin-bottom:12px">《壬辰录》现存七大主要版本，分属汉文与韩文谚文两大系统。</p>' +
    '</div>';

    html += '<div class="content-section">' +
      '<div class="version-table-wrapper">' +
        '<table class="version-table">' +
          '<thead><tr><th>序号</th><th>版本名称</th><th>字数</th><th>行数</th><th>语言</th></tr></thead>' +
          '<tbody>' +
            '<tr><td>1</td><td>东洋文库</td><td>~92KB</td><td>404行</td><td>汉文（文言文）</td></tr>' +
            '<tr><td>2</td><td>国立</td><td>~112KB</td><td>594行</td><td>汉文（文言文）</td></tr>' +
            '<tr><td>3</td><td>精神文化</td><td>~154KB</td><td>237行</td><td>汉文（白话小说体）</td></tr>' +
            '<tr><td>4</td><td>柏克莱</td><td>~35KB</td><td>62行</td><td>汉文（白话小说体）</td></tr>' +
            '<tr><td>5</td><td>莫斯科</td><td>~162KB</td><td>412行</td><td>韩文谚文</td></tr>' +
            '<tr><td>6</td><td>小说集版</td><td>~91KB</td><td>231行</td><td>韩文谚文</td></tr>' +
            '<tr><td>7</td><td>手抄本</td><td>~7KB</td><td>45行</td><td>汉文（简体）</td></tr>' +
          '</tbody>' +
        '</table>' +
      '</div>' +
    '</div>';

    html += '<div class="content-section">' +
      '<h3 style="font-size:17px;color:var(--color-primary);margin-bottom:12px">关键发现</h3>' +
      '<div class="insight-cards">' +
        '<div class="insight-card">' +
          '<div class="insight-text">国立版本行数最多（594行），内容最完整</div>' +
        '</div>' +
        '<div class="insight-card">' +
          '<div class="insight-text">柏克莱版本最简略，仅62行</div>' +
        '</div>' +
        '<div class="insight-card">' +
          '<div class="insight-text">七版本分属汉文与韩文谚文两大系统</div>' +
        '</div>' +
      '</div>' +
    '</div>';

    html += '<div class="content-section">' +
      '<h3 style="font-size:17px;color:var(--color-primary);margin-bottom:8px">小说人物</h3>' +
      '<p style="font-size:14px;color:var(--color-text-light);margin-bottom:12px">点击人物卡片查看其历史身份与小说形象。</p>' +
      '<div class="filter-buttons" id="researchCharFilter">' +
        '<button class="filter-btn active" data-novel="all">全部 (' + charactersData.length + ')</button>' +
        '<button class="filter-btn" data-novel="renchenlu">壬辰录 (' + countWork('壬辰录') + ')</button>' +
        '<button class="filter-btn" data-novel="mengjian">梦见诸葛亮 (' + countWork('梦见诸葛亮') + ')</button>' +
      '</div>' +
      '<div class="char-grid" id="researchCharGrid"></div>' +
    '</div>';

    container.innerHTML = html;

    renderCharGrid(document.getElementById('researchCharGrid'), charactersData);

    document.querySelectorAll('#researchCharFilter .filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('#researchCharFilter .filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        const novel = btn.dataset.novel;
        const filtered = novel === 'all' ? charactersData :
          charactersData.filter(function(c) { return c.relatedWork === (novel === 'renchenlu' ? '壬辰录' : '梦见诸葛亮'); });
        renderCharGrid(document.getElementById('researchCharGrid'), filtered);
      });
    });
  }

  async function renderResearchLiterature(container) {
    const perspectives = [
      { title: '民族危机与历史想象', chapter: '第三章', desc: '以壬辰倭乱为历史底色，考察小说如何借战乱书写民族危机意识与历史创伤，重构集体记忆。' },
      { title: '英雄人物与历史想象', chapter: '第四章', desc: '分析李舜臣等英雄形象在小说中的叙事资源借用、再造与联合抗敌愿景的文学表达。' },
      { title: '历史叙事的价值取向', chapter: '第三/四章', desc: '从儒家正统、华夷之辨与忠义观念出发，辨析小说的历史观与价值立场。' },
      { title: '版本与文本流传', chapter: '第二章', desc: '梳理《壬辰录》汉文与韩文谚文七大版本的源流、异同与文本演变。' },
      { title: '朝鲜朝梦游录传统', chapter: '第二/五章', desc: '以《梦见诸葛亮》为中心，探讨梦游录小说的文体特征、民族意识与儒学思想。' }
    ];

    let html = '<div class="content-section" style="margin-bottom:16px">' +
      '<h3 style="font-size:17px;color:var(--color-primary);margin-bottom:8px">文献研究视角</h3>' +
      '<p style="font-size:14px;color:var(--color-text-light)">以下为论文核心研究视角，对应各章节。点击展开详细内容。</p>' +
    '</div>';

    html += '<div class="perspective-list">';
    perspectives.forEach(function(p, idx) {
      html += '<div class="perspective-card" data-idx="' + idx + '">' +
        '<div class="perspective-header">' +
          '<span class="perspective-title">' + p.title + '</span>' +
          '<span class="perspective-chapter">' + p.chapter + '</span>' +
          '<span class="perspective-arrow">></span>' +
        '</div>' +
        '<div class="perspective-content" id="perspective-' + idx + '" style="display:none">' +
          '<p>' + p.desc + '</p>' +
          '<p style="margin-top:8px;color:var(--color-text-light)">此处可补充具体文献与论述内容...</p>' +
        '</div>' +
      '</div>';
    });
    html += '</div>';

    container.innerHTML = html;

    document.querySelectorAll('.perspective-card').forEach(function(card) {
      card.addEventListener('click', function() {
        const idx = this.dataset.idx;
        const content = document.getElementById('perspective-' + idx);
        if (content.style.display === 'none') {
          content.style.display = 'block';
          this.classList.add('expanded');
        } else {
          content.style.display = 'none';
          this.classList.remove('expanded');
        }
      });
    });
  }

  // ========== 我的页面 ==========

  async function renderProfile() {
    const main = document.getElementById('mainContent');

    const daysToMidterm = Math.ceil((new Date('2026-09-16') - new Date()) / (1000 * 60 * 60 * 24));
    const totalWords = 37047;
    const targetWords = 40000;
    const progressPercent = Math.round((totalWords / targetWords) * 100);

    main.innerHTML =
      '<section class="page-section active" id="page-profile">' +
      '<div class="content-area" style="padding:0;background:transparent;border:none">' +
          '<div class="progress-card">' +
            '<div class="progress-header">' +
              '<h3 style="font-size:16px;color:var(--color-primary);margin:0">论文进度追踪</h3>' +
              '<span style="font-size:12px;color:var(--color-text-light)">更新于：' + new Date().toISOString().split('T')[0] + '</span>' +
            '</div>' +
            '<div class="progress-item">' +
              '<div class="progress-label">中期检查倒计时</div>' +
              '<div class="progress-value">' + (daysToMidterm > 0 ? daysToMidterm + ' 天' : '已到期') + '</div>' +
            '</div>' +
            '<div class="progress-item">' +
              '<div class="progress-label">韩文字数</div>' +
              '<div class="progress-value">' + totalWords.toLocaleString() + ' / ' + targetWords.toLocaleString() + ' 字</div>' +
              '<div class="progress-bar"><div class="progress-fill" style="width:' + progressPercent + '%"></div></div>' +
            '</div>' +
            '<div class="progress-item">' +
              '<div class="progress-label">参考文献</div>' +
              '<div class="progress-value">已完成：20 / 目标：50 篇（外文：8 / 20 篇）</div>' +
            '</div>' +
          '</div>' +

          '<div class="timeline-mini">' +
            '<div class="timeline-mini-item completed">已完成：开题报告</div>' +
            '<div class="timeline-mini-item completed">已完成：期刊论文已发表</div>' +
            '<div class="timeline-mini-item current">进行中：中期检查准备</div>' +
            '<div class="timeline-mini-item">待完成：韩文后处理</div>' +
            '<div class="timeline-mini-item">待完成：全文定稿</div>' +
          '</div>' +

          '<div class="profile-cards">' +
            '<div class="profile-card" data-doc="kaiban">' +
              '<div class="profile-info">' +
                '<div class="profile-title">开题报告</div>' +
                '<div class="profile-subtitle">论文选题、研究框架与先行研究</div>' +
              '</div>' +
              '<div class="profile-arrow">></div>' +
            '</div>' +
            '<div class="profile-card" data-doc="xiaolunwen">' +
              '<div class="profile-info">' +
                '<div class="profile-title">小论文</div>' +
                '<div class="profile-subtitle">已发表论文：梦见诸葛亮的民族意识与儒学思想</div>' +
              '</div>' +
              '<div class="profile-arrow">></div>' +
            '</div>' +
            '<div class="profile-card" data-doc="lunwen">' +
              '<div class="profile-info">' +
                '<div class="profile-title">毕业论文</div>' +
                '<div class="profile-subtitle">壬辰录与梦见诸葛亮的历史想象研究（撰写中）</div>' +
              '</div>' +
              '<div class="profile-arrow">></div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>';

    document.querySelectorAll('#page-profile .profile-card').forEach(function(card) {
      card.addEventListener('click', function() { loadProfileDoc(card.dataset.doc); });
    });
  }

  const PROFILE_DOCS = {
    kaiban: { file: 'content/profile/开题报告.md', title: '开题报告' },
    xiaolunwen: { file: 'content/profile/小论文.md', title: '小论文' },
    lunwen: { file: 'content/profile/毕业论文.md', title: '毕业论文' }
  };

  async function loadProfileDoc(key) {
    const main = document.getElementById('mainContent');
    const info = PROFILE_DOCS[key];
    if (!info) return;
    main.innerHTML = '<section class="page-section active">' +
      '<div class="back-btn" onclick="window.app.renderProfile()">返回</div>' +
      '<h2 style="font-size:18px;color:var(--color-primary);margin:12px 0 16px;padding-bottom:8px;border-bottom:2px solid var(--color-border)">' + info.title + '</h2>' +
      '<div class="content-area" id="profileDoc"><div class="loading-state"><div class="spinner"></div><p>加载中...</p></div></div>' +
    '</section>';
    try {
      const md = await loadFile(info.file);
      const el = document.getElementById('profileDoc');
      if (el) el.innerHTML = renderMarkdown(md);
    } catch (e) {
      const el = document.getElementById('profileDoc');
      if (el) el.innerHTML = '<div class="error-state"><p>内容整理中，敬请期待</p></div>';
    }
  }

  // ========== 初始化 ==========

  function setupModalClose(modalId, closeBtnId) {
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    if (closeBtn) closeBtn.addEventListener('click', function() { modal.classList.remove('show'); });
    if (modal) modal.addEventListener('click', function(e) { if (e.target === modal) modal.classList.remove('show'); });
  }

  function init() {
    const hash = window.location.hash.replace('#', '') || 'text';

    document.querySelectorAll('.bottom-nav-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo(item.dataset.page);
      });
    });

    window.addEventListener('hashchange', function() {
      const page = window.location.hash.replace('#', '') || 'text';
      if (page !== currentPage) navigateTo(page);
    });

    setupModalClose('characterModal', 'modalClose');
    setupModalClose('battleModal', 'battleModalClose');

    navigateTo(hash);
  }

  // 导出到全局
  window.app = {
    showCharacter: showCharacter,
    showBattle: showBattle,
    addLiterature: addLiterature,
    updateLiterature: updateLiterature,
    deleteLiterature: deleteLiterature,
    copyCitation: copyCitation,
    renderProfile: renderProfile,
    toggleFilter: window.app.toggleFilter,
    resetFilter: window.app.resetFilter,
    confirmFilter: window.app.confirmFilter,
    switchTimelinePeriod: window.app.switchTimelinePeriod,
    switchResearchTab: window.app.switchResearchTab
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

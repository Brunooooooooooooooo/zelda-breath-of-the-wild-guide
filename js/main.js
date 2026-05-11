// === 移动端菜单切换 ===
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });
  document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });
}

// === 搜索索引 ===
const searchIndex = [
  { kw: '神庙 shrine shrines 试炼', title: '全120座神庙位置与解法', url: 'guides/shrines.html', cat: '神庙' },
  { kw: '神兽 divine beast 主线 盖侬 ganon', title: '解放四神兽完整攻略', url: 'guides/divine-beasts.html', cat: '主线' },
  { kw: '武器 盾牌 弓箭 大师之剑 装备 防具 master sword', title: '装备图鉴全收集指南', url: 'guides/equipment.html', cat: '装备' },
  { kw: '料理 烹饪 食材 配方 药剂 生命榴莲', title: '料理与药剂全配方指南', url: 'guides/cooking.html', cat: '料理' },
  { kw: 'BOSS 莱尼尔 lynel 人马 西诺克斯 hinox 岩石巨人 talus 莫尔德拉吉克 molduga 守护者 guardian', title: 'BOSS战完整攻略', url: 'guides/bosses.html', cat: 'BOSS' },
  { kw: '隐藏 秘密 彩蛋 龙 海利亚盾 马 呀哈哈 一始村', title: '全部隐藏要素大公开', url: 'guides/secrets.html', cat: '隐藏' },
  { kw: '区域 地图 海布拉 奥尔汀 拉聂尔 阿卡莱 费罗尼 格鲁德 哈特诺 中央海拉鲁', title: '海拉鲁八大区域攻略', url: 'guides/regions.html', cat: '区域' },
  { kw: '水咒 风咒 火咒 雷咒 waterblight windblight fireblight thunderblight', title: '解放四神兽完整攻略', url: 'guides/divine-beasts.html', cat: '主线' },
  { kw: '米法 mipha 力巴尔 revali 达尔克尔 daruk 乌尔波扎 urbosa 英杰', title: '解放四神兽完整攻略', url: 'guides/divine-beasts.html', cat: '主线' },
  { kw: '卓拉 佐拉 zora 利特 rito 鼓隆 goron 格鲁德 gerudo', title: '海拉鲁八大区域攻略', url: 'guides/regions.html', cat: '区域' },
  { kw: '防火 耐寒 耐热 抗电 防寒服 防火服 淑女装', title: '装备图鉴全收集指南', url: 'guides/equipment.html', cat: '装备' },
  { kw: '攻击 防御 潜行 速度 料理 配方 生命', title: '料理与药剂全配方指南', url: 'guides/cooking.html', cat: '料理' },
  { kw: '初始台地 新手 教程 滑翔伞 希卡之石', title: '全120座神庙位置与解法', url: 'guides/shrines.html', cat: '神庙' },
  { kw: '回忆 照片 记忆 memory', title: '全部隐藏要素大公开', url: 'guides/secrets.html', cat: '隐藏' },
  { kw: '古代 希卡 sheikah 守护者 古代兵装', title: '装备图鉴全收集指南', url: 'guides/equipment.html', cat: '装备' },
  { kw: '城堡 海拉鲁城堡 hyrule castle 监狱', title: 'BOSS战完整攻略', url: 'guides/bosses.html', cat: 'BOSS' },
  { kw: '呀哈哈 korok 克洛格 hestu 博库林', title: '全部隐藏要素大公开', url: 'guides/secrets.html', cat: '隐藏' },
  { kw: '榴莲 durian 香蕉 banana 生命 大剑', title: '料理与药剂全配方指南', url: 'guides/cooking.html', cat: '料理' },
];

function searchPages(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  if (q.length < 2) return searchIndex.filter(item => item.kw.includes(q));
  const results = [];
  const seen = new Set();
  for (const item of searchIndex) {
    if (item.kw.toLowerCase().includes(q) && !seen.has(item.url)) {
      results.push(item);
      seen.add(item.url);
    }
  }
  return results.slice(0, 8);
}

// === 搜索弹窗 ===
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function createSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <button class="search-close">✕</button>
    <div class="search-modal">
      <input type="text" placeholder="搜索攻略、神庙、装备、BOSS..." autofocus id="modalSearchInput">
      <div class="search-results" id="searchResults">
        <p class="search-hint">输入关键词搜索攻略内容，按 Enter 查看</p>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.search-close');
  const modalInput = overlay.querySelector('#modalSearchInput');
  const resultsDiv = overlay.querySelector('#searchResults');

  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.remove('active');
  });

  let timeout;
  modalInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      const q = modalInput.value.trim();
      const results = searchPages(q);
      if (results.length === 0 && q.length > 0) {
        resultsDiv.innerHTML = '<p class="search-hint">未找到相关攻略，试试其他关键词</p>';
      } else if (results.length > 0) {
        resultsDiv.innerHTML = results.map(r =>
          '<a href="' + r.url + '" class="search-result-item">' +
          '<span class="result-cat">' + r.cat + '</span>' +
          '<span class="result-title">' + r.title + '</span>' +
          '</a>'
        ).join('');
      } else {
        resultsDiv.innerHTML = '<p class="search-hint">输入关键词搜索攻略内容</p>';
      }
    }, 200);
  });

  modalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = modalInput.value.trim();
      const results = searchPages(q);
      if (results.length > 0) {
        window.location.href = results[0].url;
      }
      overlay.classList.remove('active');
    }
  });

  return overlay;
}

const searchOverlay = createSearchOverlay();

function openSearch(presetValue) {
  searchOverlay.classList.add('active');
  setTimeout(() => {
    const input = searchOverlay.querySelector('#modalSearchInput');
    input.focus();
    if (presetValue) {
      input.value = presetValue;
      input.dispatchEvent(new Event('input'));
    }
  }, 100);
}

searchBtn.addEventListener('click', () => openSearch());
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') openSearch(searchInput.value);
});

// === 返回顶部 ===
function createBackToTop() {
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.title = '返回顶部';
  btn.setAttribute('aria-label', '返回顶部');
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
}
createBackToTop();

// === 平滑滚动 ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navMenu && navMenu.classList.remove('active');
    }
  });
});

// === 滚动渐显动画 ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.guide-card, .quick-card, .region-card, .step').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

console.log('%c▲ %c荒野之息攻略站 %c已就绪','color:#c9a84c;font-size:1.2rem;','color:#e8e6dc;font-size:1rem;','color:#9ca3af;font-size:.8rem;');
console.log('%c愿你找到属于自己的勇气之路 🗡️', 'color:#c9a84c;');

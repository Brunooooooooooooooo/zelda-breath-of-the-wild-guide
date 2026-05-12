// === i18n 国际化引擎 ===
(function() {
  'use strict';

  const SUPPORTED = ['zh-CN', 'zh-TW', 'en', 'ja', 'de'];
  const STORAGE_KEY = 'zelda-guide-lang';
  let currentLang = 'zh-CN';
  let translations = {};

  // 获取浏览器首选语言
  function detectBrowserLang() {
    const nav = navigator.language || navigator.userLanguage || 'en';
    // 精确匹配
    const exact = SUPPORTED.find(l => l === nav);
    if (exact) return exact;
    // 模糊匹配（如 zh -> zh-CN, ja -> ja）
    const base = nav.split('-')[0];
    const fuzzy = SUPPORTED.find(l => l.startsWith(base));
    return fuzzy || 'en';
  }

  // 初始化语言
  function initLang() {
    // 1. URL 参数优先
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && SUPPORTED.includes(urlLang)) {
      currentLang = urlLang;
      localStorage.setItem(STORAGE_KEY, urlLang);
      return;
    }
    // 2. localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) {
      currentLang = saved;
      return;
    }
    // 3. 浏览器语言
    currentLang = detectBrowserLang();
    localStorage.setItem(STORAGE_KEY, currentLang);
  }

  // 获取 i18n 目录基础路径（相对于页面）
  function getI18nBase() {
    var path = window.location.pathname;
    // 如果在 guides/ 子目录下，需要 ../i18n/
    if (path.includes('/guides/')) {
      return '../i18n/';
    }
    return 'i18n/';
  }

  // 内嵌默认翻译（fetch/XHR 全部失败时使用）
  var EMBEDDED = {
    "zh-CN": {"hero":{"title":"\u6d77\u62c9\u9c81\u5192\u9669\u6307\u5357","desc":"\u795e\u5e99 \u00b7 \u4e3b\u7ebf \u00b7 \u88c5\u5907 \u00b7 \u6599\u7406 \u00b7 BOSS \u00b7 \u9690\u85cf\u8981\u7d20 \u2014 \u52a9\u4f60\u6210\u4e3a\u771f\u6b63\u7684\u52c7\u8005","cta_primary":"\u5f00\u59cb\u5192\u9669","cta_secondary":"\u67e5\u770b\u5730\u56fe","stat_shrines":"\u795e\u5e99","stat_quests":"\u4e3b\u7ebf\u4efb\u52a1","stat_koroks":"\u5440\u54c8\u54c8","stat_beasts":"\u795e\u517d"},"section":{"popular":"\u70ed\u95e8\u653b\u7565","regions":"\u533a\u57df\u653b\u7565","beginner":"\u65b0\u624b\u6307\u5357"},"search":"\u641c\u7d22\u653b\u7565...","nav":{"home":"\u9996\u9875","beginner":"\u65b0\u624b\u5165\u95e8","main":"\u4e3b\u7ebf\u653b\u7565","shrines":"\u795e\u5e99\u653b\u7565","equipment":"\u88c5\u5907\u56fe\u9274","bosses":"BOSS\u6307\u5357","more":"\u66f4\u591a \u25be"}},
    "en": {"hero":{"title":"Hyrule Adventure Guide","desc":"Shrines, Main Quests, Equipment, Cooking, Bosses, Secrets \u2014 become a true hero","cta_primary":"Start Adventure","cta_secondary":"View Map","stat_shrines":"Shrines","stat_quests":"Main Quests","stat_koroks":"Koroks","stat_beasts":"Divine Beasts"},"section":{"popular":"Popular Guides","regions":"Regional Guides","beginner":"Beginner Tips"},"search":"Search guides...","nav":{"home":"Home","beginner":"Beginner","main":"Main Quest","shrines":"Shrines","equipment":"Equipment","bosses":"Bosses","more":"More \u25be"}}
  };

  // 加载翻译文件（fetch + XHR fallback for file://）
  async function loadTranslations(lang) {
    var base = getI18nBase();
    var url = base + lang + '.json';
    try {
      var resp = await fetch(url);
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      translations = await resp.json();
      return;
    } catch (e) {
      console.warn('i18n: fetch failed for ' + lang + ', trying XHR...');
    }
    // XHR fallback for file:// protocol
    try {
      translations = await new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('XHR ' + xhr.status));
          }
        };
        xhr.onerror = function() { reject(new Error('XHR failed')); };
        xhr.send();
      });
      return;
    } catch (e2) {
      console.warn('i18n: XHR also failed for ' + lang);
    }
    // Final fallback: try zh-CN
    if (lang !== 'zh-CN') {
      try {
        var baseUrl = base + 'zh-CN.json';
        try { var r3 = await fetch(baseUrl); translations = await r3.json(); return; } catch (e3) {}
        translations = await new Promise(function(resolve, reject) {
          var x2 = new XMLHttpRequest();
          x2.open('GET', baseUrl, true);
          x2.onload = function() { resolve(JSON.parse(x2.responseText)); };
          x2.onerror = function() { reject(); };
          x2.send();
        });
      } catch (e4) {
        translations = {};
      }
    } else {
      translations = {};
    }
    // 如果最终 translations 为空且有内嵌翻译，使用内嵌
    if (!translations || Object.keys(translations).length === 0) {
      if (EMBEDDED[lang]) {
        translations = EMBEDDED[lang];
      } else if (EMBEDDED['zh-CN']) {
        translations = EMBEDDED['zh-CN'];
      }
    }
  }

  // 应用翻译到 DOM
  function applyTranslations() {
    document.documentElement.lang = currentLang;

    // 处理 data-i18n 属性
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getNestedValue(translations, key);
      if (val) el.textContent = val;
    });

    // 处理 data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getNestedValue(translations, key);
      if (val) el.placeholder = val;
    });

    // 处理 data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = getNestedValue(translations, key);
      if (val) el.title = val;
    });

    // 处理 data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = getNestedValue(translations, key);
      if (val) el.innerHTML = val;
    });

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      const desc = getNestedValue(translations, 'meta.description');
      if (desc) metaDesc.content = desc;
    }

    // Document title
    const titleKey = getNestedValue(translations, 'meta.title');
    if (titleKey) document.title = titleKey;

    // 更新当前语言显示
    updateLangDisplay();
  }

  function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  // 语言显示名称映射
  const LANG_NAMES = {
    'zh-CN': '简体中文',
    'zh-TW': '繁體中文',
    'en': 'English',
    'ja': '日本語',
    'de': 'Deutsch'
  };

  const LANG_FLAGS = {
    'zh-CN': '🇨🇳',
    'zh-TW': '🇹🇼',
    'en': '🇺🇸',
    'ja': '🇯🇵',
    'de': '🇩🇪'
  };

  // 创建语言下拉选择器
  function createLangDropdown() {
    const existing = document.getElementById('langDropdown');
    if (existing) return;

    const navContainer = document.querySelector('.nav-container');
    if (!navContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'lang-dropdown';
    wrapper.id = 'langDropdown';
    wrapper.innerHTML = `
      <button class="lang-toggle" id="langToggle" title="切换语言 / Switch Language">
        <span class="lang-flag">${LANG_FLAGS[currentLang]}</span>
        <span class="lang-name">${LANG_NAMES[currentLang]}</span>
        <span class="lang-arrow">▾</span>
      </button>
      <ul class="lang-menu" id="langMenu">
        ${SUPPORTED.map(l => `
          <li><a href="#" data-lang="${l}" class="${l === currentLang ? 'lang-active' : ''}">
            ${LANG_FLAGS[l]} ${LANG_NAMES[l]}
          </a></li>
        `).join('')}
      </ul>
    `;

    // 插入到 nav-search 之前
    const navSearch = navContainer.querySelector('.nav-search');
    if (navSearch) {
      navContainer.insertBefore(wrapper, navSearch);
    } else {
      navContainer.appendChild(wrapper);
    }

    // 切换下拉
    const toggle = wrapper.querySelector('.lang-toggle');
    const menu = wrapper.querySelector('.lang-menu');
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      menu.classList.toggle('lang-open');
    });

    // 关闭下拉（点击外部）
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        menu.classList.remove('lang-open');
      }
    });

    // 语言切换
    wrapper.querySelectorAll('[data-lang]').forEach(link => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const newLang = link.getAttribute('data-lang');
        if (newLang === currentLang) {
          menu.classList.remove('lang-open');
          return;
        }
        await switchLanguage(newLang);
        menu.classList.remove('lang-open');
      });
    });
  }

  function updateLangDisplay() {
    const toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.querySelector('.lang-flag').textContent = LANG_FLAGS[currentLang];
      toggle.querySelector('.lang-name').textContent = LANG_NAMES[currentLang];
    }
    const menu = document.getElementById('langMenu');
    if (menu) {
      menu.querySelectorAll('[data-lang]').forEach(a => {
        a.classList.toggle('lang-active', a.getAttribute('data-lang') === currentLang);
      });
    }
  }

  // 切换语言
  async function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    await loadTranslations(lang);
    applyTranslations();
  }

  // 暴露 API
  window.i18n = {
    getLang: () => currentLang,
    switchTo: switchLanguage,
    t: (key) => getNestedValue(translations, key) || key,
    getSupported: () => SUPPORTED
  };

  // 启动
  async function boot() {
    initLang();
    await loadTranslations(currentLang);
    // 创建语言下拉（在 applyTranslations 之前，以便翻译下拉中的文本）
    document.addEventListener('DOMContentLoaded', () => {
      createLangDropdown();
      applyTranslations();
    });
    // 如果 DOM 已加载
    if (document.readyState !== 'loading') {
      createLangDropdown();
      applyTranslations();
    }
  }

  boot();
})();

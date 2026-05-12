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
    "zh-CN": {"meta":{"title":"\u585e\u5c14\u8fbe\u4f20\u8bf4\uff1a\u65f7\u91ce\u4e4b\u606f \u653b\u7565\u7ad9 | \u6d77\u62c9\u9c81\u5192\u9669\u6307\u5357","description":"\u6700\u5168\u9762\u7684\u585e\u5c14\u8fbe\u4f20\u8bf4\u65f7\u91ce\u4e4b\u606f\u653b\u7565\u7ad9 - \u795e\u5e99\u4f4d\u7f6e\u3001\u4e3b\u7ebf\u4efb\u52a1\u3001BOSS\u6253\u6cd5\u3001\u88c5\u5907\u6536\u96c6\u3001\u6599\u7406\u914d\u65b9"},"nav":{"home":"\u9996\u9875","beginner":"\u65b0\u624b\u5165\u95e8","main":"\u4e3b\u7ebf\u653b\u7565","shrines":"\u795e\u5e99\u653b\u7565","equipment":"\u88c5\u5907\u56fe\u9274","bosses":"BOSS\u6307\u5357","more":"\u66f4\u591a \u25be","more_korok":"\u5440\u54c8\u54c8\u5168\u6536\u96c6","more_cooking":"\u6599\u7406\u914d\u65b9\u5927\u5168","more_secrets":"\u9690\u85cf\u8981\u7d20","more_regions":"\u533a\u57df\u653b\u7565","more_locations":"\u91cd\u8981\u5730\u70b9"},"search":"\u641c\u7d22\u653b\u7565...","hero":{"title":"\u6d77\u62c9\u9c81\u5192\u9669\u6307\u5357","subtitle":"\u300a\u585e\u5c14\u8fbe\u4f20\u8bf4\uff1a\u65f7\u91ce\u4e4b\u606f\u300b\u6700\u5168\u9762\u7684\u653b\u7565\u7ad9","desc":"\u795e\u5e99 \u00b7 \u4e3b\u7ebf \u00b7 \u88c5\u5907 \u00b7 \u6599\u7406 \u00b7 BOSS \u00b7 \u9690\u85cf\u8981\u7d20 \u2014 \u52a9\u4f60\u6210\u4e3a\u771f\u6b63\u7684\u52c7\u8005","cta_primary":"\u5f00\u59cb\u5192\u9669","cta_secondary":"\u67e5\u770b\u5730\u56fe","stat_shrines":"\u795e\u5e99","stat_quests":"\u4e3b\u7ebf\u4efb\u52a1","stat_koroks":"\u5440\u54c8\u54c8","stat_beasts":"\u795e\u517d"},"quick":{"beginner":"\u65b0\u624b\u5165\u95e8","beginner_desc":"\u521d\u59cb\u53f0\u5730\u5168\u6559\u5b66 \u00b7 \u57fa\u7840\u64cd\u4f5c \u00b7 \u56db\u5ea7\u795e\u5e99","main":"\u4e3b\u7ebf\u653b\u7565","main_desc":"\u89e3\u653e\u56db\u795e\u517d \u00b7 \u8ba8\u4f10\u707e\u5384\u76d6\u4fac \u00b7 \u56de\u5fc6\u4e4b\u65c5","shrines":"\u795e\u5e99\u653b\u7565","shrines_desc":"120\u5ea7\u795e\u5e99\u5b8c\u6574\u89e3\u6cd5 \u00b7 \u4f4d\u7f6e\u5730\u56fe \u00b7 \u5b9d\u7bb1\u6536\u96c6","equipment":"\u88c5\u5907\u56fe\u9274","equipment_desc":"\u6b66\u5668 \u00b7 \u76fe\u724c \u00b7 \u5f13\u7bad \u00b7 \u9632\u5177\u5957\u88c5\u5168\u6536\u96c6","bosses":"BOSS\u6307\u5357","bosses_desc":"\u795e\u517dBOSS \u00b7 \u4eba\u9a6c\u83b1\u5c3c\u5c14 \u00b7 \u5b88\u62a4\u8005\u653b\u7565","korok":"\u5440\u54c8\u54c8\u6536\u96c6","korok_desc":"900\u4e2a\u514b\u6d1b\u683c\u79cd\u5b50 \u00b7 \u8c1c\u9898\u7c7b\u578b \u00b7 \u535a\u5e93\u6797","cooking":"\u6599\u7406\u5927\u5168","cooking_desc":"50+\u914d\u65b9 \u00b7 \u5c5e\u6027\u836f\u5242 \u00b7 \u91c7\u96c6\u5730\u70b9","locations":"\u91cd\u8981\u5730\u70b9","locations_desc":"\u5e0c\u5361\u5854 \u00b7 \u9a7f\u7ad9 \u00b7 \u7cbe\u7075\u4e4b\u6cc9 \u00b7 \u9a6c\u795e","secrets":"\u9690\u85cf\u8981\u7d20","secrets_desc":"\u9f99\u4e4b\u6240\u5728 \u00b7 \u6d77\u5229\u4e9a\u76fe \u00b7 \u5f69\u86cb\u5168\u516c\u5f00"},"section":{"popular":"\u70ed\u95e8\u653b\u7565","regions":"\u533a\u57df\u653b\u7565","beginner":"\u65b0\u624b\u6307\u5357"},"footer":{"guides":"\u653b\u7565\u5206\u7c7b","main_quest":"\u4e3b\u7ebf\u4efb\u52a1","shrines_quest":"\u795e\u5e99\u653b\u7565","bosses_quest":"BOSS\u6307\u5357","secrets_quest":"\u9690\u85cf\u8981\u7d20","equipment":"\u88c5\u5907\u7cfb\u7edf","weapons":"\u6b66\u5668\u56fe\u9274","shields":"\u76fe\u724c\u56fe\u9274","armor":"\u9632\u5177\u5957\u88c5","cooking_footer":"\u6599\u7406\u914d\u65b9","about_site":"\u5173\u4e8e\u672c\u7ad9","about_us":"\u5173\u4e8e\u6211\u4eec","contribute":"\u8d21\u732e\u653b\u7565","github":"GitHub","feedback":"\u53cd\u9988\u5efa\u8bae","copyright":"\u00a9 2026 \u8352\u91ce\u4e4b\u606f\u653b\u7565\u7ad9 \u00b7 \u6e38\u620f\u7248\u6743\u5f52\u4efb\u5929\u5802\u6240\u6709 \u00b7 \u672c\u7ad9\u4e3a\u73a9\u5bb6\u81ea\u53d1\u653b\u7565\u5206\u4eab"},"common":{"back_to_top":"\u8fd4\u56de\u9876\u90e8","hot":"\ud83d\udd25 \u70ed\u95e8","recommended":"\ud83d\udccc \u63a8\u8350","new":"\ud83c\udd95 \u65b0\u589e","read_time":"\u5206\u949f"}},
    "en": {"meta":{"title":"Zelda: Breath of the Wild Guide | Hyrule Adventure Companion","description":"The most comprehensive BOTW guide - shrine locations, main quests, boss strategies, equipment collection, cooking recipes"},"nav":{"home":"Home","beginner":"Beginner","main":"Main Quest","shrines":"Shrines","equipment":"Equipment","bosses":"Bosses","more":"More \u25be","more_korok":"Korok Seeds","more_cooking":"Cooking","more_secrets":"Secrets","more_regions":"Regions","more_locations":"Locations"},"search":"Search guides...","hero":{"title":"Hyrule Adventure Guide","subtitle":"The most comprehensive Breath of the Wild guide","desc":"Shrines, Main Quests, Equipment, Cooking, Bosses, Secrets \u2014 become a true hero","cta_primary":"Start Adventure","cta_secondary":"View Map","stat_shrines":"Shrines","stat_quests":"Main Quests","stat_koroks":"Koroks","stat_beasts":"Divine Beasts"},"quick":{"beginner":"Beginner Guide","beginner_desc":"Great Plateau tutorial, basic controls, first shrines","main":"Main Quest","main_desc":"Free four Divine Beasts, defeat Calamity Ganon, memories","shrines":"Shrine Guide","shrines_desc":"Complete 120 shrine walkthroughs, location map, treasures","equipment":"Equipment","equipment_desc":"Weapons, shields, bows, armor sets full collection","bosses":"Boss Guide","bosses_desc":"Divine Beast bosses, Lynels, Guardian tactics","korok":"Korok Seeds","korok_desc":"All 900 korok seeds, puzzle types, Hestu locations","cooking":"Cooking","cooking_desc":"50+ recipes, elixirs, ingredient farming locations","locations":"Locations","locations_desc":"Sheikah Towers, stables, fairy fountains, horse god","secrets":"Secrets","secrets_desc":"Dragons, Hylian Shield, easter eggs revealed"},"section":{"popular":"Popular Guides","regions":"Regional Guides","beginner":"Beginner Tips"},"footer":{"guides":"Categories","main_quest":"Main Quest","shrines_quest":"Shrines","bosses_quest":"Bosses","secrets_quest":"Secrets","equipment":"Equipment","weapons":"Weapons","shields":"Shields","armor":"Armor","cooking_footer":"Cooking","about_site":"About","about_us":"About Us","contribute":"Contribute","github":"GitHub","feedback":"Feedback","copyright":"\u00a9 2026 BOTW Guide \u00b7 Game copyright Nintendo \u00b7 Fan-made guide"},"common":{"back_to_top":"Back to top","hot":"\ud83d\udd25 Hot","recommended":"\ud83d\udccc Recommended","new":"\ud83c\udd95 New","read_time":"min"}},
    "zh-TW": {"meta":{"title":"\u85a9\u723e\u9054\u50b3\u8aaa\uff1a\u66e0\u91ce\u4e4b\u606f \u653b\u7565\u7ad9 | \u6d77\u62c9\u9b6f\u5192\u96aa\u6307\u5357","description":"\u6700\u5168\u9762\u7684\u85a9\u723e\u9054\u50b3\u8aaa\u66e0\u91ce\u4e4b\u606f\u7e41\u9ad4\u653b\u7565\u7ad9 - \u795e\u5edf\u4f4d\u7f6e\u3001\u4e3b\u7dda\u4efb\u52d9\u3001BOSS\u6253\u6cd5\u3001\u88dd\u5099\u6536\u96c6\u3001\u6599\u7406\u914d\u65b9"},"nav":{"home":"\u9996\u9801","beginner":"\u65b0\u624b\u5165\u9580","main":"\u4e3b\u7dda\u653b\u7565","shrines":"\u795e\u5edf\u653b\u7565","equipment":"\u88dd\u5099\u5716\u9451","bosses":"BOSS\u6307\u5357","more":"\u66f4\u591a \u25be","more_korok":"\u514b\u6d1b\u683c\u7a2e\u5b50","more_cooking":"\u6599\u7406\u914d\u65b9","more_secrets":"\u96b1\u85cf\u8981\u7d20","more_regions":"\u5340\u57df\u653b\u7565","more_locations":"\u91cd\u8981\u5730\u9ede"},"search":"\u641c\u5c0b\u653b\u7565...","hero":{"title":"\u6d77\u62c9\u9b6f\u5192\u96aa\u6307\u5357","subtitle":"\u300a\u85a9\u723e\u9054\u50b3\u8aaa\uff1a\u66e0\u91ce\u4e4b\u606f\u300b\u6700\u5168\u9762\u7684\u7e41\u9ad4\u653b\u7565\u7ad9","desc":"\u795e\u5edf \u00b7 \u4e3b\u7dda \u00b7 \u88dd\u5099 \u00b7 \u6599\u7406 \u00b7 BOSS \u00b7 \u96b1\u85cf\u8981\u7d20 \u2014 \u52a9\u4f60\u6210\u70ba\u771f\u6b63\u7684\u52c7\u8005","cta_primary":"\u958b\u59cb\u5192\u96aa","cta_secondary":"\u6aa2\u8996\u5730\u5716","stat_shrines":"\u795e\u5edf","stat_quests":"\u4e3b\u7dda\u4efb\u52d9","stat_koroks":"\u514b\u6d1b\u683c","stat_beasts":"\u795e\u7378"},"quick":{"beginner":"\u65b0\u624b\u5165\u9580","beginner_desc":"\u521d\u59cb\u81fa\u5730\u5168\u6559\u5b78 \u00b7 \u57fa\u790e\u64cd\u4f5c \u00b7 \u56db\u5ea7\u795e\u5edf","main":"\u4e3b\u7dda\u653b\u7565","main_desc":"\u89e3\u653e\u56db\u795e\u7378 \u00b7 \u8a0e\u4f10\u707d\u5384\u84cb\u50ad \u00b7 \u56de\u61b6\u4e4b\u65c5","shrines":"\u795e\u5edf\u653b\u7565","shrines_desc":"120\u5ea7\u795e\u5edf\u5b8c\u6574\u89e3\u6cd5 \u00b7 \u4f4d\u7f6e\u5730\u5716 \u00b7 \u5bf6\u7bb1\u6536\u96c6","equipment":"\u88dd\u5099\u5716\u9451","equipment_desc":"\u6b66\u5668 \u00b7 \u76fe\u724c \u00b7 \u5f13\u7bad \u00b7 \u9632\u5177\u5957\u88dd\u5168\u6536\u96c6","bosses":"BOSS\u6307\u5357","bosses_desc":"\u795e\u7378BOSS \u00b7 \u4eba\u99ac\u840a\u5c3c\u723e \u00b7 \u5b88\u8b77\u8005\u653b\u7565","korok":"\u514b\u6d1b\u683c\u6536\u96c6","korok_desc":"900\u500b\u514b\u6d1b\u683c\u7a2e\u5b50 \u00b7 \u8b0e\u984c\u985e\u578b \u00b7 \u535a\u5eab\u6797","cooking":"\u6599\u7406\u5927\u5168","cooking_desc":"50+\u914d\u65b9 \u00b7 \u5c6c\u6027\u85a5\u5291 \u00b7 \u63a1\u96c6\u5730\u9ede","locations":"\u91cd\u8981\u5730\u9ede","locations_desc":"\u5e0c\u5361\u5854 \u00b7 \u9a5b\u7ad9 \u00b7 \u7cbe\u9748\u4e4b\u6cc9 \u00b7 \u99ac\u795e","secrets":"\u96b1\u85cf\u8981\u7d20","secrets_desc":"\u9f8d\u4e4b\u6240\u5728 \u00b7 \u6d77\u5229\u4e9e\u76fe \u00b7 \u5f69\u86cb\u5168\u516c\u958b"},"section":{"popular":"\u71b1\u9580\u653b\u7565","regions":"\u5340\u57df\u653b\u7565","beginner":"\u65b0\u624b\u6559\u5b78"},"footer":{"guides":"\u653b\u7565\u5206\u985e","main_quest":"\u4e3b\u7dda\u4efb\u52d9","shrines_quest":"\u795e\u5edf\u653b\u7565","bosses_quest":"BOSS\u6307\u5357","secrets_quest":"\u96b1\u85cf\u8981\u7d20","equipment":"\u88dd\u5099\u7cfb\u7d71","weapons":"\u6b66\u5668\u5716\u9451","shields":"\u76fe\u724c\u5716\u9451","armor":"\u9632\u5177\u5957\u88dd","cooking_footer":"\u6599\u7406\u914d\u65b9","about_site":"\u95dc\u65bc\u672c\u7ad9","about_us":"\u95dc\u65bc\u6211\u5011","contribute":"\u8ca2\u737b\u653b\u7565","github":"GitHub","feedback":"\u610f\u898b\u56de\u994b","copyright":"\u00a9 2026 \u8352\u91ce\u4e4b\u606f\u653b\u7565\u7ad9 \u00b7 \u904a\u6232\u7248\u6b0a\u6b78\u4efb\u5929\u5802\u6240\u6709 \u00b7 \u672c\u7ad9\u70ba\u73a9\u5bb6\u81ea\u767c\u653b\u7565\u5206\u4eab"},"common":{"back_to_top":"\u8fd4\u56de\u9802\u90e8","hot":"\ud83d\udd25 \u71b1\u9580","recommended":"\ud83d\udccc \u63a8\u85a6","new":"\ud83c\udd95 \u65b0\u589e","read_time":"\u5206\u9418"}},
    "ja": {"meta":{"title":"Zelda no Densetsu: Breath of the Wild | Hyrule Bouken Guide","description":"Zelda BOTW kanzen kouryaku - shirine no basho, main quest, boss senjutsu, soubi shuushuu, ryouri recipe"},"nav":{"home":"\u30db\u30fc\u30e0","beginner":"\u521d\u5fc3\u8005","main":"\u30e1\u30a4\u30f3","shrines":"\u7960","equipment":"\u88c5\u5099","bosses":"\u30dc\u30b9","more":"\u3082\u3063\u3068 \u25be","more_korok":"\u30b3\u30ed\u30b0\u306e\u30df","more_cooking":"\u6599\u7406","more_secrets":"\u79d8\u5bc6","more_regions":"\u5730\u57df","more_locations":"\u5834\u6240"},"search":"\u691c\u7d22...","hero":{"title":"\u30cf\u30a4\u30e9\u30eb\u5192\u967a\u30ac\u30a4\u30c9","subtitle":"\u300e\u30bc\u30eb\u30c0\u306e\u4f1d\u8aac \u30d6\u30ec\u30b9 \u30aa\u30d6 \u30b6 \u30ef\u30a4\u30eb\u30c9\u300f\u6700\u5f37\u306e\u653b\u7565\u30b5\u30a4\u30c8","desc":"\u7960 \u00b7 \u30e1\u30a4\u30f3\u30af\u30a8\u30b9\u30c8 \u00b7 \u88c5\u5099 \u00b7 \u6599\u7406 \u00b7 \u30dc\u30b9 \u00b7 \u79d8\u5bc6 \u2014 \u771f\u306e\u52c7\u8005\u306b\u306a\u308d\u3046","cta_primary":"\u5192\u967a\u3092\u59cb\u3081\u308b","cta_secondary":"\u30de\u30c3\u30d7\u3092\u898b\u308b","stat_shrines":"\u7960","stat_quests":"\u30e1\u30a4\u30f3\u30af\u30a8\u30b9\u30c8","stat_koroks":"\u30b3\u30ed\u30b0","stat_beasts":"\u795e\u7363"},"quick":{"beginner":"\u521d\u5fc3\u8005\u30ac\u30a4\u30c9","beginner_desc":"\u59cb\u307e\u308a\u306e\u53f0\u5730\u30c1\u30e5\u30fc\u30c8\u30ea\u30a2\u30eb\u3001\u57fa\u672c\u64cd\u4f5c\u3001\u6700\u521d\u306e\u7960","main":"\u30e1\u30a4\u30f3\u30af\u30a8\u30b9\u30c8","main_desc":"\u56db\u3064\u306e\u795e\u7363\u3092\u89e3\u653e\u3001\u5384\u707d\u30ac\u30ce\u30f3\u3092\u5012\u3059\u3001\u601d\u3044\u51fa\u306e\u65c5","shrines":"\u7960\u653b\u7565","shrines_desc":"120\u306e\u7960\u306e\u5b8c\u5168\u89e3\u6cd5\u3001\u4f4d\u7f6e\u30de\u30c3\u30d7\u3001\u5b9d\u7bb1\u53ce\u96c6","equipment":"\u88c5\u5099\u56f3\u9451","equipment_desc":"\u6b66\u5668\u3001\u76fe\u3001\u5f13\u3001\u9632\u5177\u30bb\u30c3\u30c8\u5b8c\u5168\u53ce\u96c6","bosses":"\u30dc\u30b9\u30ac\u30a4\u30c9","bosses_desc":"\u795e\u7363\u30dc\u30b9\u3001\u30e9\u30a4\u30cd\u30eb\u3001\u30ac\u30fc\u30c7\u30a3\u30a2\u30f3\u5bfe\u7b56","korok":"\u30b3\u30ed\u30b0\u53ce\u96c6","korok_desc":"900\u500b\u306e\u30b3\u30ed\u30b0\u306e\u30df\u3001\u30d1\u30ba\u30eb\u30bf\u30a4\u30d7\u3001\u30dc\u30c3\u30af\u30ea\u30f3","cooking":"\u6599\u7406\u30ec\u30b7\u30d4","cooking_desc":"50\u4ee5\u4e0a\u306e\u30ec\u30b7\u30d4\u3001\u85ac\u3001\u7d20\u6750\u306e\u5834\u6240","locations":"\u91cd\u8981\u5834\u6240","locations_desc":"\u30b7\u30fc\u30ab\u30fc\u5854\u3001\u99d0\u5c6f\u6240\u3001\u5927\u7cbe\u970a\u306e\u6cc9\u3001\u99ac\u795e","secrets":"\u79d8\u5bc6\u8981\u7d20","secrets_desc":"\u30c9\u30e9\u30b4\u30f3\u306e\u5834\u6240\u3001\u30cf\u30a4\u30ea\u30a2\u306e\u76fe\u3001\u96a0\u3057\u30a4\u30d9\u30f3\u30c8"},"section":{"popular":"\u4eba\u6c17\u653b\u7565","regions":"\u5730\u57df\u653b\u7565","beginner":"\u521d\u5fc3\u8005\u30ac\u30a4\u30c9"},"footer":{"guides":"\u653b\u7565\u30ab\u30c6\u30b4\u30ea","main_quest":"\u30e1\u30a4\u30f3\u30af\u30a8\u30b9\u30c8","shrines_quest":"\u7960\u653b\u7565","bosses_quest":"\u30dc\u30b9\u30ac\u30a4\u30c9","secrets_quest":"\u79d8\u5bc6","equipment":"\u88c5\u5099","weapons":"\u6b66\u5668\u56f3\u9451","shields":"\u76fe\u56f3\u9451","armor":"\u9632\u5177","cooking_footer":"\u6599\u7406","about_site":"\u3053\u306e\u30b5\u30a4\u30c8\u306b\u3064\u3044\u3066","about_us":"\u79c1\u305f\u3061\u306b\u3064\u3044\u3066","contribute":"\u653b\u7565\u3092\u6295\u7a3f","github":"GitHub","feedback":"\u30d5\u30a3\u30fc\u30c9\u30d0\u30c3\u30af","copyright":"\u00a9 2026 BOTW\u653b\u7565\u30b5\u30a4\u30c8 \u00b7 \u30b2\u30fc\u30e0\u306e\u8457\u4f5c\u6a29\u306f\u4efb\u5929\u5802\u306b\u5e30\u5c5e"},"common":{"back_to_top":"\u30c8\u30c3\u30d7\u306b\u623b\u308b","hot":"\ud83d\udd25 \u4eba\u6c17","recommended":"\ud83d\udccc \u304a\u3059\u3059\u3081","new":"\ud83c\udd95 \u65b0\u7740","read_time":"\u5206"}},
    "de": {"meta":{"title":"Zelda: Breath of the Wild Guide | Hyrule Abenteuerf\u00fchrer","description":"Der umfassendste BOTW-Guide - Schreine, Hauptquests, Boss-Strategien, Ausr\u00fcstung, Kochrezepte"},"nav":{"home":"Start","beginner":"Anf\u00e4nger","main":"Hauptquest","shrines":"Schreine","equipment":"Ausr\u00fcstung","bosses":"Bosse","more":"Mehr \u25be","more_korok":"Krogs-Samen","more_cooking":"Kochen","more_secrets":"Geheimnisse","more_regions":"Regionen","more_locations":"Orte"},"search":"Guide durchsuchen...","hero":{"title":"Hyrule Abenteuerf\u00fchrer","subtitle":"Der umfassendste Breath of the Wild Guide","desc":"Schreine, Hauptquests, Ausr\u00fcstung, Kochen, Bosse, Geheimnisse \u2014 werde ein wahrer Held","cta_primary":"Abenteuer beginnen","cta_secondary":"Karte ansehen","stat_shrines":"Schreine","stat_quests":"Hauptquests","stat_koroks":"Krogs","stat_beasts":"Titanen"},"quick":{"beginner":"Anf\u00e4nger-Guide","beginner_desc":"Gro\u00dfes Plateau Tutorial, Grundsteuerung, erste Schreine","main":"Hauptquest","main_desc":"Vier Titanen befreien, Ganon besiegen, Erinnerungen","shrines":"Schrein-Guide","shrines_desc":"Komplettl\u00f6sungen f\u00fcr 120 Schreine, Karte, Schatztruhen","equipment":"Ausr\u00fcstung","equipment_desc":"Waffen, Schilde, B\u00f6gen, R\u00fcstungssets","bosses":"Boss-Guide","bosses_desc":"Titanen-Bosse, Leunen, W\u00e4chter-Taktiken","korok":"Krogs-Samen","korok_desc":"Alle 900 Krogs-Samen, R\u00e4tseltypen, Maronus","cooking":"Kochen","cooking_desc":"50+ Rezepte, Elixiere, Zutaten-Fundorte","locations":"Orte","locations_desc":"Sheikah-T\u00fcrme, Stallungen, Feenquellen, Pferdegott","secrets":"Geheimnisse","secrets_desc":"Drachen, Hylia-Schild, Easter Eggs enth\u00fcllt"},"section":{"popular":"Beliebte Guides","regions":"Regionen-Guides","beginner":"Anf\u00e4nger-Tipps"},"footer":{"guides":"Kategorien","main_quest":"Hauptquest","shrines_quest":"Schreine","bosses_quest":"Bosse","secrets_quest":"Geheimnisse","equipment":"Ausr\u00fcstung","weapons":"Waffen","shields":"Schilde","armor":"R\u00fcstung","cooking_footer":"Kochen","about_site":"\u00dcber uns","about_us":"\u00dcber uns","contribute":"Mitwirken","github":"GitHub","feedback":"Feedback","copyright":"\u00a9 2026 BOTW Guide \u00b7 Nintendo \u00b7 Fan-Guide"},"common":{"back_to_top":"Nach oben","hot":"\ud83d\udd25 Beliebt","recommended":"\ud83d\udccc Empfohlen","new":"\ud83c\udd95 Neu","read_time":"Min"}}
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

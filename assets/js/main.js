/* 六视科技 · 火山引擎产品介绍站 交互脚本 */
(function () {
  'use strict';

  /* ---------- 导航：滚动变白 + 移动菜单 ---------- */
  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');

  function onScroll() {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // 点击菜单项后收起
    document.querySelectorAll('.nav-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        header.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- 滚动淡入 ---------- */
  var revealTargets = document.querySelectorAll(
    '.sec-head, .about-card, .group-head, .pcard, .why-card, .flow-wrap, .spotlight-copy, .spotlight-visual, .cta-inner, .stat'
  );
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 数据以 HTML 中的真实值为准，不做滚动动画 ---------- */

  /* ---------- 复制邀请链接 ---------- */
  var copyBtn = document.getElementById('copyBtn');
  var inviteLink = document.getElementById('inviteLink');
  if (copyBtn && inviteLink) {
    copyBtn.addEventListener('click', function () {
      var text = inviteLink.textContent.trim();
      function done() {
        copyBtn.textContent = '已复制';
        copyBtn.classList.add('done');
        setTimeout(function () {
          copyBtn.textContent = '复制';
          copyBtn.classList.remove('done');
        }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }
})();

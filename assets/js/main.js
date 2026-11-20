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

// 固定悬浮快捷按钮组：分享 / 返回顶部 / 客服帮助。纯前端，不发送数据。
(()=>{
 const dock=document.getElementById('fdDock');
 const shareBtn=document.getElementById('fdShare');
 const topBtn=document.getElementById('fdTop');
 const sheet=document.getElementById('fdSheet');
 const systemOpt=document.getElementById('fdShareSystem');
 if(!dock||!shareBtn||!topBtn||!sheet)return;
 let toastTimer;
 function notify(message){
   const box=document.getElementById('fdToast');
   if(!box)return;
   box.textContent=message;box.hidden=false;clearTimeout(toastTimer);
   toastTimer=setTimeout(()=>{box.hidden=true;},3600);
 }
 function copyText(text){
   if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
   return new Promise((resolve,reject)=>{
     const t=document.createElement('textarea');t.value=text;t.setAttribute('readonly','');
     t.style.cssText='position:fixed;top:-9999px;left:-9999px';document.body.append(t);t.select();
     let ok=false;try{ok=document.execCommand('copy');}catch(_){}
     t.remove();ok?resolve():reject();
   });
 }
 function openSheet(){sheet.hidden=false;shareBtn.setAttribute('aria-expanded','true');const first=sheet.querySelector('.fd-opt:not([hidden])');if(first)first.focus();}
 function closeSheet(returnFocus){if(sheet.hidden)return;sheet.hidden=true;shareBtn.setAttribute('aria-expanded','false');if(returnFocus)shareBtn.focus();}
 shareBtn.addEventListener('click',()=>{sheet.hidden?openSheet():closeSheet(true);});
 document.addEventListener('click',e=>{if(!dock.contains(e.target))closeSheet(false);});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden){e.preventDefault();closeSheet(true);}});
 sheet.addEventListener('keydown',e=>{
   if(e.key!=='Tab')return;
   const opts=Array.from(sheet.querySelectorAll('.fd-opt:not([hidden])'));
   if(!opts.length)return;
   const first=opts[0],last=opts[opts.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
 const canShare=typeof navigator.share==='function';
 if(canShare&&systemOpt)systemOpt.hidden=false;
 const pageUrl=()=>location.href.split('#')[0];
 async function handleShare(kind){
   const url=pageUrl();closeSheet(true);
   if(kind==='copy'){
     try{await copyText(url);notify('页面链接已复制。粘贴前请再检查是否包含敏感信息。');}
     catch(_){notify('自动复制未成功，请从地址栏手动复制页面链接。');}
   }else if(kind==='wechat'){
     const inWechat=/MicroMessenger/i.test(navigator.userAgent);
     try{await copyText(url);notify(inWechat
       ?'链接已复制。点右上角「···」→「发送给朋友」即可分享给微信好友。'
       :'链接已复制。打开微信，粘贴给好友或分享到朋友圈即可。');}
     catch(_){notify(inWechat
       ?'请点右上角「···」→「发送给朋友」分享本页。'
       :'请从地址栏复制页面链接，再粘贴到微信发送给好友。');}
   }else if(kind==='system'&&canShare){
     try{await navigator.share({title:document.title,url});}
     catch(err){if(err&&err.name!=='AbortError')notify('系统分享未成功，可改用复制链接。');}
   }
 }
 sheet.querySelectorAll('.fd-opt').forEach(btn=>btn.addEventListener('click',()=>handleShare(btn.dataset.share)));
 topBtn.addEventListener('click',()=>{
   const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   try{window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});}catch(_){window.scrollTo(0,0);}
 });
})();

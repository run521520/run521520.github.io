/* ===================================
   交互效果脚本
   Interactive Effects Script
   =================================== */

// 页面加载动画
function initLoadingAnimation() {
  // 创建加载动画元素
  const loading = document.createElement('div');
  loading.className = 'page-loading';
  loading.innerHTML = `
    <div class="loading-spinner" style="width:60px;height:60px;border:3px solid rgba(0,210,255,0.2);border-top:3px solid #00d2ff;border-radius:50%;animation:spin 1s linear infinite;"></div>
    <div class="loading-text">加载中...</div>
    <div class="loading-bar"></div>
  `;
  document.body.appendChild(loading);
  
  // 页面加载完成后隐藏
  window.addEventListener('load', () => {
    setTimeout(() => {
      loading.classList.add('hidden');
      setTimeout(() => loading.remove(), 800);
    }, 500);
  });
}

// 鼠标跟随光标效果
function initCursorFollower() {
  // 只在桌面端启用
  if (window.innerWidth < 768) return;
  
  const cursor = document.createElement('div');
  cursor.className = 'cursor-follower';
  document.body.appendChild(cursor);
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // 平滑跟随
  function animate() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    cursor.style.left = cursorX - 10 + 'px';
    cursor.style.top = cursorY - 10 + 'px';
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // 悬停交互元素时放大
  const interactiveElements = document.querySelectorAll('a, button, .post-card, .board');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.background = 'radial-gradient(circle, rgba(0,210,255,0.4), transparent)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.background = 'radial-gradient(circle, rgba(0,210,255,0.8), transparent)';
    });
  });
}

// 阅读进度条
function initReadingProgress() {
  // 只在文章页面显示
  if (!document.querySelector('.post-content')) return;
  
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.appendChild(progressBar);
  
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / docHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

// 滚动渐入动画
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  // 观察所有卡片和文章元素
  const elements = document.querySelectorAll('.post-card, .board, .post-preview, .fade-in-up');
  elements.forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });
}

// 平滑滚动
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// 代码块复制增强
function initCodeCopyEnhance() {
  document.querySelectorAll('.highlight').forEach(block => {
    const copyBtn = block.querySelector('.copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        // 复制成功后添加视觉反馈
        copyBtn.textContent = '已复制!';
        copyBtn.style.background = 'linear-gradient(90deg, #00ff88, #00d2ff)';
        
        setTimeout(() => {
          copyBtn.textContent = '复制';
          copyBtn.style.background = '';
        }, 2000);
      });
    }
  });
}

// 图片懒加载增强
function initImageLazyLoad() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// 返回顶部按钮
function initBackToTop() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.className = 'back-to-top';
  btn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d2ff, #3a7bd5);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 20px;
    display: none;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 210, 255, 0.4);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(btn);
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.style.display = 'block';
    } else {
      btn.style.display = 'none';
    }
  });
  
  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  btn.addEventListener('mouseenter', () => {
    btn.style.transform = 'scale(1.1)';
    btn.style.boxShadow = '0 6px 30px rgba(0, 210, 255, 0.6)';
  });
  
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'scale(1)';
    btn.style.boxShadow = '0 4px 20px rgba(0, 210, 255, 0.4)';
  });
}

// 键盘快捷键
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl + Enter: 切换暗色模式
    if (e.ctrlKey && e.key === 'Enter') {
      const theme = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
    
    // Escape: 返回顶部
    if (e.key === 'Escape') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// 初始化所有效果
document.addEventListener('DOMContentLoaded', () => {
  initLoadingAnimation();
  initCursorFollower();
  initReadingProgress();
  initScrollAnimations();
  initSmoothScroll();
  initCodeCopyEnhance();
  initImageLazyLoad();
  initBackToTop();
  initKeyboardShortcuts();
});

// 导出函数供外部调用
window.BlogEffects = {
  initLoadingAnimation,
  initCursorFollower,
  initReadingProgress,
  initScrollAnimations,
  initSmoothScroll,
  initCodeCopyEnhance,
  initImageLazyLoad,
  initBackToTop,
  initKeyboardShortcuts
};

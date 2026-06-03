/* ===================================
   粒子背景效果
   Particle Background Effect
   =================================== */

// 创建粒子背景容器
function createParticles() {
  const container = document.createElement('div');
  container.id = 'particles-js';
  container.style.cssText = 'position:fixed;width:100%;height:100%;top:0;left:0;z-index:-1;pointer-events:none;';
  document.body.insertBefore(container, document.body.firstChild);
}

// 粒子动画
function initParticles() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('particles-js');
  
  if (!container) return;
  
  container.appendChild(canvas);
  canvas.style.cssText = 'position:absolute;top:0;left:0;';
  
  let particles = [];
  const particleCount = 80;
  const colors = ['#00d2ff', '#3a7bd5', '#00ff88', '#ff6b6b', '#ffd93d'];
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.5 + 0.2
    };
  }
  
  function init() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    });
    
    // 连接相近的粒子
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = p1.color;
          ctx.globalAlpha = 0.1 * (1 - distance / 150);
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animate);
  }
  
  resize();
  init();
  animate();
  
  window.addEventListener('resize', () => {
    resize();
    init();
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 只在暗色模式下显示粒子效果
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                 document.body.classList.contains('dark-mode') ||
                 window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (isDark) {
    createParticles();
    initParticles();
  }
});

// 监听主题切换
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'data-theme') {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const particles = document.getElementById('particles-js');
      
      if (isDark && !particles) {
        createParticles();
        initParticles();
      } else if (!isDark && particles) {
        particles.remove();
      }
    }
  });
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});

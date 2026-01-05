// ===== 1) 注入字体（Google Fonts）=====
(function injectFonts() {
    const links = [
        'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&family=Noto+Sans+SC:wght@400;700&family=Noto+Sans+JP:wght@400;700&display=swap'
    ];
    links.forEach(href => {
        const el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = href;
        document.head.appendChild(el);
    });
})();

// ===== 2) 粒子背景（可选）=====
(function particlesBg() {
    const enable = false;
    if (!enable) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-nest.js@2.0.4/dist/canvas-nest.js';
    script.onload = () => {
        // eslint-disable-next-line no-undef
        new CanvasNest(document.body, {
            color: '255,95,162',
            pointColor: '255,139,209',
            opacity: 0.6,
            count: 90,
            zIndex: -1
        });
    };
    document.body.appendChild(script);
})();

// ===== 3) 背景图轮播（间隔自动更换）=====
(function rotatingBackground() {
    const enable = true;
    if (!enable) return;

    const images = ["/img/R1.jpg", "/img/R2.jpg", "/img/R3.jpg", "/img/R4.jpg", "/img/R5.jpeg"];
    const intervalMs = 150000;
    const fadeMs = 1000;

    let el = document.getElementById("acg-bg-rotator");
    if (!el) {
        el = document.createElement("div");
        el.id = "acg-bg-rotator";
        document.body.prepend(el);
    }

    images.forEach((src) => { const img = new Image(); img.src = src; });

    let idx = 0;
    const apply = (i) => {
        el.style.opacity = "0";
        setTimeout(() => {
            el.style.backgroundImage = `url("${images[i]}")`;
            el.style.opacity = "1";
        }, fadeMs);
    };

    el.style.backgroundImage = `url("${images[idx]}")`;
    setInterval(() => {
        idx = (idx + 1) % images.length;
        apply(idx);
    }, intervalMs);
})();

// ===== 4) Live2D（全 CDN + 自动降级）=====
// 说明：
// - 用 npmmirror（registry.npmmirror.com）替代 jsDelivr，解决你那边 404/不稳定
// - 只保留一个入口，避免重复 init
(function live2dCDN() {
    const enable = true;
    if (!enable) return;

    // 预留容器
    const id = 'live2d-widget';
    if (!document.getElementById(id)) {
        const div = document.createElement('div');
        div.id = id;
        document.body.appendChild(div);
    }

    // 避免重复加载/重复初始化
    if (window.L2Dwidget) return;

    // 1) 加载 Live2Dwidget 脚本（npmmirror）
    const s = document.createElement("script");
    s.src = "https://registry.npmmirror.com/live2d-widget/3.1.4/files/lib/L2Dwidget.min.js";

    // 2) 候选猫娘/少女模型（npmmirror）
    const modelJsonCandidates = [
    "https://ghproxy.com/https://raw.githubusercontent.com/xiazeyu/live2d-widget-models/231c840a120e28ad74e7341f784dd08248caf059/packages/live2d-widget-model-haru/01/assets/haru01.model.json"
    ];

    const initWith = (jsonPath) => {
        window.L2Dwidget.init({
            model: { jsonPath },
            display: {
                position: "right",
                width: 170,
                height: 320,
                hOffset: 25,
                vOffset: -10
            },
            mobile: { show: false },
            react: { opacityDefault: 0.9, opacityOnHover: 1 }
        });
        console.log("[live2d] init model:", jsonPath);
    };

    const tryNext = () => {
        const jsonPath = modelJsonCandidates.shift();
        if (!jsonPath) {
            console.error("[live2d] all CDN models failed.");
            return;
        }

        // 清理旧 canvas（某些失败重试会残留）
        const old = document.querySelector("#live2dcanvas, canvas[id*='live2d']");
        if (old) old.remove();

        initWith(jsonPath);

        // 2.5s 后如果 canvas 还是不存在/没出来，换下一个
        setTimeout(() => {
            const canvas = document.querySelector("#live2dcanvas, canvas[id*='live2d']");
            if (!canvas) {
                console.warn("[live2d] canvas not found, retry next model...");
                tryNext();
            }
        }, 2500);
    };

    s.onload = () => {
        tryNext();
    };

    s.onerror = () => {
        console.error("[live2d] failed to load L2Dwidget.min.js from npmmirror");
    };

    document.body.appendChild(s);
})();


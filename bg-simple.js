/**
 * Corner glows, drifting color, wave lines, soft dots.
 * syncSize() runs immediately so the canvas matches layout before the first paint.
 */
(function () {
  var canvas = document.getElementById('bg-canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  var glowCanvas = document.createElement('canvas');
  var glowCtx = glowCanvas.getContext('2d');

  function buildGlow() {
    var W = glowCanvas.width;
    var H = glowCanvas.height;
    if (!W || !H) return;
    glowCtx.clearRect(0, 0, W, H);
    glowCtx.globalCompositeOperation = 'source-over';

    var g1 = glowCtx.createRadialGradient(W * 0.82, H * 0.06, 0, W * 0.82, H * 0.06, W * 0.36);
    g1.addColorStop(0, 'rgba(244,114,182,0.15)');
    g1.addColorStop(0.45, 'rgba(192,132,252,0.055)');
    g1.addColorStop(1, 'transparent');
    glowCtx.fillStyle = g1;
    glowCtx.fillRect(0, 0, W, H);

    var g2 = glowCtx.createRadialGradient(W * 0.1, H * 0.9, 0, W * 0.1, H * 0.9, W * 0.34);
    g2.addColorStop(0, 'rgba(167,139,250,0.13)');
    g2.addColorStop(0.5, 'rgba(99,102,241,0.042)');
    g2.addColorStop(1, 'transparent');
    glowCtx.fillStyle = g2;
    glowCtx.fillRect(0, 0, W, H);
  }

  function drawAnimatedGlow(c, W, H, t) {
    if (!W || !H) return;
    c.save();
    c.globalCompositeOperation = 'screen';
    var r1 = Math.min(W, H) * 0.38;
    var r2 = Math.min(W, H) * 0.34;

    var ax = W * (0.78 + Math.sin(t * 0.12) * 0.06);
    var ay = H * (0.09 + Math.cos(t * 0.1) * 0.04);
    var g1 = c.createRadialGradient(ax, ay, 0, ax, ay, r1);
    g1.addColorStop(0, 'rgba(253,164,203,0.16)');
    g1.addColorStop(0.4, 'rgba(196,181,253,0.065)');
    g1.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g1;
    c.fillRect(0, 0, W, H);

    var bx = W * (0.14 + Math.cos(t * 0.1) * 0.05);
    var by = H * (0.88 + Math.sin(t * 0.09) * 0.04);
    var g2 = c.createRadialGradient(bx, by, 0, bx, by, r2);
    g2.addColorStop(0, 'rgba(192,132,252,0.15)');
    g2.addColorStop(0.45, 'rgba(129,140,248,0.055)');
    g2.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g2;
    c.fillRect(0, 0, W, H);

    c.restore();
  }

  var lineData = [
    { offset: 0, speed: 0.5, amp: 58, yBase: 0.12, hue: 320, alpha: 0.078 },
    { offset: 1.05, speed: 0.35, amp: 72, yBase: 0.3, hue: 328, alpha: 0.072 },
    { offset: 2.1, speed: 0.58, amp: 48, yBase: 0.52, hue: 285, alpha: 0.064 },
    { offset: 3.14, speed: 0.4, amp: 62, yBase: 0.74, hue: 312, alpha: 0.076 },
    { offset: 4.2, speed: 0.28, amp: 44, yBase: 0.9, hue: 302, alpha: 0.068 }
  ];

  var particles = [];

  function seedParticles(W, H) {
    particles.length = 0;
    for (var i = 0; i < 48; i++) {
      var hr = Math.random();
      var hue = hr < 0.55 ? 330 : hr < 0.72 ? 275 : 220;
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.35 + 0.35,
        vx: (Math.random() - 0.5) * 0.19,
        vy: (Math.random() - 0.5) * 0.19,
        opacity: Math.random() * 0.4 + 0.22,
        hue: hue,
        pulseOffset: Math.random() * Math.PI * 2,
        pulseSpeed: 0.006 + Math.random() * 0.01
      });
    }
  }

  function syncSize() {
    var r = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(r.width));
    var h = Math.max(1, Math.round(r.height));
    if ((w <= 1 && h <= 1) || r.width < 10 || r.height < 10) {
      w = Math.max(320, window.innerWidth || 800);
      h = Math.max(240, window.innerHeight || 600);
    }
    canvas.width = glowCanvas.width = w;
    canvas.height = glowCanvas.height = h;
    buildGlow();
    seedParticles(w, h);
  }

  syncSize();
  window.addEventListener('resize', function () {
    requestAnimationFrame(syncSize);
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', function () {
      requestAnimationFrame(syncSize);
    });
    window.visualViewport.addEventListener('scroll', function () {
      requestAnimationFrame(syncSize);
    });
  }

  var lastF = 0;
  var elapsed = 0;

  function draw(ts) {
    requestAnimationFrame(draw);
    var dt = ts - lastF;
    if (dt < 32) return;
    lastF = ts;
    elapsed += dt * 0.001;

    var W = canvas.width;
    var H = canvas.height;
    if (!W || !H) return;

    ctx.fillStyle = '#07070f';
    ctx.fillRect(0, 0, W, H);

    if (glowCanvas.width > 0 && glowCanvas.height > 0) {
      ctx.drawImage(glowCanvas, 0, 0);
    }
    drawAnimatedGlow(ctx, W, H, elapsed);

    for (var li = 0; li < lineData.length; li++) {
      var l = lineData[li];
      ctx.beginPath();
      var yb = H * l.yBase;
      for (var x = 0; x <= W; x += 6) {
        var y =
          yb +
          Math.sin(x * 0.006 + elapsed * l.speed + l.offset) * l.amp +
          Math.sin(x * 0.012 + elapsed * l.speed * 1.6 + l.offset * 0.7) * (l.amp * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'hsla(' + l.hue + ',85%,72%,' + l.alpha + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    for (var pi = 0; pi < particles.length; pi++) {
      var p = particles[pi];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -8) p.x = W + 8;
      if (p.x > W + 8) p.x = -8;
      if (p.y < -8) p.y = H + 8;
      if (p.y > H + 8) p.y = -8;
      var pulse = Math.sin(elapsed * p.pulseSpeed * 5 + p.pulseOffset) * 0.3 + 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ',88%,82%,' + p.opacity * pulse * 3.65 + ')';
      ctx.fill();
    }
  }

  requestAnimationFrame(draw);
})();

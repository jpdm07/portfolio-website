(function() {
  // GLOW CANVAS
  var glowCanvas = document.createElement('canvas');
  var glowCtx = glowCanvas.getContext('2d');

  function buildGlow() {
    var W = glowCanvas.width, H = glowCanvas.height;
    if (!W || !H) return;
    glowCtx.clearRect(0,0,W,H);
    var g1 = glowCtx.createRadialGradient(W*.82,H*.06,0,W*.82,H*.06,W*.5);
    g1.addColorStop(0,'rgba(244,114,182,0.18)');
    g1.addColorStop(1,'transparent');
    glowCtx.fillStyle=g1; glowCtx.fillRect(0,0,W,H);
    var g2 = glowCtx.createRadialGradient(W*.08,H*.9,0,W*.08,H*.9,W*.42);
    g2.addColorStop(0,'rgba(168,85,247,0.14)');
    g2.addColorStop(1,'transparent');
    glowCtx.fillStyle=g2; glowCtx.fillRect(0,0,W,H);
  }

  // MAIN CANVAS
  var canvas = document.getElementById('bg-canvas');
  var ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = glowCanvas.width = window.innerWidth;
    canvas.height = glowCanvas.height = window.innerHeight;
    buildGlow();
  }
  resize();
  window.addEventListener('resize', resize);

  // PARTICLES
  var particles = [];
  for (var i=0; i<45; i++) {
    var h = Math.random()<.55?330:Math.random()<.6?270:220;
    particles.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      r: Math.random()*1.4+.35,
      vx: (Math.random()-.5)*.18,
      vy: (Math.random()-.5)*.18,
      opacity: Math.random()*.55+.22,
      hue: h,
      pulseOffset: Math.random()*Math.PI*2,
      pulseSpeed: .006+Math.random()*.01
    });
  }

  // AURORA LINES
  var lines = [
    {o:0,    s:.5,  a:55, y:.12, h:315, al:.07},
    {o:1.05, s:.35, a:75, y:.30, h:325, al:.06},
    {o:2.10, s:.6,  a:50, y:.52, h:280, al:.05},
    {o:3.14, s:.4,  a:65, y:.74, h:340, al:.065},
    {o:4.20, s:.28, a:45, y:.90, h:310, al:.05}
  ];

  // DRAW LOOP
  var lastF=0, elapsed=0;
  function draw(ts) {
    requestAnimationFrame(draw);
    var dt = ts-lastF; if(dt<33) return;
    lastF=ts; elapsed+=dt*.001;
    var W=canvas.width, H=canvas.height;
    ctx.fillStyle='#07070f'; ctx.fillRect(0,0,W,H);
    for (var li=0; li<lines.length; li++) {
      var l=lines[li];
      ctx.beginPath();
      var yb=H*l.y;
      for (var x=0; x<=W; x+=6) {
        var y=yb+Math.sin(x*.006+elapsed*l.s+l.o)*l.a
               +Math.sin(x*.012+elapsed*l.s*1.6+l.o*.7)*(l.a*.4);
        if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
      }
      ctx.strokeStyle='hsla('+l.h+',85%,72%,'+l.al+')';
      ctx.lineWidth=1.5; ctx.stroke();
    }
    for (var pi=0; pi<particles.length; pi++) {
      var p=particles[pi];
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<-5)p.x=W+5; if(p.x>W+5)p.x=-5;
      if(p.y<-5)p.y=H+5; if(p.y>H+5)p.y=-5;
      var pulse=Math.sin(elapsed*p.pulseSpeed*5+p.pulseOffset)*.3+.7;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r*pulse,0,Math.PI*2);
      ctx.fillStyle='hsla('+p.hue+',90%,85%,'+(p.opacity*pulse*3.2)+')';
      ctx.fill();
    }
    if(glowCanvas.width>0&&glowCanvas.height>0) ctx.drawImage(glowCanvas,0,0);
  }
  requestAnimationFrame(draw);

  // CURSOR
  var cur = document.getElementById('cursor');
  if (cur) {
    cur.style.transform='translate(-20px,-20px)';
    document.addEventListener('mousemove', function(e) {
      cur.style.transform='translate('+(e.clientX-5)+'px,'+(e.clientY-5)+'px)';
    });
    document.querySelectorAll('nav a').forEach(function(el) {
      el.addEventListener('mouseenter', function(){ cur.classList.add('is-nav'); });
      el.addEventListener('mouseleave', function(){ cur.classList.remove('is-nav'); });
    });
    document.querySelectorAll('a:not(nav a)').forEach(function(el) {
      el.addEventListener('mouseenter', function(){ cur.classList.add('is-hovering'); });
      el.addEventListener('mouseleave', function(){ cur.classList.remove('is-hovering'); });
    });
  }

  // NAV SHRINK
  var nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY>60) {
        nav.style.background='rgba(7,7,15,0.96)';
        nav.style.backdropFilter='blur(20px)';
        nav.style.padding='14px 48px';
      } else {
        nav.style.background='';
        nav.style.backdropFilter='';
        nav.style.padding='';
      }
    }, {passive:true});
  }

  // MOBILE NAV
  var toggle = document.querySelector('.nav-mobile-toggle');
  if (toggle) {
    toggle.addEventListener('click', function(){
      document.querySelector('nav').classList.toggle('nav-mobile-open');
    });
    document.querySelectorAll('.nav-links a').forEach(function(a){
      a.addEventListener('click', function(){
        document.querySelector('nav').classList.remove('nav-mobile-open');
      });
    });
  }
})();

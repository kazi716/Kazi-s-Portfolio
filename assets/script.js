(function(){
  var root = document.getElementById('kp-root');
  var content = document.getElementById('kp-content');
  var nav = document.getElementById('kp-nav');
  var buttons = nav.querySelectorAll('button');
  var sections = content.querySelectorAll('.kp-section');
  var progress = document.getElementById('kp-progress');
  var backtop = document.getElementById('kp-backtop');

  // Smooth scroll to section on nav click
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var tab = btn.dataset.tab;
      var target = document.getElementById('tab-' + tab);
      if(target){
        content.scrollTo({ top: target.offsetTop - content.offsetTop, behavior: 'smooth' });
      }
    });
  });

  // Scroll spy: highlight nav based on scroll position
  function updateNav(){
    var scrollTop = content.scrollTop;
    var contentTop = content.offsetTop;
    var activeSet = false;

    sections.forEach(function(sec, i){
      var secTop = sec.offsetTop - contentTop;
      var secBottom = secTop + sec.offsetHeight;
      if(scrollTop >= secTop - 50 && scrollTop < secBottom - 50 && !activeSet){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        buttons[i].classList.add('active');
        activeSet = true;
      }
    });

    // Progress bar
    var scrollHeight = content.scrollHeight - content.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progress.style.width = pct + '%';

    // Back to top
    if(scrollTop > 300){ backtop.classList.add('visible'); }
    else { backtop.classList.remove('visible'); }
  }
  content.addEventListener('scroll', updateNav);

  // Back to top
  backtop.addEventListener('click', function(){
    content.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== CUSTOM CURSOR =====
  var cursor = document.getElementById('kp-cursor');
  var dot = document.getElementById('kp-cursor-dot');
  var mouseX = window.innerWidth/2, mouseY = window.innerHeight/2, cursorX = mouseX, cursorY = mouseY;
  cursor.style.left = cursorX + 'px';
  cursor.style.top = cursorY + 'px';
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
  document.addEventListener('mousemove', function(e){
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });
  function animateCursor(){
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  var interactives = root.querySelectorAll('a, button, .kp-stat, .kp-card, .kp-cert, .kp-skill-tag, .kp-contact a');
  interactives.forEach(function(el){
    el.addEventListener('mouseenter', function(){ cursor.classList.add('hover'); });
    el.addEventListener('mouseleave', function(){ cursor.classList.remove('hover'); });
  });

  // Magnetic stats
  var stats = root.querySelectorAll('.kp-stat');
  stats.forEach(function(stat){
    stat.addEventListener('mousemove', function(e){
      var rect = stat.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      stat.style.transform = 'translateY(-3px) translate(' + x * 0.03 + 'px,' + y * 0.03 + 'px)';
    });
    stat.addEventListener('mouseleave', function(){ stat.style.transform = ''; });
  });

  // ===== PARTICLE SYSTEM (keep from before) =====
  var canvas = document.getElementById('kp-particles');
  var ctx = canvas.getContext('2d');
  var particles = [];
  var PARTICLE_COUNT = 120;
  var CONNECTION_DIST = 100;
  var MAX_CONNECTIONS = 3;
  var MOUSE_RADIUS = 150;

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  var computed = getComputedStyle(document.documentElement);
  var accent = computed.getPropertyValue('--kimi-color-accent').trim() || '#3b82f6';
  var positive = computed.getPropertyValue('--kimi-color-positive').trim() || '#22c55e';
  var chart4 = computed.getPropertyValue('--kimi-chart-4').trim() || '#a855f7';

  function hexToRgb(hex){
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return { r: r, g: g, b: b };
  }

  var colors = [hexToRgb(accent), hexToRgb(positive), hexToRgb(chart4)];

  function createParticle(){
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.5 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.4 + 0.1,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01
    };
  }

  for(var i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

  function drawParticles(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function(p){
      p.x += p.vx; p.y += p.vy;
      p.pulse += p.pulseSpeed;
      if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if(p.y < 0 || p.y > canvas.height) p.vy *= -1;

      var dx = p.x - mouseX;
      var dy = p.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if(dist < MOUSE_RADIUS && dist > 0){
        var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        p.vx += (dx / dist) * force * 0.3;
        p.vy += (dy / dist) * force * 0.3;
      }
      p.vx *= 0.99; p.vy *= 0.99;

      var pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + Math.max(0, pulseAlpha) + ')';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
      grad.addColorStop(0, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + pulseAlpha * 0.3 + ')');
      grad.addColorStop(1, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',0)');
      ctx.fillStyle = grad;
      ctx.fill();
    });

    for(var i = 0; i < particles.length; i++){
      var connections = 0;
      for(var j = i + 1; j < particles.length; j++){
        if(connections >= MAX_CONNECTIONS) break;
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < CONNECTION_DIST){
          var alpha = (1 - dist / CONNECTION_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(' + particles[i].color.r + ',' + particles[i].color.g + ',' + particles[i].color.b + ',' + alpha + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
          connections++;
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // ===== PDF RESUME GENERATOR =====
  var pdfBtn = document.getElementById('kp-pdf-btn');
  if(pdfBtn){
    pdfBtn.addEventListener('click', function(){
      var { jsPDF } = window.jspdf;
      var doc = new jsPDF({ unit: 'pt', format: 'a4' });
      var pageW = doc.internal.pageSize.getWidth();
      var margin = 40;
      var y = margin;

      function addText(text, x, yPos, size, weight, align){
        doc.setFontSize(size || 11);
        doc.setFont('helvetica', weight || 'normal');
        if(align === 'center'){
          var tw = doc.getTextWidth(text);
          doc.text(text, pageW/2 - tw/2, yPos);
        } else {
          doc.text(text, x, yPos);
        }
        return yPos + size + 4;
      }

      function addLine(yPos){
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageW - margin, yPos);
        return yPos + 12;
      }

      function addBullet(text, x, yPos, size){
        doc.setFontSize(size || 10);
        doc.setFont('helvetica', 'normal');
        doc.text('\u2022 ' + text, x + 8, yPos);
        return yPos + size + 2;
      }

      // Header
      y = addText('KAZI MD SAMIM FARAJ', margin, y, 22, 'bold');
      y = addText('Cybersecurity & Cloud Engineer', margin, y, 12, 'normal');
      y = addText('Kolkata, West Bengal, India', margin, y, 10, 'normal');
      y = addText('samimkazi716@gmail.com  |  github.com/kazi716  |  linkedin.com/in/kazi-md-samim-faraj', margin, y, 9, 'normal');
      y += 8;
      y = addLine(y);

      // Summary
      y = addText('PROFESSIONAL SUMMARY', margin, y, 13, 'bold');
      y += 4;
      var summary = 'B.Tech CSE student at JIS University with hands-on experience in cybersecurity, cloud computing, and ethical hacking. Multiple AWS and Google Cloud certifications, OPSWAT ICIP, Anthropic AI Fluency, and practical pentesting through TryHackMe and OverTheWire. Active open-source contributor.';
      var sumLines = doc.splitTextToSize(summary, pageW - margin*2);
      doc.setFontSize(10);
      doc.text(sumLines, margin, y);
      y += sumLines.length * 12 + 8;
      y = addLine(y);

      // Education
      y = addText('EDUCATION', margin, y, 13, 'bold');
      y += 4;
      y = addText('B.Tech — Computer Science and Engineering', margin, y, 11, 'bold');
      y = addText('JIS University, Kolkata  |  2026 – Present  |  CGPA: 7.4', margin, y, 10, 'normal');
      y += 4;
      y = addText('Class XII — Higher Secondary  |  Shishu Sadan High School  |  72%', margin, y, 10, 'normal');
      y += 4;
      y = addText('Class X — Secondary  |  Shishu Sadan High School  |  85%', margin, y, 10, 'normal');
      y += 8;
      y = addLine(y);

      // Experience
      y = addText('EXPERIENCE', margin, y, 13, 'bold');
      y += 4;
      y = addText('AWS AI-Powered Cloud Engineer Intern', margin, y, 11, 'bold');
      y = addText('AICTE-EduSkills (Virtual)  |  June – August 2026  |  Grade O (Outstanding)', margin, y, 10, 'normal');
      y = addBullet('Completed 8-week AWS cloud engineering internship with AI-powered tooling', margin, y, 10);
      y = addBullet('Curriculum by AWS Educate; certified by AICTE, Ministry of Education', margin, y, 10);
      y += 4;
      y = addText('Brand Ambassador', margin, y, 11, 'bold');
      y = addText('LaunchEd Global · JIS University  |  July 2026', margin, y, 10, 'normal');
      y = addBullet('Digital outreach, student registrations, program awareness', margin, y, 10);
      y += 4;
      y = addText('Marketing Intern', margin, y, 11, 'bold');
      y = addText('Bleep Education · Remote  |  January 2026', margin, y, 10, 'normal');
      y = addBullet('Recognized for outstanding performance', margin, y, 10);
      y = addBullet('Endorsed by E-cell IIT Bombay, IIIT-Naya Raipur, IIT Pune', margin, y, 10);
      y += 8;
      y = addLine(y);

      // Skills
      y = addText('SKILLS', margin, y, 13, 'bold');
      y += 4;
      y = addText('Cloud: AWS (S3, VPC, RDS), GCP Compute Engine, Cloud Storage, API Gateway, Well-Architected', margin, y, 10, 'normal');
      y = addText('Cybersecurity: OPSWAT ICIP, Nmap, Burp Suite, SUID Analysis, Reflected XSS, OWASP', margin, y, 10, 'normal');
      y = addText('Networking: TCP/IP, DNS, HTTP, Amazon VPC, Cisco Packet Tracer, Cisco NetAcad', margin, y, 10, 'normal');
      y = addText('Programming: Python, Bash, C, HTML/CSS/JS, PHP/MySQL, Flask, Next.js/React, MongoDB', margin, y, 10, 'normal');
      y = addText('Tools: Kali Linux, Git & GitHub, TryHackMe, OverTheWire, AWS Educate, Claude', margin, y, 10, 'normal');
      y += 8;
      y = addLine(y);

      // Projects
      y = addText('PROJECTS', margin, y, 13, 'bold');
      y += 4;
      y = addText('Open Source Contributions — HexaFalls 2', margin, y, 11, 'bold');
      y = addBullet('Responsive layout fixes and navbar active-state indicator (HTML/CSS/JS)', margin, y, 10);
      y = addBullet('Stats card component in Next.js/React/MongoDB stack', margin, y, 10);
      y = addBullet('Reported hardcoded database credentials vulnerability in Event_HUB (PHP/MySQL)', margin, y, 10);
      y += 4;
      y = addText('Penetration Testing Lab', margin, y, 11, 'bold');
      y = addBullet('TryHackMe rooms: Offensive/Defensive Security, DNS, HTTP, Linux Fundamentals', margin, y, 10);
      y = addBullet('OverTheWire Bandit challenges up to Level 6-7', margin, y, 10);
      y = addBullet('nmap -sV service scans and SUID binary discovery on Kali Linux', margin, y, 10);
      y = addBullet('Reflected XSS vulnerability in Flask app with unsanitized query params', margin, y, 10);
      y += 8;
      y = addLine(y);

      // Certifications
      y = addText('CERTIFICATIONS', margin, y, 13, 'bold');
      y += 4;
      var certs = [
        'AI Fluency for Students — Anthropic (2026)',
        'Teaching AI Fluency Framework — Anthropic (2026)',
        'Claude Code in Action — Anthropic (2026)',
        'Open Source Connect Global 2026 — NexFellow (2026)',
        'Introduction to CIP (ICIP) — OPSWAT Academy (July 2026)',
        'Networking Basics — Cisco NetAcad (July 2026)',
        'Getting Started with Cisco Packet Tracer — Cisco NetAcad (June 2026)',
        'AWS SimuLearn: Cloud Computing Essentials — AWS (July 2026)',
        'AWS SimuLearn: Cloud First Steps — AWS (July 2026)',
        'AWS Educate: Cloud 101 — AWS (July 2026)',
        'AWS Educate: Storage, Networking, Databases — AWS (July 2026)',
        'AWS Educate: Cloud Ops, Security, Serverless — AWS (July 2026)',
        'AWS Educate: ML Foundations & Generative AI — AWS (July 2026)',
        'Google Cloud: Compute, Storage, Pub/Sub — Google Cloud (Oct–Nov 2025)',
        'Google Cloud: API Gateway, Looker, Dataplex — Google Cloud (Nov 2025)'
      ];
      for(var i=0;i<certs.length;i++){
        y = addBullet(certs[i], margin, y, 9);
      }

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text('Generated from portfolio — ' + new Date().toLocaleDateString(), margin, doc.internal.pageSize.getHeight() - 20);

      doc.save('Kazi_Md_Samim_Faraj_Resume.pdf');
    });
  }

  // ===== GITHUB API INTEGRATION =====
  var ghUsername = 'kazi716';
  var ghReposEl = document.getElementById('gh-repos');
  var ghStreakEl = document.getElementById('gh-streak');
  var ghContribEl = document.getElementById('gh-contrib');
  var ghStarsEl = document.getElementById('gh-stars');
  var ghReposListEl = document.getElementById('gh-repos-list');
  var ghErrorEl = document.getElementById('gh-error');

  function formatNumber(n){
    if(n >= 1000) return (n/1000).toFixed(1) + 'k';
    return n;
  }

  // Fetch user data
  fetch('https://api.github.com/users/' + ghUsername)
    .then(function(r){ return r.json(); })
    .then(function(user){
      if(ghReposEl) ghReposEl.textContent = user.public_repos || 0;
      // Fetch repos for stars count
      return fetch('https://api.github.com/users/' + ghUsername + '/repos?per_page=100&sort=updated');
    })
    .then(function(r){ return r.json(); })
    .then(function(repos){
      if(!Array.isArray(repos)) throw new Error('Invalid repos');
      var totalStars = repos.reduce(function(s, r){ return s + (r.stargazers_count || 0); }, 0);
      if(ghStarsEl) ghStarsEl.textContent = formatNumber(totalStars);
      // Show top 3 repos
      var topRepos = repos.slice(0, 3);
      var html = '';
      topRepos.forEach(function(repo){
        html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">';
        html += '<div><p style="font-size:12px;font-weight:500;margin:0">' + repo.name + '</p>';
        html += '<p style="font-size:10px;color:var(--text-tertiary);margin:2px 0 0">' + (repo.description || 'No description') + '</p></div>';
        html += '<div style="display:flex;gap:8px;flex-shrink:0"><span style="font-size:10px;color:var(--text-tertiary)">⭐ ' + repo.stargazers_count + '</span>';
        html += '<span style="font-size:10px;color:var(--text-tertiary)">' + (repo.language || 'N/A') + '</span></div>';
        html += '</div>';
      });
      if(ghReposListEl) ghReposListEl.innerHTML = html;
    })
    .catch(function(e){
      console.error('GitHub API error:', e);
      if(ghErrorEl) ghErrorEl.style.display = 'block';
    });

  // Fetch contribution data (using a proxy approach since GitHub doesn't have a direct contributions API)
  // We'll use the events API as a proxy for activity
  fetch('https://api.github.com/users/' + ghUsername + '/events?per_page=100')
    .then(function(r){ return r.json(); })
    .then(function(events){
      if(!Array.isArray(events)) throw new Error('Invalid events');
      var pushEvents = events.filter(function(e){ return e.type === 'PushEvent'; });
      var contribCount = pushEvents.reduce(function(s, e){ return s + (e.payload && e.payload.size || 0); }, 0);
      if(ghContribEl) ghContribEl.textContent = formatNumber(contribCount);
      // Estimate streak from recent activity
      var dates = {};
      events.forEach(function(e){
        var d = e.created_at ? e.created_at.split('T')[0] : null;
        if(d) dates[d] = true;
      });
      var uniqueDates = Object.keys(dates).sort();
      if(ghStreakEl) ghStreakEl.textContent = uniqueDates.length + 'd';
    })
    .catch(function(e){
      console.error('GitHub events error:', e);
      if(ghStreakEl) ghStreakEl.textContent = 'N/A';
      if(ghContribEl) ghContribEl.textContent = 'N/A';
    });

})();

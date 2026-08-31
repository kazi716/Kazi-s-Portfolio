(function(){
  var root = document.getElementById('kp-root');
  var nav = document.getElementById('kp-nav');
  var buttons = nav ? nav.querySelectorAll('button') : [];
  var sections = document.querySelectorAll('.kp-section');
  var progress = document.getElementById('kp-progress');
  var backtop = document.getElementById('kp-backtop');

  // Smooth scroll to section on nav click
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      var tab = btn.dataset.tab;
      var target = document.getElementById('tab-' + tab);
      if(target){
        var rect = target.getBoundingClientRect();
        var offset = rect.top + window.scrollY - 70; // Account for sticky nav height
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // Scroll spy: highlight nav based on scroll position
  function updateNav(){
    if(sections.length === 0) return;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var activeSet = false;

    sections.forEach(function(sec, i){
      var rect = sec.getBoundingClientRect();
      var secTop = rect.top + window.scrollY;
      var secBottom = secTop + sec.offsetHeight;
      if(scrollTop >= secTop - 90 && scrollTop < secBottom - 90 && !activeSet){
        buttons.forEach(function(b){ b.classList.remove('active'); });
        if(buttons[i]) buttons[i].classList.add('active');
        activeSet = true;
      }
    });

    // Progress bar
    var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if(progress) progress.style.width = pct + '%';

    // Back to top
    if(backtop){
      if(scrollTop > 300){ backtop.classList.add('visible'); }
      else { backtop.classList.remove('visible'); }
    }
  }
  window.addEventListener('scroll', updateNav);
  window.addEventListener('load', updateNav);

  // Back to top
  if(backtop){
    backtop.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== CERTIFICATION CATEGORY FILTER =====
  var filterBtns = document.querySelectorAll('.kp-filter-btn');
  var certCards = document.querySelectorAll('#kp-cert-grid .kp-cert-card');

  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      filterBtns.forEach(function(b){ b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.dataset.filter;

      certCards.forEach(function(card, idx){
        if(filter === 'all' || card.dataset.vendor === filter){
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(function(){
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, idx * 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ===== 3D CARD TILT PHYSICS EFFECT =====
  var tiltCards = root.querySelectorAll('.kp-card, .kp-cert-card, .kp-stat');
  tiltCards.forEach(function(card){
    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * -5;
      var rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) scale3d(1.015, 1.015, 1.015)';
    });
    card.addEventListener('mouseleave', function(){
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // ===== CUSTOM CURSOR =====
  var cursor = document.getElementById('kp-cursor');
  var dot = document.getElementById('kp-cursor-dot');
  if(cursor && dot){
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
      cursorX += (mouseX - cursorX) * 0.16;
      cursorY += (mouseY - cursorY) * 0.16;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    var interactives = root.querySelectorAll('a, button, .kp-stat, .kp-card, .kp-cert-card, .kp-skill-tag, .kp-contact a');
    interactives.forEach(function(el){
      el.addEventListener('mouseenter', function(){ cursor.classList.add('hover'); });
      el.addEventListener('mouseleave', function(){ cursor.classList.remove('hover'); });
    });
  }

  // ===== ARTISTIC CONSTELLATION CANVAS =====
  var canvas = document.getElementById('kp-particles');
  if(canvas){
    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 110;
    var CONNECTION_DIST = 110;
    var MAX_CONNECTIONS = 3;
    var MOUSE_RADIUS = 160;

    function resizeCanvas(){
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var colors = [
      { r: 255, g: 255, b: 255 },  // Pure White
      { r: 226, g: 232, b: 240 },  // Silver/Ice
      { r: 161, g: 161, b: 170 },  // Zinc Grey
      { r: 200, g: 200, b: 200 }   // Light Grey
    ];

    function createParticle(){
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.8 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.45 + 0.15,
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

        if(cursor){
          var dx = p.x - mouseX;
          var dy = p.y - mouseY;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if(dist < MOUSE_RADIUS && dist > 0){
            var force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
            p.vx += (dx / dist) * force * 0.2;
            p.vy += (dy / dist) * force * 0.2;
          }
        }
        p.vx *= 0.99; p.vy *= 0.99;

        var pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + Math.max(0, pulseAlpha) + ')';
        ctx.fill();

        if(p.radius > 1.4){
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
          var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3);
          grad.addColorStop(0, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + (pulseAlpha * 0.25) + ')');
          grad.addColorStop(1, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',0)');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      });

      for(var i = 0; i < particles.length; i++){
        var connections = 0;
        for(var j = i + 1; j < particles.length; j++){
          if(connections >= MAX_CONNECTIONS) break;
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if(dist < CONNECTION_DIST){
            var alpha = (1 - dist / CONNECTION_DIST) * 0.12;
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
  }

  // ===== PDF RESUME GENERATOR =====
  var pdfBtn = document.getElementById('kp-pdf-btn');
  if(pdfBtn){
    pdfBtn.addEventListener('click', function(){
      if(!window.jspdf){
        alert('PDF library is loading, please try again in a moment.');
        return;
      }
      var { jsPDF } = window.jspdf;
      var doc = new jsPDF({ unit: 'pt', format: 'a4' });
      var pageW = doc.internal.pageSize.getWidth();
      var pageH = doc.internal.pageSize.getHeight();
      var margin = 40;
      var y = margin;

      function checkPageBreak(neededHeight){
        if(y + neededHeight > pageH - margin - 20){
          doc.addPage();
          y = margin;
        }
      }

      function addText(text, x, yPos, size, weight, color){
        doc.setFontSize(size || 10);
        doc.setFont('helvetica', weight || 'normal');
        doc.setTextColor(color || 30);
        doc.text(text, x, yPos);
        return yPos + size + 4;
      }

      function addLine(yPos){
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(margin, yPos, pageW - margin, yPos);
        return yPos + 10;
      }

      function addBullet(text, x, yPos, size){
        doc.setFontSize(size || 9.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50);
        var split = doc.splitTextToSize('\u2022 ' + text, pageW - margin * 2 - 10);
        doc.text(split, x + 6, yPos);
        return yPos + (split.length * (size || 9.5)) + 3;
      }

      // HEADER
      y = addText('KAZI MD SAMIM FARAJ', margin, y, 20, 'bold', [15, 23, 42]);
      y = addText('Cybersecurity & Cloud Engineer', margin, y, 11, 'bold', [78, 133, 191]);
      y = addText('Kolkata, West Bengal, India  |  samimkazi716@gmail.com', margin, y, 9, 'normal', [100, 116, 139]);
      y = addText('GitHub: github.com/kazi716  |  LinkedIn: linkedin.com/in/kazi-md-samim-faraj', margin, y, 9, 'normal', [100, 116, 139]);
      y = addText('Credly ID: 0e8da13e-0d31-461d-acbd-b7761d88f313  |  credly.com/users/kazi-md-samim-faraj', margin, y, 9, 'normal', [100, 116, 139]);
      y += 6;
      y = addLine(y);

      // SUMMARY
      checkPageBreak(50);
      y = addText('OBJECTIVE & PROFILE SUMMARY', margin, y, 12, 'bold', [15, 23, 42]);
      y += 2;
      var summary = 'B.Tech CSE student at JIS University with hands-on experience in cybersecurity, cloud computing, and ethical hacking. Holder of 24 verified certifications across AWS Educate, Google Cloud, Cisco NetAcad, OPSWAT Critical Infrastructure Protection, and Anthropic AI Fluency. Active open-source contributor seeking internship opportunities in Cloud Computing, Cybersecurity, or Security Engineering.';
      var sumLines = doc.splitTextToSize(summary, pageW - margin * 2);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50);
      doc.text(sumLines, margin, y);
      y += (sumLines.length * 11) + 6;
      y = addLine(y);

      // EDUCATION
      checkPageBreak(80);
      y = addText('EDUCATION', margin, y, 12, 'bold', [15, 23, 42]);
      y += 2;
      y = addText('B.Tech — Computer Science and Engineering  (CGPA: 7.4 ongoing)', margin, y, 10, 'bold');
      y = addText('JIS University, Kolkata  |  2025 – Present  |  1st Year, 2nd Semester', margin, y, 9, 'normal', [100, 116, 139]);
      y += 2;
      y = addText('Class XII — Higher Secondary  |  Shishu Sadan High School (2025)  |  72%', margin, y, 9, 'normal');
      y = addText('Class X — Secondary  |  Shishu Sadan High School (2023)  |  85%', margin, y, 9, 'normal');
      y += 6;
      y = addLine(y);

      // EXPERIENCE
      checkPageBreak(120);
      y = addText('EXPERIENCE & INTERNSHIPS', margin, y, 12, 'bold', [15, 23, 42]);
      y += 2;
      y = addText('AWS AI-Powered Cloud Engineer Virtual Intern', margin, y, 10, 'bold');
      y = addText('AICTE-EduSkills  |  June – August 2026  |  Grade O (Outstanding)', margin, y, 9, 'normal', [78, 133, 191]);
      y = addBullet('Completed 8-week AWS cloud engineering internship with AI-powered tooling, curriculum by AWS Educate.', margin, y, 9);
      y = addBullet('Certified by AICTE, Ministry of Education with Outstanding Grade O performance.', margin, y, 9);
      y += 3;
      y = addText('Brand Ambassador — LaunchEd Global', margin, y, 10, 'bold');
      y = addText('LaunchEd Global · JIS University  |  July 2026', margin, y, 9, 'normal', [100, 116, 139]);
      y = addBullet('Selected as campus brand ambassador; led digital outreach and student awareness programs.', margin, y, 9);
      y += 3;
      y = addText('Marketing Intern — Bleep Education', margin, y, 10, 'bold');
      y = addText('Bleep Education  |  January 2026', margin, y, 9, 'normal', [100, 116, 139]);
      y = addBullet('Recognized for outstanding performance; certificate endorsed by E-cell IIT Bombay, IIIT-Naya Raipur, and IIT Pune.', margin, y, 9);
      y += 6;
      y = addLine(y);

      // TECHNICAL SKILLS
      checkPageBreak(90);
      y = addText('TECHNICAL SKILLS', margin, y, 12, 'bold', [15, 23, 42]);
      y += 2;
      y = addText('Cloud Platforms: AWS (S3, VPC, RDS, Well-Architected Framework), Google Cloud (Compute Engine, Cloud Storage, Pub/Sub, API Gateway, Looker, Dataplex)', margin, y, 9, 'normal');
      y = addText('Cybersecurity: OPSWAT Critical Infrastructure Protection (ICIP), Nmap, Burp Suite, SUID Binary Discovery, Reflected XSS Identification', margin, y, 9, 'normal');
      y = addText('Networking: TCP/IP, DNS, HTTP, Amazon VPC, Cisco Packet Tracer, Cisco NetAcad', margin, y, 9, 'normal');
      y = addText('Programming & Web: Python (beginner), Bash scripting, C (basic), HTML/CSS/JS, PHP/MySQL (basic), Flask, Next.js/React, MongoDB', margin, y, 9, 'normal');
      y = addText('Tools & Platforms: Kali Linux, Linux Fundamentals, TryHackMe, OverTheWire Bandit (Level 6-7), AWS Educate, Claude Code', margin, y, 9, 'normal');
      y += 6;
      y = addLine(y);

      // PROJECTS
      checkPageBreak(100);
      y = addText('PROJECTS & HANDS-ON WORK', margin, y, 12, 'bold', [15, 23, 42]);
      y += 2;
      y = addText('Open Source Contributions — HexaFalls 2 Hackathon', margin, y, 10, 'bold');
      y = addBullet('Implemented responsive layout fixes and navbar active-state indicators (HTML/CSS/JS).', margin, y, 9);
      y = addBullet('Developed stats card component in Next.js/React/MongoDB stack.', margin, y, 9);
      y = addBullet('Identified and reported hardcoded database credentials vulnerability in Event_HUB (PHP/MySQL).', margin, y, 9);
      y += 3;
      y = addText('Penetration Testing Lab & Vulnerability Research', margin, y, 10, 'bold');
      y = addBullet('Completed TryHackMe rooms: Offensive/Defensive Security, DNS, HTTP, Linux Fundamentals.', margin, y, 9);
      y = addBullet('Solved OverTheWire Bandit wargame challenges up to Level 6-7.', margin, y, 9);
      y = addBullet('Executed nmap -sV service scans and SUID privilege escalation discovery on Kali Linux.', margin, y, 9);
      y = addBullet('Identified Reflected XSS vulnerability in Flask application with unsanitized query parameters.', margin, y, 9);
      y += 6;
      y = addLine(y);

      // CERTIFICATIONS
      checkPageBreak(120);
      y = addText('VERIFIED CERTIFICATIONS & SKILL BADGES (24 CREDENTIALS)', margin, y, 12, 'bold', [15, 23, 42]);
      y += 2;

      var certList = [
        'The Basics of Google Cloud Compute Skill Badge — Google Cloud (20 Oct 2025)',
        'Implement Cloud Storage and Data Protection Solutions — Google Cloud (24 Oct 2025)',
        'Get Started with Pub/Sub Skill Badge — Google Cloud (24 Oct 2025)',
        'Deploy and Secure Serverless APIs with API Gateway — Google Cloud (16 Nov 2025)',
        'Get Started with Looker Skill Badge — Google Cloud (16 Nov 2025)',
        'Get Started with Dataplex Skill Badge — Google Cloud (16 Nov 2025)',
        'AWS Educate Introduction to Cloud 101 — Training Badge — AWS (8 July 2026)',
        'AWS Educate Getting Started with Storage — Training Badge — AWS (8 July 2026)',
        'AWS Educate Getting Started with Networking — Training Badge — AWS (14 July 2026)',
        'AWS Educate Getting Started with Databases — Training Badge — AWS (16 July 2026)',
        'AWS Educate Getting Started with Cloud Ops — Training Badge — AWS (16 July 2026)',
        'AWS Educate Getting Started with Security — Training Badge — AWS (17 July 2026)',
        'AWS Educate Getting Started with Serverless — Training Badge — AWS (23 July 2026)',
        'AWS Educate Machine Learning Foundations — Training Badge — AWS (28 July 2026)',
        'AWS Educate Introduction to Generative AI — Training Badge — AWS (28 July 2026)',
        'AWS SimuLearn: Cloud Computing Essentials — AWS (14 July 2026)',
        'AWS SimuLearn: Cloud First Steps — AWS (14 July 2026)',
        'Networking Basics — Cisco NetAcad (22 July 2026)',
        'Getting Started with Cisco Packet Tracer — Cisco NetAcad (5 June 2026)',
        'Introduction to Critical Infrastructure Protection (ICIP) — OPSWAT Academy (23 July 2026)',
        'AI Fluency for Students — Anthropic (2026)',
        'Teaching the AI Fluency Framework — Anthropic (2026)',
        'Claude Code in Action — Anthropic (2026)',
        'Open Source Connect Global 2026 Contributor — NexFellow (2026)'
      ];

      for(var i = 0; i < certList.length; i++){
        checkPageBreak(14);
        y = addBullet(certList[i], margin, y, 8.5);
      }

      var totalPages = doc.internal.getNumberOfPages();
      for(var p = 1; p <= totalPages; p++){
        doc.setPage(p);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(140);
        doc.text('Kazi Md Samim Faraj — Official Transcript Resume  |  Page ' + p + ' of ' + totalPages, pageW / 2, pageH - 18, { align: 'center' });
      }

      doc.save('Kazi_Md_Samim_Faraj_Resume_Credly.pdf');
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

  fetch('https://api.github.com/users/' + ghUsername)
    .then(function(r){ return r.json(); })
    .then(function(user){
      if(ghReposEl) ghReposEl.textContent = user.public_repos || 0;
      return fetch('https://api.github.com/users/' + ghUsername + '/repos?per_page=100&sort=updated');
    })
    .then(function(r){ return r.json(); })
    .then(function(repos){
      if(!Array.isArray(repos)) throw new Error('Invalid repos');
      var totalStars = repos.reduce(function(s, r){ return s + (r.stargazers_count || 0); }, 0);
      if(ghStarsEl) ghStarsEl.textContent = formatNumber(totalStars);
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

  fetch('https://api.github.com/users/' + ghUsername + '/events?per_page=100')
    .then(function(r){ return r.json(); })
    .then(function(events){
      if(!Array.isArray(events)) throw new Error('Invalid events');
      var pushEvents = events.filter(function(e){ return e.type === 'PushEvent'; });
      var contribCount = pushEvents.reduce(function(s, e){ return s + (e.payload && e.payload.size || 0); }, 0);
      if(ghContribEl) ghContribEl.textContent = formatNumber(contribCount);
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

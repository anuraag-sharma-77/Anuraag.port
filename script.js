document.addEventListener('DOMContentLoaded', () => {

    // 1. PRELOADER LOGIC
    const preloader = document.getElementById('preloader');
    const percentEl = document.getElementById('loader-percent');
    const progressEl = document.querySelector('.preloader-progress');
    let count = 0;

    const interval = setInterval(() => {
        count += Math.floor(Math.random() * 5) + 1;
        if (count >= 100) {
            count = 100;
            clearInterval(interval);
            finishLoading();
        }
        percentEl.textContent = `${count}%`;
        progressEl.style.width = `${count}%`;
    }, 30);

    function finishLoading() {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transform = 'translateY(-100%)';
            setTimeout(() => {
                preloader.style.display = 'none';
                initGSAPAnimations(); // Start animations only after preloader finishes
            }, 800);
        }, 500);
    }

    // 2. THEME TOGGLE (LIGHT/DARK)
    const themeBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const htmlEl = document.documentElement;
    
    // Check local storage for preference
    if(localStorage.getItem('theme') === 'light') {
        htmlEl.setAttribute('data-theme', 'light');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }

    themeBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            htmlEl.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            sunIcon.classList.remove('hidden');
            moonIcon.classList.add('hidden');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    });

    // 3. PROJECT MODAL LOGIC
    const modal = document.getElementById('project-modal');
    const modalClose = document.querySelector('.modal-close');
    const projectCards = document.querySelectorAll('.project-card');

    let currentProjectImages = [];
    let currentImageIndex = 0;
    
    const sliderPrev = document.getElementById('slider-prev');
    const sliderNext = document.getElementById('slider-next');
    const modalImage = document.getElementById('modal-image');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if(e.target.tagName.toLowerCase() === 'a') return;
            
            const title = card.getAttribute('data-title');
            const tags = card.getAttribute('data-tags').split(',');
            // Handle new multiple images attribute or fallback to single image
            const imagesAttr = card.getAttribute('data-images') || card.getAttribute('data-image');
            
            currentProjectImages = imagesAttr.split(',').map(img => img.trim());
            currentImageIndex = 0;
            
            const desc = card.getAttribute('data-desc');
            const link = card.getAttribute('data-link');

            document.getElementById('modal-title').textContent = title;
            modalImage.src = currentProjectImages[currentImageIndex];
            document.getElementById('modal-desc').textContent = desc;
            document.getElementById('modal-link').href = link;
            
            // Hide/Show slider buttons based on image count
            if(currentProjectImages.length > 1) {
                sliderPrev.style.display = 'block';
                sliderNext.style.display = 'block';
            } else {
                sliderPrev.style.display = 'none';
                sliderNext.style.display = 'none';
            }

            const tagsContainer = document.getElementById('modal-tags');
            tagsContainer.innerHTML = '';
            tags.forEach(tag => {
                tagsContainer.innerHTML += `<span>${tag}</span>`;
            });

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            playSound('bloop');
        });
    });

    // Slider Logic
    function updateSliderImage() {
        modalImage.style.opacity = 0; // Fade out slightly
        playSound('click');
        setTimeout(() => {
            modalImage.src = currentProjectImages[currentImageIndex];
            modalImage.style.opacity = 1; // Fade back in
        }, 150);
    }

    sliderPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
        updateSliderImage();
    });

    sliderNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
        updateSliderImage();
    });

    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    modal.addEventListener('click', (e) => {
        if(e.target.classList.contains('modal-overlay')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 3.5 RESUME MODAL LOGIC
    const resumeModal = document.getElementById('resume-modal');
    const resumeTrigger = document.getElementById('resume-trigger');
    const closeResume = document.getElementById('close-resume');

    if(resumeTrigger) {
        resumeTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            playSound('bloop');
        });
    }

    if(closeResume) {
        closeResume.addEventListener('click', () => {
            resumeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }

    resumeModal.addEventListener('click', (e) => {
        if(e.target.classList.contains('modal-overlay')) {
            resumeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // 4. CONTACT FORM & TOAST VALIDATION
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    const toast = document.getElementById('toast');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent page reload
        playSound('bloop');
        
        // Show Spinner
        btnText.classList.add('hidden');
        spinner.classList.remove('hidden');
        submitBtn.style.pointerEvents = 'none';

        const formData = new FormData();
        formData.append("name", document.getElementById('name').value);
        formData.append("email", document.getElementById('email').value);
        formData.append("message", document.getElementById('message').value);
        // Change the below email to the actual user email eventually. Using formsubmit free action.
        
        try {
            const response = await fetch("https://formsubmit.co/ajax/soorajsharma@example.com", {
                method: "POST",
                body: formData
            });

            if(response.ok) {
                contactForm.reset();
                toast.querySelector('strong').textContent = "Success";
                toast.querySelector('p').textContent = "Transmission received successfully!";
            } else {
                 throw new Error("Failed");
            }
        } catch(error) {
            toast.querySelector('strong').textContent = "Notice";
            toast.querySelector('p').textContent = "Demo Form: Change email to activate.";
        }

        // Reset Button
        btnText.classList.remove('hidden');
        spinner.classList.add('hidden');
        submitBtn.style.pointerEvents = 'auto';

        // Show Toast
        playSound('success');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    });

    // 4.5 COPY EMAIL TO CLIPBOARD
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if(copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText("soorajsharma@example.com");
                playSound('success');
                toast.querySelector('strong').textContent = "Copied!";
                toast.querySelector('p').textContent = "Email address copied to clipboard.";
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    }

    // GSAP SCROLL & PARALLAX ANIMATIONS
    gsap.registerPlugin(ScrollTrigger);

    function initGSAPAnimations() {
        // Hero Reveal
        gsap.from(".gsap-reveal", { y: 100, opacity: 0, duration: 1, ease: "power4.out" });
        gsap.from(".gsap-reveal-delay", { y: 50, opacity: 0, duration: 1, ease: "power4.out", stagger: 0.2, delay: 0.3 });
        gsap.from(".gsap-reveal-img", { scale: 0.8, opacity: 0, duration: 1.5, ease: "expo.out", delay: 0.5 });
        
        // Hacker Text Decode Effect
        const headerText = document.querySelector('.hero-content h1 .gradient-text');
        const originalText = "Engineer.";
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let iteration = 0;
        let decodeInterval = setInterval(() => {
            headerText.innerText = originalText.split("").map((letter, index) => {
                if(index < iteration) return originalText[index];
                return letters[Math.floor(Math.random() * 54)];
            }).join("");
            if(iteration >= originalText.length) clearInterval(decodeInterval);
            iteration += 1 / 3;
        }, 30);
    }

    // Parallax effect on elements with data-speed
    const parallaxImages = document.querySelectorAll(".gsap-parallax");
    parallaxImages.forEach((img) => {
        const speed = img.getAttribute('data-speed');
        gsap.to(img, {
            y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed * 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            }
        });
    });

    // 6. DUAL CURSOR LOGIC
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        cursor.style.left = x + 'px';
        cursor.style.top = y + 'px';
        
        follower.style.left = x + 'px';
        follower.style.top = y + 'px';
    });

    const links = document.querySelectorAll('a, button, .module, .project-card');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(3)';
            cursor.style.background = 'transparent';
            cursor.style.border = '1px solid var(--primary)';
            follower.style.transform = 'scale(0)';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'var(--primary)';
            cursor.style.border = 'none';
            follower.style.transform = 'scale(1)';
        });
    });

    // 7. HEADER SCROLL STATE & PROGRESS BAR
    const header = document.querySelector('header');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Header
        if (window.scrollY > 50) {
            header.style.padding = '15px 80px';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '20px 80px';
            header.style.boxShadow = 'none';
        }

        // Progress Bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    });

    // 8. INITIALIZE AOS
    if (window.AOS) {
        AOS.init({
            duration: 1000,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            once: true,
            offset: 50
        });
    }

    // 9. WEB AUDIO API - SOUND EFFECTS
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playSound(type) {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        if(type === 'click') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if(type === 'bloop') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.15);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now); osc.stop(now + 0.15);
        } else if(type === 'success') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(400, now);
            osc.frequency.setValueAtTime(600, now + 0.1);
            osc.frequency.setValueAtTime(1000, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        }
    }

    // Attach click sound to buttons
    document.querySelectorAll('button, a').forEach(el => {
        el.addEventListener('click', () => playSound('click'));
    });

    // 10. GITHUB API LIVE FETCH
    async function fetchGitHubData() {
        try {
            const res = await fetch('https://api.github.com/users/Sooraj734056');
            if(res.ok) {
                const data = await res.json();
                const repoCount = data.public_repos || '15+';
                document.getElementById('github-repos').textContent = repoCount;
            }
        } catch(e) { console.log("GitHub API failed."); }
    }
    fetchGitHubData();

    // 11. EASTER EGG TERMINAL LOGIC
    const terminalTrigger = document.getElementById('terminal-trigger');
    const terminalOverlay = document.getElementById('terminal-overlay');
    const closeTerminal = document.getElementById('close-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');

    terminalTrigger.addEventListener('click', () => {
        terminalOverlay.classList.add('active');
        terminalInput.focus();
        playSound('bloop');
    });

    closeTerminal.addEventListener('click', () => terminalOverlay.classList.remove('active'));
    
    terminalInput.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            const val = terminalInput.value.trim().toLowerCase();
            terminalInput.value = '';
            
            // Output User Command
            const promptLine = document.createElement('div');
            promptLine.innerHTML = `<span style="color:#a0a0a0">guest@sooraj:~$</span> ${val}`;
            terminalBody.appendChild(promptLine);
            
            // Handle Command Logic
            const responseLine = document.createElement('div');
            responseLine.style.color = '#0ff';
            
            switch(val) {
                case 'help': responseLine.innerHTML = "Available commands: <br>- <b>whoami</b>: About me<br>- <b>projects</b>: List projects<br>- <b>contact</b>: Get email<br>- <b>clear</b>: Clear screen<br>- <b>exit</b>: Close terminal"; break;
                case 'whoami': responseLine.innerHTML = "Sooraj Sharma. Full Stack Developer. MERN Stack Enthusiast. Building the web."; break;
                case 'projects': responseLine.innerHTML = "1. Premium Portfolio<br>2. AirRun Footwear<br>3. Urban Vibe<br>Type 'exit' and scroll down to view visually."; break;
                case 'contact': responseLine.innerHTML = "Email: soorajsharma@example.com <br>GitHub: github.com/Sooraj734056"; break;
                case 'clear': terminalBody.innerHTML = ''; break;
                case 'exit': terminalOverlay.classList.remove('active'); break;
                case '': break;
                default: responseLine.innerHTML = `Command not found: ${val}. Type 'help'.`; responseLine.style.color = '#ff5f56';
            }
            
            if(val !== 'clear' && val !== '') terminalBody.appendChild(responseLine);
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    // 12. MAGNETIC BUTTONS PHYSICS
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        btn.addEventListener('mouseleave', () => btn.style.transform = `translate(0px, 0px)`);
    });

    // 13. PWA SETUP (Service Worker)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').then(reg => console.log('PWA Registered')).catch(err => console.log('PWA Failed', err));
        });
    }

    // 14. LIVE VISITOR COUNTER SIMULATOR (Algorithmically consistent logic)
    const liveCounterEl = document.getElementById('live-visitors');
    let baseCount = parseInt(localStorage.getItem('visitorCount')) || 1245;
    localStorage.setItem('visitorCount', baseCount + 1); // increment personally
    
    // Simulate other network hits continuously
    setInterval(() => {
        if(Math.random() > 0.75) {
            baseCount += Math.floor(Math.random() * 2) + 1;
            liveCounterEl.textContent = baseCount.toLocaleString();
        }
    }, 3500);

    // 15. KONAMI CHEAT CODE (UP UP DOWN DOWN LEFT RIGHT b a)
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPos = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiSequence[konamiPos]) {
            konamiPos++;
            if (konamiPos === konamiSequence.length) {
                document.body.classList.toggle('matrix-mode');
                playSound('success');
                konamiPos = 0;
            }
        } else {
            konamiPos = 0;
        }
    });

});

emailjs.init({
publicKey: "TERI_PUBLIC_KEY"
});


const contactForm =
document.getElementById("contact-form");


contactForm.addEventListener("submit", function(e){

e.preventDefault();


emailjs.sendForm(
"TERI_SERVICE_ID",
"TERI_TEMPLATE_ID",
this
)

.then(()=>{

alert("Message Sent Successfully 🚀");

contactForm.reset();

})

.catch((error)=>{

console.log(error);
alert("Message Failed ❌");

});


});
emailjs.init("YAHAN_PUBLIC_KEY_DAAL");


const form = document.getElementById("contact-form");


form.addEventListener("submit", function(e){

    e.preventDefault();


    emailjs.sendForm(
       "jA8s9dH12xxxx",
       "service_7abc12",
        form
    )
    .then(()=>{

        alert("Mail Sent Successfully 🚀");
        form.reset();

    })
    .catch((error)=>{

        alert("Mail nahi gaya ❌");
        console.log(error);

    });

});
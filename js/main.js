document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. FONCTIONNALITÉS DE BASE (Navbar, Scroll, Typewriter)
    // ======================================================

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    // Menu Burger Mobile
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        navLinks.forEach((link, index) => {
            link.style.animation = link.style.animation ? '' : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
        burger.classList.toggle('toggle');
    });

    // Typewriter Effect (Machine à écrire)
    class TypeWriter {
        constructor(txtElement, words, wait = 3000) {
            this.txtElement = txtElement; this.words = words; this.txt = '';
            this.wordIndex = 0; this.wait = parseInt(wait, 10);
            this.type(); this.isDeleting = false;
        }
        type() {
            const current = this.wordIndex % this.words.length;
            const fullTxt = this.words[current];
            if (this.isDeleting) { this.txt = fullTxt.substring(0, this.txt.length - 1); } 
            else { this.txt = fullTxt.substring(0, this.txt.length + 1); }
            this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
            let typeSpeed = 150;
            if (this.isDeleting) typeSpeed /= 2;
            if (!this.isDeleting && this.txt === fullTxt) { typeSpeed = this.wait; this.isDeleting = true; } 
            else if (this.isDeleting && this.txt === '') { this.isDeleting = false; this.wordIndex++; typeSpeed = 500; }
            setTimeout(() => this.type(), typeSpeed);
        }
    }
    const txtElement = document.querySelector('.txt-type');
    const words = JSON.parse(txtElement.getAttribute('data-words'));
    const wait = txtElement.getAttribute('data-wait');
    new TypeWriter(txtElement, words, wait);


    // ======================================================
    // 2. GESTION DES MODALES (POP-UPS PROJETS)
    // ======================================================
    const openModalButtons = document.querySelectorAll('.btn-modal-trigger');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const overlays = document.querySelectorAll('.modal-overlay');

    // Ouvrir la modale au clic sur le bouton
    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            // On récupère l'ID de la modale cible via l'attribut data-modal-target
            const targetId = button.getAttribute('data-modal-target');
            const targetModal = document.querySelector(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Empêche le scroll arrière-plan
            }
        });
    });

    // Fermer la modale (via la croix ou clic en dehors)
    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Réactive le scroll
    }

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            // On trouve la modale parente du bouton croix
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    // Fermer si on clique sur la zone sombre (l'overlay)
    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });


    // ======================================================
    // 3. TERMINAL INTERACTIF
    // ======================================================
    const terminalToggleBtn = document.getElementById('terminal-toggle');
    const terminalWindow = document.getElementById('interactive-terminal');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const closeTerminalBtn = document.getElementById('close-terminal');

    // Fonction pour afficher/cacher le terminal
    function toggleTerminal() {
        terminalWindow.classList.toggle('hidden');
        if (!terminalWindow.classList.contains('hidden')) {
            // Si on l'ouvre, on met le focus sur l'input pour taper direct
            setTimeout(() => terminalInput.focus(), 100);
        }
    }

    // Événements pour le bouton Navbar et le bouton rouge du terminal
    terminalToggleBtn.addEventListener('click', toggleTerminal);
    closeTerminalBtn.addEventListener('click', toggleTerminal);

    // Logique des commandes
    terminalInput.addEventListener('keydown', function(e) {
        // Si on appuie sur Entrée (code 13)
        if (e.key === 'Enter') {
            const command = this.value.trim().toLowerCase();
            let response = '';

            // Ajoute la ligne tapée à l'historique
            addToOutput(`<span class="prompt">naim@rt:~$</span> ${command}`);

            // Switch pour gérer les commandes
            switch(command) {
                case 'help':
                    response = "Commandes disponibles: help, whoami, ping <addr>, skills, clear, exit";
                    break;
                case 'whoami':
                    response = "Étudiant R&T spécialité cyber en 2ème année. Passionné de réseaux.";
                    break;
                case 'skills':
                    response = "Cisco, Linux, Python, Bash, Wireshark, HTML/CSS/JS...";
                    break;
                case 'clear':
                    terminalOutput.innerHTML = '';
                    this.value = '';
                    return; // On sort pour ne pas ajouter de réponse vide
                case 'exit':
                    toggleTerminal();
                    this.value = '';
                    return;
                default:
                    if (command.startsWith('ping ')) {
                        const target = command.split(' ')[1];
                        response = `PING ${target} (142.250.0.1): 56 data bytes<br>64 bytes from ${target}: icmp_seq=0 ttl=114 time=14.2 ms<br>64 bytes from ${target}: icmp_seq=1 ttl=114 time=12.8 ms<br>--- ${target} ping statistics ---<br>2 packets transmitted, 2 packets received, 0.0% packet loss`;
                    } else if (command === '') {
                         response = ''; // Ne rien faire si entrée vide
                    } else {
                        response = `bash: ${command}: commande introuvable. Tapez 'help'.`;
                    }
            }

            if(response) {
                addToOutput(response);
            }
            
            // Vider l'input et scroller vers le bas
            this.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });

    // Fonction utilitaire pour ajouter du texte dans le terminal
    function addToOutput(htmlContent) {
        const p = document.createElement('p');
        p.innerHTML = htmlContent;
        terminalOutput.appendChild(p);
    }
    
    // Clic n'importe où sur le terminal remet le focus sur l'input
    document.querySelector('.terminal-body').addEventListener('click', () => {
        terminalInput.focus();
    });

});
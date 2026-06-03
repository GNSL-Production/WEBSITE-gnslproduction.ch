// Rechargement de la page selon la largeur de l'écran
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  if ((lastWidth <= 1080 && window.innerWidth > 1080) || 
      (lastWidth > 1080 && window.innerWidth <= 1080)) {
    location.reload();
  }
  lastWidth = window.innerWidth;
});

// Variables globales
const body = document.body;
const logoBlock = document.querySelector(".logoBlock");
const burgerMenu = document.querySelector('.burger-menu');
const menuDropdown = document.querySelector('.menu-dropdown');
const buttons = document.querySelectorAll(".btnNav");

// Rechargement en cliquant sur le logo
logoBlock.addEventListener('click', () => {
  location.reload();
});

// Capsule de navigation (soulignement dynamique des boutons)
function moveCapsule(el) {
  const capsule = document.getElementById("capsule");
  capsule.style.left = el.offsetLeft + "px";
  capsule.style.width = el.offsetWidth + "px";
}

window.onload = () => {
  const capsule = document.getElementById("capsule");
  capsule.style.transition = "none";

  const currentHash = window.location.hash;
  const btns = document.querySelectorAll(".btnNav");
  let activeBtn = [...btns].find(btn => btn.getAttribute("href") === currentHash);

  if (!activeBtn) {
    activeBtn = btns[0];
  }

  btns.forEach(btn => btn.classList.remove('active'));
  activeBtn.classList.add('active');
  
  document.querySelectorAll('.menu-dropdown .btnNav').forEach(dropBtn => {
    dropBtn.classList.remove('active');
    if (dropBtn.getAttribute("href") === activeBtn.getAttribute("href")) {
      dropBtn.classList.add('active');
    }
  });

  moveCapsule(activeBtn);
  setTimeout(() => {
    capsule.style.transition = "";
  }, 50);
};

// Menu burger + duplication des boutons
burgerMenu.addEventListener("click", () => {
  toggleMenu();
});

function toggleMenu() {
  burgerMenu.classList.toggle('burger-menu-open');
  menuDropdown.classList.toggle("active");

  if (menuDropdown.classList.contains("active")) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = 'auto';
  }
}

menuDropdown.innerHTML = '';

buttons.forEach(button => {
  const newButton = button.cloneNode(true);
  newButton.onclick = function() {
    document.querySelectorAll('.menu-dropdown .btnNav').forEach(btn => btn.classList.remove('active'));
    newButton.classList.add('active');
    toggleMenu();
  };
  menuDropdown.appendChild(newButton);
});

// Détection de la section active au scroll
const sections = document.querySelectorAll("section[id]");

function moveActive() {
  let currentId = "";

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
      currentId = section.id;
    }
  });

  if (currentId) {
    const allLinks = document.querySelectorAll(".btnNav");
    
    allLinks.forEach(link => {
      const isActive = link.getAttribute("href") === `#${currentId}`;
      link.classList.toggle("active", isActive);

      if (isActive && link.closest('#btnBlock')) {
        moveCapsule(link);
      }
    });

    if (window.location.hash !== `#${currentId}`) {
      history.replaceState(null, null, `#${currentId}`);
    }
  }
}

window.addEventListener("scroll", moveActive);

// Effet de flou sur fond au scroll
const blurBg = document.querySelector(".bgBlur");

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const maxBlur = 20;
  const maxScroll = 700;
  const blurValue = Math.min((scrollY / maxScroll) * maxBlur, maxBlur);

  blurBg.style.filter = `blur(${blurValue}px)`;
});

// Gestion des blocs avec image + inversion
const blocks = document.querySelectorAll(".blockBox");

blocks.forEach(block => {
  const img = block.querySelector(".imgBox");
  if (img && img.src) {
    const bgUrl = `url('${img.src}')`;
    block.style.setProperty('--bg-img', bgUrl);
  }
});

blocks.forEach((block, index) => {
  if (index % 2 !== 0) {
    block.classList.add("inverse");
  }
});

// Effet sur services + cercle lumineux
const services = document.querySelectorAll(".service");

services.forEach(service => {
  const deg = Math.floor(Math.random() * 360);
  service.style.background = `linear-gradient(${deg}deg, rgba(61, 82, 192, 0.4) 0%, rgba(51, 51, 57, 0.58) 45%)`;

  const light = service.querySelector(".circle");

  if (window.innerWidth > 1080) {
    service.addEventListener('mousemove', (e) => {
      const rect = service.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      light.style.left = `${x}px`;
      light.style.top = `${y}px`;
      light.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    service.addEventListener('mouseleave', () => {
      light.style.transform = 'translate(-50%, -50%) scale(0)';
    });
  }
});

// Effet glow sur les boutons
const boutons = document.querySelectorAll(".btn");

if (window.innerWidth > 1080) {
  boutons.forEach(btn => {
    const glow = document.createElement("div");
    glow.className = "glow";
    btn.appendChild(glow);

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      glow.style.width = `${btn.offsetWidth}px`;
      glow.style.height = `${btn.offsetWidth}px`;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      glow.style.opacity = '1';
      glow.style.visibility = 'visible';
    });

    btn.addEventListener("mouseleave", () => {
      glow.style.opacity = '0';
      glow.style.visibility = 'hidden';
    });
  })
};

// Affichage des iframes mobiles
const btnViews = document.querySelectorAll('.btnView');
const iframeMobiles = document.querySelectorAll('.iframeMobile');
const containerMobiles = document.querySelectorAll(".iphone");

btnViews.forEach((btnView, index) => {
  const iframeMobile = iframeMobiles[index];
  const containerMobile = containerMobiles[index];
  let siteOuvert = false; // drapeau pour savoir si le site a été ouvert

  btnView.addEventListener('click', () => {
    iframeMobile.style.visibility = 'visible';
    iframeMobile.style.opacity = '1';
    siteOuvert = true; // marque que l'utilisateur a ouvert le site
  });

  containerMobile.addEventListener('mouseleave', () => {
    if (!siteOuvert) { // ne cache l'iframe que si le site n'a pas été ouvert
      iframeMobile.style.opacity = '0';
      iframeMobile.style.visibility = 'hidden';
    }
  });
});

// Envoie de mail
const subjectInput = document.querySelector('.inputSubject');
const messageInput = document.querySelector('.textInput');
const envoyerBtn = document.querySelector('.btnContact');

envoyerBtn.addEventListener('click', () => {
  const subject = subjectInput.value.trim();
  const body = messageInput.value.trim();

  if (!subject || !body) {
    alert("Merci de remplir l'objet et le message avant d'envoyer.");
    return;
  }

  const mailtoLink = `mailto:contact@gnslproduction.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoLink;
});
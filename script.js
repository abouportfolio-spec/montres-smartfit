document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // NAVBAR - Menu toggle + scroll
  // ================================
  const toggle = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navbar = document.querySelector(".navbar");

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        toggle.classList.remove("active");
      });
    });
  }

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    });
  }

  // ================================
  // SCROLL SMOOTH POUR LES ANCRES
  // ================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if(target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ================================
  // ANIMATION DES CARDS AU SCROLL
  // ================================
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .gallery-grid img')
    .forEach(el => {
      el.classList.add('pre-fade');
      observer.observe(el);
    });

  // ================================
  // HEADER ANIMATION AU SCROLL
  // ================================
  const header = document.querySelector('header.hero');
  if(header){
    window.addEventListener('scroll', () => {
      header.style.transition = "padding 0.3s";
      header.style.padding = window.scrollY > 50 ? "50px 20px 30px 20px" : "100px 20px 60px 20px";
    });
  }

  // ================================
  // BOUTONS COMMANDER - TARIFS
  // ================================
  document.querySelectorAll(".pricing-card .btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".pricing-card");
      const modele = card.querySelector("h3").textContent.trim();
      const prixText = card.querySelector(".price").textContent.trim();
      const prix = prixText.replace("€", "").trim();

      // Stockage dans localStorage
      localStorage.setItem("produitSelectionne", modele);
      localStorage.setItem("produitPrix", prix);

      // Redirection vers la page de commande
      window.location.href = "commande.html";
    });
  });

  // ================================
  // FORMULAIRE INSCRIPTION / NEWSLETTER
  // ================================
  const signupForm = document.querySelector(".signup-form");

  if(signupForm){
    const spinner = document.createElement("span");
    spinner.className = "spinner";
    spinner.style.display = "none";
    const submitBtn = signupForm.querySelector("button[type='submit']");
    submitBtn.appendChild(spinner);

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();

      if(!name || !email){
        showMessage("❌ Veuillez remplir tous les champs.", "error");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!emailPattern.test(email)){
        showMessage("❌ Adresse email invalide.", "error");
        return;
      }

      const formData = new FormData(form);
      submitBtn.disabled = true;
      spinner.style.display = "inline-block";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });

        if(response.ok){
          showMessage(`✅ Merci ${name} ! Vous êtes maintenant inscrit.`, "success");
          form.reset();
        } else {
          showMessage("⚠️ Une erreur s’est produite. Veuillez réessayer.", "error");
        }
      } catch(error){
        showMessage("❌ Impossible de se connecter au serveur.", "error");
      } finally {
        submitBtn.disabled = false;
        spinner.style.display = "none";
      }
    });
  }

  // ================================
  // FONCTION SHOW MESSAGE
  // ================================
  function showMessage(text, type="success"){
    let messageBox = document.querySelector(".form-message");
    if(!messageBox){
      messageBox = document.createElement("div");
      messageBox.className = "form-message";
      document.querySelector(".signup-box").appendChild(messageBox);
    }
    const icons = { success: "✅", error: "❌", warning: "⚠️" };
    messageBox.innerHTML = `<span>${icons[type] || ""}</span> ${text}`;
    messageBox.className = `form-message ${type}`;
    messageBox.style.opacity = "1";
    messageBox.style.transform = "translateY(0)";
    setTimeout(() => {
      messageBox.style.opacity = "0";
      messageBox.style.transform = "translateY(20px)";
    }, 4000);
  }

});
document.addEventListener("DOMContentLoaded", () => {

  // ================================
  // 1️⃣ RÉCUPÉRATION DU MODÈLE SÉLECTIONNÉ
  // ================================
  // On tente d'abord de récupérer depuis localStorage
  let modele = localStorage.getItem("produitSelectionne") || null;
  let prix = null;

  // Si pas trouvé, on récupère depuis l'URL
  if (!modele) {
    const params = new URLSearchParams(window.location.search);
    modele = params.get("modele") || "Non spécifié";
    prix = params.get("prix") || "-";
  }

  // ================================
  // 2️⃣ DÉFINITION DES PRODUITS
  // ================================
  const produits = {
    Basic: {
      prix: 49,
      image: "images/montre-basic.jpg",
      specs: [
        "Suivi de pas quotidien",
        "Notifications simples",
        "Autonomie : 2 jours"
      ]
    },
    Standard: {
      prix: 79,
      image: "images/montre-standard.jpg",
      specs: [
        "Suivi complet santé + sommeil",
        "Notifications intelligentes",
        "Design personnalisable",
        "Autonomie : 4 jours"
      ]
    },
    Premium: {
      prix: 129,
      image: "images/montre-premium.jpg",
      specs: [
        "Suivi santé + sommeil + ECG",
        "Applications intégrées",
        "Support prioritaire",
        "Autonomie : 7 jours",
        "Mises à jour exclusives"
      ]
    }
  };

  const produit = produits[modele] || {
    prix: prix || "-",
    image: "images/montre.jpg",
    specs: []
  };

  // ================================
  // 3️⃣ MISE À JOUR DU FORMULAIRE ET APERÇU
  // ================================
  const modeleField = document.getElementById("modele");
  const prixField = document.getElementById("prix");
  const produitNom = document.getElementById("produit-nom");
  const produitPrix = document.getElementById("produit-prix");
  const produitImage = document.getElementById("produit-image");
  const produitFeatures = document.getElementById("produit-features");

  modeleField.value = modele;
  prixField.value = produit.prix;
  produitNom.textContent = `Modèle : ${modele}`;
  produitPrix.textContent = `Prix : ${produit.prix} €`;
  produitImage.src = produit.image;
  produitFeatures.innerHTML = produit.specs.map(f => `<li>${f}</li>`).join("");

  // ================================
  // 4️⃣ GESTION DU FORMULAIRE
  // ================================
  const form = document.getElementById("commande-form");
  const messageBox = document.querySelector(".form-message");

  const spinner = document.createElement("div");
  spinner.className = "spinner";
  spinner.innerHTML = `<div class="dot1"></div><div class="dot2"></div><div class="dot3"></div>`;
  spinner.style.display = "none";
  form.appendChild(spinner);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const tel = form.querySelector('[name="telephone"]').value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(\+?\d{1,4}[\s-]?)?(\d{8,14})$/;

    if (!name || !email) return showMessage("❌ Veuillez remplir tous les champs obligatoires.", "error");
    if (!emailRegex.test(email)) return showMessage("📧 Adresse email invalide.", "error");
    if (tel && !phoneRegex.test(tel)) return showMessage("📞 Numéro de téléphone invalide.", "error");

    spinner.style.display = "inline-block";
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        showMessage(`✅ Merci ${name} ! Votre commande (${modele}) a bien été envoyée.`, "success");

        setTimeout(() => {
          form.reset();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 2000);

        setTimeout(() => {
          window.location.href = "merci.html";
        }, 3000);

      } else {
        showMessage("⚠️ Une erreur s’est produite. Veuillez réessayer.", "error");
      }
    } catch (error) {
      console.error(error);
      showMessage("❌ Erreur de connexion au serveur.", "error");
    } finally {
      spinner.style.display = "none";
      submitBtn.disabled = false;
    }
  });

  // ================================
  // 5️⃣ AFFICHAGE DU MESSAGE
  // ================================
  function showMessage(text, type = "success") {
    messageBox.innerHTML = `<span class="icon">${type === "success" ? "✅" : "❌"}</span> ${text}`;
    messageBox.className = `form-message show ${type}`;
    setTimeout(() => {
      messageBox.classList.remove("show");
    }, 4000);
  }

});
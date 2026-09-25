export function renderOffers(offers, container) {
  const resultsCount = document.querySelector("#results-count");

  resultsCount.textContent = `${offers.length} offres disponibles`;
  if (offers.length === 0) {
    container.innerHTML = `<div class="empty-box">
    <div class="empty-inner">
      <div class="empty-icon">⌕</div>
      <h2>Aucune offre ne correspond à vos critères</h2>
      <p class="muted">
        Essayez de modifier ou réinitialiser vos filtres.
      </p>
    </div>
  </div>`;
    return;
  }
  const cards = offers
    .map((offer) => {
      const contractClass =
        offer.typeContrat === "Stage" ? "badge-stage" : "badge-alternance";
      const initials = offer.entreprise
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase();
      return `

  <article class="card job-card">

    <div class="job-head">

      <div class="job-title-wrap">

        <div class="logo-box">
          ${initials}
        </div>

        <div>
          <h3>${offer.titre}</h3>

          <div class="company-line">
            ${offer.entreprise} • ${offer.ville}
          </div>
        </div>

      </div>

      <span class="badge badge-contract ${contractClass}">
        ${offer.typeContrat}
      </span>

    </div>

    <p class="job-description">
      ${offer.descriptionCourte}
    </p>
            <div class="badges">
                ${offer.technologies
                  .map((technologie) => {
                    return `<span class="badge">${technologie}</span>`;
                  })
                  .join("")}
            </div>
            <div class="job-footer">
                    <div class="job-date">
                        ${offer.datePublication}
                    </div>
                    <div class="job-actions">
                      <a
                          class="btn btn-primary"
                          href="offre-detail.html?id=${offer.id}"
                       >  
                         Voir l'offre →
                      </a>
                    </div>
            </div>
        </article>`;
    })
    .join("");
  container.innerHTML = cards;
}

export function renderLoading(container) {
  container.innerHTML = `
     <div class="empty-box">
            <div class="empty-inner">
                <p>Chargement des offres...</p>
            </div>
        </div>
    `;
}
export function renderError(container) {
  container.innerHTML = `
     <div class="empty-box">
            <div class="empty-inner">
                <p>Impossible de charger les offres</p>
            </div>
        </div>
    `;
}

import { fetchOffers } from "./data.js";
import { renderOffers, renderLoading, renderError } from "./render.js";
import { getFollowedOfferIds, toggleFollowOffer } from "./storage.js";

const container =
  document.querySelector(".saved-grid") ||
  document.querySelector("#saved-container");
let followedOffers = [];

function updateFollowedBadge() {
  const badge = document.querySelector('a[href="offres-suivies.html"]');
  if (!badge) return;
  const count = getFollowedOfferIds().length;
  badge.textContent = `Offres suivies (${count})`;
}

async function initSuivies() {
  try {
    renderLoading(container);

    // 1. Fetch all offers and read followed IDs from localStorage
    const allOffers = await fetchOffers();
    const followedIds = getFollowedOfferIds();

    // 2. Filter offers whose IDs are in localStorage
    followedOffers = allOffers.filter((offer) =>
      followedIds.includes(Number(offer.id)),
    );

    // 3. Render the followed offers or an empty state message
    if (followedOffers.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Vous n'avez pas encore d'offres suivies.</p>
          <a href="index.html" class="btn btn-primary">Explorer les offres</a>
        </div>
      `;
    } else {
      renderOffers(followedOffers, container);
    }

    updateFollowedBadge();

    // 4. Handle unfollowing directly from this page
    container.addEventListener("click", (e) => {
      const followBtn = e.target.closest(".btn-follow");
      if (!followBtn) return;

      const offerId = Number(followBtn.dataset.id);
      toggleFollowOffer(offerId);

      // Re-filter and re-render without reloading the page
      const updatedIds = getFollowedOfferIds();
      followedOffers = followedOffers.filter((o) => updatedIds.includes(o.id));

      if (followedOffers.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <p>Vous n'avez plus d'offres suivies.</p>
            <a href="index.html" class="btn btn-primary">Explorer les offres</a>
          </div>
        `;
      } else {
        renderOffers(followedOffers, container);
      }

      updateFollowedBadge();
    });
  } catch (error) {
    console.error(error);
    renderError(container);
  }
}

initSuivies();
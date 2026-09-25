/**
 * suivi.js — Handles the "follow/unfollow" star button on any page.
 * Works with localStorage via the same key used in storage.js.
 */

const STORAGE_KEY = "followed_job_offers";

function getFollowedIds() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveFollowedIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function isFollowed(id) {
  return getFollowedIds().includes(Number(id));
}

function toggleFollow(id) {
  const idNum = Number(id);
  let ids = getFollowedIds();
  if (ids.includes(idNum)) {
    ids = ids.filter(i => i !== idNum);
  } else {
    ids.push(idNum);
  }
  saveFollowedIds(ids);
  return ids.includes(idNum);
}

// Apply correct visual state to all stars on the page
function refreshAllStars() {
  document.querySelectorAll(".btn-suivi").forEach(function (btn) {
    const id = btn.getAttribute("data-id");
    if (isFollowed(id)) {
      btn.classList.add("followed");
      btn.title = "Ne plus suivre";
    } else {
      btn.classList.remove("followed");
      btn.title = "Suivre cette offre";
    }
  });
}

// Listen for clicks on any star button (event delegation)
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-suivi");
  if (!btn) return;

  e.preventDefault();
  const id = btn.getAttribute("data-id");
  const nowFollowed = toggleFollow(id);

  if (nowFollowed) {
    btn.classList.add("followed");
    btn.title = "Ne plus suivre";
  } else {
    btn.classList.remove("followed");
    btn.title = "Suivre cette offre";
  }
});

// On page load, mark stars that are already followed
document.addEventListener("DOMContentLoaded", refreshAllStars);

const STORAGE_KEY = "followed_job_offers";

export function getFollowedOfferIds() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

export function isOfferFollowed(offerId) {
  const ids = getFollowedOfferIds();
  return ids.includes(Number(offerId));
}

export function toggleFollowOffer(offerId) {
  const idNum = Number(offerId);
  let ids = getFollowedOfferIds();

  if (ids.includes(idNum)) {
    ids = ids.filter(id => id !== idNum);
  } else {
    ids.push(idNum);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return ids;
}
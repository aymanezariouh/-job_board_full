export async function fetchOffers() {
  const response = await fetch('./data/offers.json');
  if (!response.ok) {
    throw new Error("Failed to fetch offers");
  }
  const data = await response.json();
  return data;
}
async function fetchOfferById(id) {
  const offers = await fetchOffers();
  const offerById = offers.find((offer) => (offer.id === id));

  if(!offerById){
    throw new Error('Failed to fetch offer by id');
  }
  return offerById;
}

// async function test(){
//     const offer = await fetchOfferById(3);
//     console.log(offer);
// }
// test();
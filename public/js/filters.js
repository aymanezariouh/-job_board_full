export const filterState = {
  search: "",
  ville: "all",
  typeContrat: "all",
  technologies: "all",
  sortBy: "recent",
};

export function applyFilters(offers, state) {
  const query = state.search.trim().toLowerCase();

  return offers.filter((offer) => {
    const matchesContract =
      state.typeContrat === "all" ||
      offer.typeContrat.toLowerCase() === state.typeContrat.toLowerCase();

    const matchesCity =
      state.ville === "all" ||
      offer.ville.toLowerCase() === state.ville.toLowerCase();

    const matchesTech =
      state.technologies === "all" ||
      offer.technologies.some(
        (item) => item.toLowerCase() === state.technologies.toLowerCase(),
      );

    const matchesSearch =
      query === "" || offer.titre.toLowerCase().includes(query);

    return matchesContract && matchesCity && matchesTech && matchesSearch;
  });
}
export function applySort(offers, sortBy) {
  const sorted = [...offers];

  switch (sortBy) {
    case "recent":
      return sorted.sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
    case "oldest":
      return sorted.sort((a, b) => new Date(a.datePublication) - new Date(b.datePublication));
    default:
      return sorted;
  }
}
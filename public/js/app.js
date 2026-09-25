import { fetchOffers } from "./data.js";
import { renderOffers, renderLoading, renderError } from "./render.js";
import { filterState, applyFilters, applySort } from "./filters.js";

// 2. Select the sort dropdown
const sortSelect = document.querySelector("#sort-select");

// Select your HTML container element
const container = document.querySelector("#offers-container"); // Adjust selector to match your HTML
const searchInput = document.querySelector("#search-input");
const citySelect = document.querySelector("#filter-city");
const techSelect = document.querySelector("#filter-tech");
const contractSelect = document.querySelector("#filter-contract");
const filterForm = document.querySelector(".search-panel");
let allOffers = [];
function updateUI() {

  filterState.search = searchInput.value;
  filterState.ville = citySelect.value;
  filterState.technologies = techSelect.value;
  filterState.typeContrat = contractSelect.value;
  filterState.sortBy = sortSelect.value;

  const filtered = applyFilters(allOffers, filterState);
  const sortedAndFiltered = applySort(filtered, filterState.sortBy);

  renderOffers(sortedAndFiltered, container);
}
function populateDropdowns(offers) {
  // 1. Extract unique values using Set
  const cities = [...new Set(offers.map(o => o.ville))];
  const contracts = [...new Set(offers.map(o => o.typeContrat))];
  const techs = [...new Set(offers.flatMap(o => o.technologies))];

  const addOptions = (selectElement, items) => {
    items.forEach(item => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      selectElement.appendChild(option);
    });
  };

  addOptions(citySelect, cities);
  addOptions(contractSelect, contracts);
  addOptions(techSelect, techs);
}
async function init() {
  try {
    renderLoading(container);
    allOffers = await fetchOffers();
    populateDropdowns(allOffers);
    renderOffers(allOffers, container);
    searchInput.addEventListener("input", updateUI);
    citySelect.addEventListener("change", updateUI);
    techSelect.addEventListener("change", updateUI);
    contractSelect.addEventListener("change", updateUI);
    sortSelect.addEventListener("change", updateUI);

    filterForm.addEventListener("reset", () => {
      setTimeout(updateUI, 0);})
  } catch (error) {
    console.error(error);
    renderError(container);
  }
}

init();

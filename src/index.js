import 'normalize.css';
import "./styles.scss";
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

const appState = {
  currentPage: 1,
  currentQuery: `query=europe+travel`,
  currentSlug: window.location.pathname.split('/').pop(),
};

const navLink = document.querySelector(".nav__link");
const navList = document.querySelector(".nav__list");
const navItems = ()=> document.querySelectorAll(".nav__item");
const cardContainer = document.querySelector(".cardview__list");
const loader = document.querySelector('#loader-img');
const baseUrl = window.location.origin + window.location.pathname;


// TODO:
// it should check if value in country parameter is valid (exists in the countries list)
// so ?country=Balballand shouldn't work and show some error or redirect to homepage
// check if you can get more relevant photos from API
// styling
// refactor code/build components

const url =
  "https://api.unsplash.com/search/photos?client_id=NS13mj0sVH6N_4Kr1aqWk8HGMKURbwFwqL3zMn3R0Wk";
const countriesUrl = "https://run.mocky.io/v3/8e202a27-21a6-4e16-9300-1cf7c848dde7";
const createUrl = ({page, query}) => `${url}&query=${query}&page=${page}`;
const createCard = ({ imageUrl, description, credit }) => `
  <a class="card grid-item" href="${imageUrl}">
      <img
      class="card__image"
      src="${imageUrl}"
      />
      <div class="card__info">
        <span class="card__description">"${description}"</span>
        <span class="card__credit">Photo by ${credit}</span>
      </div>
  </a>
  `;
const createCountry = (countryName) => `
  <li class="nav__item">${countryName}</li>
`;

function init() {
  getCountries(); 
  getPhotos();
}

async function getPhotos() {
  // Todo: refactor the loader code
  loader.style.display = "block";
  try {
    const response = await fetch(createUrl({page: appState.currentPage, query: appState.currentQuery}));
    const data = await response.json();
    data.results
      // get only those with description
      .filter(el => el.description || el.alt_description)
      .map(el =>
        createCard({
          imageUrl: el.urls.small,
          description: el.description || el.alt_description,
          credit: el.user.name
        })
      )
      .forEach(cardContent => {
        // found it here: https://davidwalsh.name/convert-html-stings-dom-nodes
        const card = document.createRange().createContextualFragment(cardContent);
        cardContainer.appendChild(card);
      });
      loader.style.display = "none";
  } catch (error) {
    console.log(error);
  }
  initializeMasonry();
}

async function getCountries() {
  try{
    const response = await fetch(countriesUrl);
    const data =  await response.json();
    data.countries
    .map(el => createCountry(el))
    .forEach(countryContent => {
      const country = document.createRange().createContextualFragment(countryContent);
      document.querySelector('.nav__list').appendChild(country);
    });

    // convert NodeList to array
    [...navItems()].forEach((country)=>{
      country.addEventListener('click', () => {
        let countrySlug = appState.currentSlug;
        countrySlug = '';
        countrySlug += country.innerHTML;
        window.location.href = baseUrl + '#' + countrySlug;
        appState.currentQuery = '';
        appState.currentQuery = `query=${countrySlug}`;
        document.querySelectorAll(".cardview__list .card")
        .forEach(card => {cardContainer.removeChild(card);});
        getPhotos();
      });
    });
    
  } catch (error) {
    console.log(error);
  }
}

function initializeMasonry() {
    const grid = document.querySelector('.grid');
    const msnry = new Masonry( grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true,
        gutter: 10
    });

    imagesLoaded( grid ).on( 'progress', function() {
    // layout Masonry after each image loads
    msnry.layout();
    });
}

// infinite scroll
window.addEventListener('scroll', function() {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    appState.currentPage++;
    getPhotos();
  }
});


// toggle countries dropdown
navLink.addEventListener('click', () => {
  navLink.classList.toggle('is-active');
  navList.classList.toggle('is-active');   
});

window.addEventListener('click', (event) => {
  const isNavList = navList.contains(event.target);
  const isNavLink = navLink.contains(event.target);

  if(!isNavList && !isNavLink) {
    navLink.classList.remove('is-active');
    navList.classList.remove('is-active');
  }
});


init();



import 'normalize.css';
import "./styles.scss";
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

const url =
  "https://api.unsplash.com/search/photos?client_id=NS13mj0sVH6N_4Kr1aqWk8HGMKURbwFwqL3zMn3R0Wk&per_page=80&query=europe";

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

async function getPhotos() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    data.results
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
        document.querySelector(".cardview__list").appendChild(card);
      });
  } catch (error) {
    console.log(error);
  }
  initializeMasonry();
}

function initializeMasonry() {
    const grid = document.querySelector('.grid');
    const msnry = new Masonry( grid, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true
    });

    imagesLoaded( grid ).on( 'progress', function() {
    // layout Masonry after each image loads
    msnry.layout();
    });
}

getPhotos();

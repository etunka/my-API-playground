import 'normalize.css';
import "./styles.scss";

const url =
  "https://api.unsplash.com/search/photos?client_id=NS13mj0sVH6N_4Kr1aqWk8HGMKURbwFwqL3zMn3R0Wk&per_page=20&query=europe";

const createCard = ({ imageUrl, description, credit }) => `
  <a class="card" href="${imageUrl}">
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
}

getPhotos();

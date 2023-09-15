export default function getEpisodes() {
    return fetch('https://rickandmortyapi.com/api/episode/')
      .then((res) => res.json())
      .then((json) => json.results);
  }
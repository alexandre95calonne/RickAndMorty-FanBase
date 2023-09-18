export default async function getEpisodes(page = 1) {
    const res = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
    const json = await res.json();
    return json;
  }
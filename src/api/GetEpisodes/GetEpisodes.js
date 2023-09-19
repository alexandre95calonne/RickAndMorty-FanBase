export default async function getEpisodes(page) {
  if (page) {
    const response = await fetch(`https://rickandmortyapi.com/api/episode?page=${page}`);
    const data = await response.json();
    return data.results;
  } else {
    const response = await fetch('https://rickandmortyapi.com/api/episode');
    const data = await response.json();
    const pages = data.info.pages;
    const promises = Array.from({ length: pages }, (_, i) =>
      fetch(`https://rickandmortyapi.com/api/episode?page=${i + 1}`).then(res => res.json())
    );
    const allPages = await Promise.all(promises);
    const allEpisodes = allPages.flatMap(page => page.results);
    return allEpisodes;
  }
}

export default async function fetchAllEpisodes() {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/episode`);
    const data = await response.json();
    const totalPages = data.info.pages;
    const allEpisodes = await Promise.all(
      Array.from({ length: totalPages }, (_, i) => i + 1)
        .map(page => fetch(`https://rickandmortyapi.com/api/episode?page=${page}`)
          .then(res => res.json())
          .then(data => data.results)
        )
    );
    return allEpisodes.flat();
  } catch (error) {
    throw error;
  }
}
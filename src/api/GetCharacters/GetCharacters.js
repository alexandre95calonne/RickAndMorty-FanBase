export default async function getAllCharacters() {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        const data = await response.json();
        const totalPages = data.info.pages;
        const allCharacters = await Promise.all(
            Array.from({ length: totalPages }, (_, i) => i + 1)
                .map(page => fetch(`https://rickandmortyapi.com/api/character?page=${page}`)
                    .then(res => res.json())
                    .then(data => data.results)
                )
        );
        return allCharacters.flat();
    } catch (error) {
        console.error('Une erreur est survenue :', error);
        return [];
    }
}

async function fetchData () {
    const response = await fetch('data/recipes.json')
    return await response.json()
  }
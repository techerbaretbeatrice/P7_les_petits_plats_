const params = (new URL(document.location)).searchParams
const recipeId = params.get('recipe')

const mainInput = document.getElementById('main-search')
mainInput.value = location.hash.replace('#', '')
mainInput.addEventListener('keyup', (event) => {

    const mainField = mainInput.value
    console.log(mainInput.value)

    location.hash = mainField
    Display()



})
const search = (recipes) => {
    // retourne la liste des recettes filtrée
    const word = location.hash.replace("#", "")
    const ingredientValue = params.get('ingredients')
    console.info("aaa", ingredientValue)
    const ingredientsList = ingredientValue?.split(',')
    const appliancesItem = params.get('appliances')
    const ustensilValue = params.get('ustensils')
    const ustensilsList = ustensilValue?.split(',')
    console.info("avec", appliancesItem)
    console.info("mais", ustensilsList)
    console.info("moins", ingredientsList)
    console.info("plus", word)
    const filteredRecipes = recipes.filter(recipe => {
        if (recipe.name.toLowerCase().includes(word.toLowerCase())
            || recipe.description.toLowerCase().includes(word.toLowerCase())
            || recipe.ingredients.find(ingredient => ingredient.ingredient.toLowerCase().includes(word.toLowerCase()))

        ) {
            if (ingredientsList !== undefined
                && ingredientsList.length > 0
                && ingredientsList.filter(
                    item => recipe.ingredients.find(
                        ingredient => ingredient.ingredient.toLowerCase() == item.toLowerCase()
                    )
                ).length < ingredientsList.length - 1
            ) {
                return false
            }
            if (appliancesItem
                && appliancesItem !== ""
                && appliancesItem !== recipe.appliance
            ) {
                return false
            }
            if (ustensilsList !== undefined
                && ustensilsList.length > 0
                && ustensilsList.filter(
                    item => recipe.ustensils.find(
                        ustensil => ustensil.toLowerCase() == item.toLowerCase()
                    )
                ).length < ustensilsList.length - 1
            ) {
                return false
            }


            return true
        }
    })


    return filteredRecipes
}


const Display = async () => {

    // eslint-disable-next-line no-undef
    const data = await fetchData()
    // transformer en let, parce qu'on va modifier la liste avec la recherche
    let recipes = data.recipes
    console.log(data)
    console.log(recipes)
    location.hash

    console.log("plus", search(recipes))
    if (location.hash.replace("#", '').length >= 3
        || Array.from(params.values()).length > 0
    ) {
        recipes = search(recipes)
    }
    const tagDisplay = document.createElement('div')
    tagDisplay.setAttribute('class', 'tag-display')
    const tagResearchContainer = document.createElement('div')
    tagResearchContainer.setAttribute('id', 'tag-research-container')
    document.getElementById('heading-filters').textContent = ''
    document.getElementById('heading-filters').appendChild(tagDisplay)
    document.getElementById('heading-filters').appendChild(tagResearchContainer)
    const ingredientList = new Set()
    console.log(ingredientList)
    const applianceList = new Set()
    const ustensilList = new Set()
    recipes.forEach(recipe => recipe.ingredients.forEach(ingredient => ingredientList.add(ingredient.ingredient)))
    recipes.forEach(recipe => applianceList.add(recipe.appliance))
    recipes.forEach(recipe => recipe.ustensils.forEach(ustensil => ustensilList.add(ustensil)))
    const ingredientFilter = SelectFilter("Ingredients", ingredientList, "ingredients", true)
    const applianceFiter = SelectFilter('Appareils', applianceList, 'appliances', false)
    const ustensilFilter = SelectFilter('Ustensiles', ustensilList, 'ustensils', true)
    const recipesList = RecipesList(recipes)
    TagList()
    tagDisplay.appendChild(TagList())
    tagResearchContainer.appendChild(ingredientFilter)
    tagResearchContainer.appendChild(applianceFiter)
    tagResearchContainer.appendChild(ustensilFilter)
    document.getElementById('main').textContent = ''
    document.getElementById('main').appendChild(recipesList)

}




const Tag = (tag, type, multiple) => {
    const tagElement = document.createElement('div')
    tagElement.setAttribute('class', 'tag')
    tagElement.textContent = tag
    tagElement.addEventListener('click', (evt) => {
        console.log(tag, type)
        const url = new URL(document.location.href)
        console.log("search", url)
        const params = new URLSearchParams(url.search)
        if (multiple) {
            const values = params.get(type) || ''
            console.log(values)
            const valueSet = new Set(values.split(','))
            console.log(valueSet)
            valueSet.add(tag)
            const newTag = Array.from(valueSet.values()).join(',')
            params.set(type, newTag)
        } else {
            params.set(type, tag)
        }
        location.href = "?" + params.toString() + location.hash
    })
    return tagElement
}

const SelectFilter = (title, dataList, dataType, multiple) => {
    let opened = false
    const selectFilter = document.createElement('div')
    selectFilter.setAttribute('class', `btn-filter ${dataType} opened-${opened}`)
    const iconOpen = document.createElement('i')
    iconOpen.setAttribute('class', 'fa-solid fa-angle-down white')
    const filterDisplay = document.createElement('div')
    filterDisplay.setAttribute('class', `filter-display ${dataType}`)
    for (let item of dataList) {
        const tag = Tag(item, dataType, multiple)
        filterDisplay.appendChild(tag)
    }
    const placeholder = document.createElement('span')
    placeholder.setAttribute('class', 'placeholder')
    placeholder.textContent = title
    const inputPlaceholder = ` ${title}`
    console.log(inputPlaceholder)
    const newInputPlaceholder = inputPlaceholder.substring(0, inputPlaceholder.length - 1)
    console.log(newInputPlaceholder)
    const input = document.createElement('input')
    input.setAttribute('class', 'form')
    input.setAttribute('placeholder', `Rechercher un ${newInputPlaceholder.toLowerCase()}`)
    const controlGroup = document.createElement('div')
    controlGroup.setAttribute('class', 'control-group')
    selectFilter.appendChild(controlGroup)
    controlGroup.appendChild(placeholder)
    controlGroup.appendChild(iconOpen)
    controlGroup.appendChild(input)
    selectFilter.appendChild(filterDisplay)

    iconOpen.addEventListener('click', openSelectContainerControl)
    function openSelectContainerControl(ev) {
        if (opened) {
            opened = false
            iconOpen.style.transform = 'rotate(0deg)'
            input.style.display = 'none'
            placeholder.style.display = 'flex'
            filterDisplay.style.display = 'none'
            selectFilter.setAttribute('class', `btn-filter ${dataType} opened-${opened}`)
        } else {
            opened = true
            iconOpen.style.transform = 'rotate(180deg)'
            input.style.display = 'flex'
            placeholder.style.display = 'none'
            filterDisplay.style.display = 'flex'
            selectFilter.setAttribute('class', `btn-filter ${dataType} opened-${opened}`)
        }
    }

    input.addEventListener('keyup', inputSearch)
    function inputSearch(event) {
        const inputField = input.value
        filterDisplay.textContent = ""
        console.log(inputField)
        console.log(event)
        const list = Array.from(dataList)
        const filteredList = list.filter(item => item.toLowerCase().includes(inputField.toLowerCase()))
        filteredList.forEach(item => {
            const tag = Tag(item, dataType, multiple)
            filterDisplay.appendChild(tag)
        })

    }
    return selectFilter
}

const TagList = () => {
    const ingredientTags = (params.get('ingredients') || '').split(',')
    const applianceTags = (params.get('appliances') || '')
    const ustensilTags = (params.get('ustensils') || '').split(',')
    const tagList = document.createElement('div')
    tagList.setAttribute('class', 'tag-list')
    for (let tag of ingredientTags) {
        if (tag !== '') {
            tagList.appendChild(TagBtn('ingredients', tag))
        }
    }
    if (applianceTags !== '') {
        tagList.appendChild(TagBtn('appliances', applianceTags))
    }
    for (let tag of ustensilTags) {
        if (tag !== '') {
            tagList.appendChild(TagBtn('ustensils', tag))
        }
    }


    return tagList
}

const TagBtn = (type, value) => {
    const tagBtn = document.createElement('div')
    tagBtn.setAttribute('class', `tag-btn ${type}`)
    tagBtn.textContent = value
    const tagBtnClose = document.createElement('i')
    tagBtnClose.setAttribute('class', 'fa-regular fa-circle-xmark tag-close-white')
    tagBtn.appendChild(tagBtnClose)
    tagBtnClose.addEventListener('click', tagClose)
    function tagClose() {
        const url = new URL(document.location.href)
        const params = new URLSearchParams(url.search)
        const values = params.get(type) || ''
        console.log(values)
        const valueList = values.split(',')
        console.log(valueList)
        const filteredList = valueList.filter((item) => item !== value)
        console.log(filteredList)
        const newTag = filteredList.join(',')
        params.set(type, newTag)
        console.log(params.get(type))
        location.href = "?" + params.toString() + location.hash
    }

    return tagBtn
}
const RecipesList = (recipes) => {
    const recipesList = document.createElement('div')
    recipesList.setAttribute('id', 'recipe-list')
    for (const recipe of recipes) {
        const card = Card(recipe)
        recipesList.appendChild(card)
    }
    return recipesList
}

const Card = (recipe) => {
    const card = document.createElement('div')
    card.setAttribute('id', 'recipe-card')
    card.setAttribute('class', 'card')
    const cardImage = document.createElement('img')
    cardImage.setAttribute('class', 'card-img-top')
    cardImage.setAttribute('alt', 'Card image cap')
    cardImage.src = 'assets/images/img.jpg'
    const cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body')
    const labelBox = document.createElement('div')
    labelBox.setAttribute('class', 'label-box')
    const cardBodyLabel = CardBodyLabel(recipe)
    const cardBodyPreparationTime = CardBodyPreparationTime(recipe)
    const preparationBox = document.createElement('div')
    preparationBox.setAttribute('class', 'preparation-box')
    const ingredientList = IngredientList(recipe)
    const recipeDescription = RecipeDescription(recipe)
    card.appendChild(cardImage)
    card.appendChild(cardBody)
    cardBody.appendChild(labelBox)
    cardBody.appendChild(preparationBox)
    labelBox.appendChild(cardBodyLabel)
    labelBox.appendChild(cardBodyPreparationTime)
    preparationBox.appendChild(ingredientList)
    preparationBox.appendChild(recipeDescription)
    console.log(card)
    return card
}

const CardBodyLabel = (recipe) => {
    const cardBodyLabel = document.createElement('label')
    cardBodyLabel.textContent = recipe.name
    console.log(cardBodyLabel)
    return cardBodyLabel
}

const CardBodyPreparationTime = (recipe) => {
    const cardBodyPreparationTime = document.createElement('div')
    cardBodyPreparationTime.setAttribute('class', 'preparation-time')
    const iconTime = document.createElement('i')
    iconTime.setAttribute('class', 'fa-regular fa-clock black')
    cardBodyPreparationTime.appendChild(iconTime)
    const timer = document.createElement('span')
    timer.setAttribute('class', 'timer')
    timer.textContent = `${recipe.time} min`
    cardBodyPreparationTime.appendChild(timer)
    cardBodyPreparationTime.appendChild(timer)
    return cardBodyPreparationTime
}

const IngredientList = (recipe) => {
    const ingredientList = document.createElement('ul')
    ingredientList.setAttribute('class', 'ingredient-list')
    const ingredients = recipe.ingredients
    for (const ingredient of ingredients) {
        const ingredientItem = IngredientItem(ingredient)
        ingredientList.appendChild(ingredientItem)
    }

    return ingredientList
}

const IngredientItem = (ingredient) => {
    const ingredientItem = document.createElement('Li')
    ingredientItem.setAttribute('class', 'ingredient-item')
    const ingredientLabel = document.createElement('span')
    ingredientLabel.setAttribute('class', 'ingredient-label')
    ingredientLabel.textContent = `${ingredient.ingredient}`
    const ingredientQuantity = document.createElement('span')
    ingredientQuantity.setAttribute('class', 'ingredient-quantity')
    ingredientQuantity.textContent = `: ${ingredient.quantity || ''}`
    const ingredientUnit = document.createElement('span')
    ingredientUnit.setAttribute('class', 'ingredient-unit')
    ingredientUnit.textContent = `${ingredient.unit || ''}`
    const convert = ingredient.unit
    console.log(convert)
    if (convert === 'grammes') {
        const convertUnit = convert.replace('grammes', 'g')
        console.log(convertUnit)
        ingredientUnit.textContent = convertUnit
    }
    ingredientItem.appendChild(ingredientLabel)
    ingredientItem.appendChild(ingredientQuantity)
    ingredientItem.appendChild(ingredientUnit)

    return ingredientItem
}

const RecipeDescription = (recipe) => {
    const recipeDescription = document.createElement('div')
    recipeDescription.setAttribute('class', 'recipe-description')
    const descriptionItem = document.createElement('p')
    descriptionItem.setAttribute('class', 'description-item')
    const descriptionString = `${recipe.description}`
    let stringSplit = descriptionString.substring(0, 150) + '...'
    if (descriptionString.length < 200) {
        stringSplit = descriptionString
    }
    descriptionItem.textContent = stringSplit
    recipeDescription.appendChild(descriptionItem)
    console.log(stringSplit)
    return recipeDescription

}

Display()
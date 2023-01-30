const main = document.querySelector('.container');
const form = main.querySelector('.container__form');
const input = main.querySelector('.container__input');
const listComplete = main.querySelector('.container__list-complete');
const listRepositories = main.querySelector('.container__list-repositories');


input.addEventListener('input', () => {
    if (input.value)
        debouncedSearch(input.value);
    else
        clearAutocomplete();
})

listComplete.addEventListener('click', (event) => {
    if (event.target.className !== 'container__item-complete') 
        return;
    addSearchResultItem(event.target.dataset);
    input.value = '';
    clearAutocomplete();
})

listRepositories.addEventListener('click', (event) => {
    if (event.target.className === 'container__btn-close') event.target.parentElement.remove();
})

function showAutocomplete(items) {
    if (items.length) {
        clearAutocomplete();
        items.forEach((e) => listComplete.appendChild(createAutocompleteItem(e)));
        form.classList.add('container__form--active');
    }
}

function clearAutocomplete() {
    while (listComplete.firstChild) {
        listComplete.removeChild(listComplete.firstChild);
        form.classList.remove('container__form--active');
    }
}

function createAutocompleteItem(dataset) {
    let item = document.createElement('button');
    item.classList.add('container__item-complete');
    item.textContent = dataset.name;
    item.dataset.name = dataset.name;
    item.dataset.owner = dataset.owner;
    item.dataset.stars = dataset.stars;
    return item;
}

function addSearchResultItem(dataset) {
    let item = document.createElement('li');
    item.classList.add('container__item-repositories');
    item.innerHTML = `Name: ${dataset.name}<br>Owner: ${dataset.owner}<br>Stars: ${dataset.stars}`;
    let remove = document.createElement('button');
    remove.classList.add('container__btn-close');
    item.appendChild(remove);
    listRepositories.appendChild(item);
}

function search(value) {
    fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
    .then(res => res.json())
    .then(res => res.items.map((e) => ({name: e.name, owner: e.owner.login, stars: e.stargazers_count})))
    .then(items => showAutocomplete(items))
}

const debouncedSearch = debounce(search, 2000);

function debounce(cb, debounceTime) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => cb.apply(this, arguments), debounceTime);
    }
}
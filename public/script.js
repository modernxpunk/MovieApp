let activePage = 1

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = "api_key=c1b842ef528e839d8688c74daa7f14d6"
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original"



const BUTTON_POPULAR = `${BASE_URL}/discover/movie?${API_KEY}&sort_by=vote_average.desc&page=${activePage}`



const API_URL = `${BASE_URL}/discover/movie?page=${activePage}&${API_KEY}`

const films = document.querySelector('.films')
const pages = document.querySelectorAll('.page')
const next_button = document.querySelector('.next_button')
const paginationPages = document.querySelector('.pages')
const previous_button = document.querySelector('.previous_button')

const getMovie = async url => await fetch(url).then(res => res.json())

function createNode(name) {
	const node = document.createElement('div')
	node.className = name
	return node
}

function addInnerCard(card, film) {
	card.innerHTML += `
		<div
			class="backgroundImage"
			style="
				background: url(${BASE_IMAGE_URL + film.poster_path}) no-repeat center center / cover;
				border-top-right-radius: 10px;
				border-top-left-radius: 10px;
			">
		</div>
		<div class="info">
			<div class="filmName"><p class="filmTitle">${film.title}</p></div>
			<div class="score">
				<div class="views">
					<span class="vote_average">
						${film.vote_average}(${film.vote_count})
						<img src="images/star.svg">
					</span>
				</div>
				<div class="mark">
					<span class="vote_count">
						${film.popularity}
						<img src="images/popularity.svg">
					</span>
				</div>
			</div>
		</div>
	`
	return card 
}

function readFilms(page) {
	getMovie(API_URL).then(data => {
		for (film of data.results) {
			films.append(addInnerCard(createNode('card'), film))
		}
	})
}
readFilms(activePage)

function editFilms(page, API) {
	getMovie(API).then(data => {
		const card = document.querySelectorAll('.card')
		const films = data.results
		const imgStar = `<img src="images/star.svg">`
		const imgPopular = `<img src="images/popularity.svg">`
		for (let i = 0; i < films.length; i++) {
			const film = films[i]
			card[i].querySelector('.backgroundImage').style.backgroundImage = `url(${BASE_IMAGE_URL + film.poster_path})`
			card[i].querySelector('.filmTitle').innerHTML = film.title
			card[i].querySelector('.vote_average').innerHTML = film.vote_average + imgStar
			card[i].querySelector('.vote_count').innerHTML = film.vote_count + imgPopular
		}
	})
}

function removeColor(pages) {
	for (page of pages)
		if (page.classList[1] === "active")
			page.classList.remove('active')
}

function addColor(pages) {
	for (page of pages)
		if (activePage === Number(page.innerHTML))
			page.classList.add('active')
}

function changePage(pages, activePage) {
	if (activePage < 5) {
		pages[0].innerHTML = 1
		pages[1].innerHTML = 2
		pages[2].innerHTML = 3
		pages[3].innerHTML = 4
		pages[4].innerHTML = 5
		pages[5].innerHTML = "..."
		pages[6].innerHTML = 500
	} else if (activePage >= 5 && activePage < 497) {
		pages[0].innerHTML = 1
		pages[1].innerHTML = "..."
		pages[2].innerHTML = activePage - 1
		pages[3].innerHTML = activePage
		pages[4].innerHTML = activePage + 1
		pages[5].innerHTML = "..."
		pages[6].innerHTML = 500
	} else {
		pages[0].innerHTML = 1
		pages[1].innerHTML = "..."
		pages[2].innerHTML = 496
		pages[3].innerHTML = 497
		pages[4].innerHTML = 498
		pages[5].innerHTML = 499
		pages[6].innerHTML = 500
	}
}

function howChange(change, curPage) {
	activePage = change !== 0 ? activePage + change : curPage

	removeColor(pages)
	changePage(pages, activePage)
	addColor(pages)

	let API = `${BASE_URL}/discover/movie?page=${activePage}&${API_KEY}`

	editFilms(activePage, API)
}


previous_button.addEventListener('click', () => {
	if (activePage !== 1)
		howChange(-1)
})

paginationPages.addEventListener('click', e => {
	const curPage = Number(e.target.innerHTML)
	if (!isNaN(curPage) && curPage !== activePage)
		howChange(0, curPage)
})

next_button.addEventListener('click', () => {
	if (activePage !== 500)
		howChange(1)
})
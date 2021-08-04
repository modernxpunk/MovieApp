let activePage = 1

const BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = "api_key=c1b842ef528e839d8688c74daa7f14d6"
const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/original"

const BUTTON_POPULAR = `${BASE_URL}/discover/movie?${API_KEY}&sort_by=vote_average.desc&page=${activePage}`

const API_URL = `${BASE_URL}/discover/movie?page=${activePage}&${API_KEY}`
const getMovie = async url => await fetch(url).then(res => res.json())
const films = document.querySelector('.films')

getMovie(API_URL).then(data => {
	for (film of data.results) {
		films.append(addInnerCard(createNode('card'), film))
	}
})

const pages = document.querySelectorAll('.page')
const next_button = document.querySelector('.next_button')
const paginationPages = document.querySelector('.pages')
const previous_button = document.querySelector('.previous_button')


function createNode(name) {
	const node = document.createElement('div')
	node.className = name
	return node
}

function addInnerCard(card, film) {
	card.id = film.id
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
					</span>
					<img src="images/star.svg">
				</div>
				<div class="mark">
					<span class="vote_count">
						${film.popularity}
					</span>
					<img src="images/popularity.svg">
				</div>
			</div>
		</div>
	`
	return card 
}

function editFilms(page, API) {
	getMovie(API).then(data => {
		const card = document.querySelectorAll('.card')
		const films = data.results
		for (let i = 0; i < 20; i++) {
			const film = films[i]
			if (film) {
				card[i].id = film.id
				card[i].querySelector('.backgroundImage').style.backgroundImage = `url(${BASE_IMAGE_URL + film.poster_path})`
				card[i].querySelector('.filmTitle').innerHTML = film.title
				card[i].querySelector('.vote_average').innerHTML = `${film.vote_average}(${film.vote_count})`
			} else {
				card[i].innerHTML = ''
			}
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

function showPages(pages, activePage) {
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

function changeAPIpage(API, curentPage) {
	let numberPage = +API.slice(API.indexOf('page=') + 5, API.indexOf('&'))
	return API.replace(`page=${numberPage}`, `page=${curentPage}`)
}

function howChange(change, currentPage=activePage) {
	activePage = change !== 0 ? activePage + change : currentPage

	removeColor(pages)
	showPages(pages, activePage)
	addColor(pages)

	editFilms(activePage, changeAPIpage(API_URL, activePage))
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

const pagination = document.querySelector('.pagination')
const header = document.querySelector('.header')
const currentFilm = document.querySelector('.film')
const back = document.querySelector('.back')


const defaultFilm = currentFilm.innerHTML


const copy = text => {
	const info = document.createElement('p')
	info.innerText = text
	return info
}

films.addEventListener('click', e => {
	currentFilm.innerHTML = defaultFilm

	document.querySelector('.back').style.display = 'block'
	header.style.display = 'none'
	films.style.display = 'none'
	pagination.style.display = 'none'

	const ID_FILM = e.target.closest('.card').id

	const filmAPI = `${BASE_URL}/movie/${ID_FILM}?${API_KEY}`

	getMovie(filmAPI).then(data => {

		const film_image = document.querySelector('.film_image')
		const film_production_companies = document.querySelector('.film_production_companies')
		const film_production_countries = document.querySelector('.film_production_countries')
		const film_release_date = document.querySelector('.film_release_date')
		const film_status = document.querySelector('.film_status')
		const film_full_name = document.querySelector('.film_full_name')
		const film_rating = document.querySelector('.film_rating')
		const film_voting = document.querySelector('.film_voting')
		const film_desc = document.querySelector('.film_desc')
		const film_genres = document.querySelector('.film_genres')

		film_image.src = `${BASE_IMAGE_URL + data.poster_path}`

		for (production_companies of data.production_companies)
			film_production_companies.innerHTML += `<p>${production_companies.name}</p>`

		for (production_countries of data.production_countries) {
			film_production_countries.innerHTML += `<p>${production_countries.name}</p>`
		}

		film_release_date.append(copy(data.release_date))
		film_status.append(copy(data.status))
		film_full_name.innerHTML = data.title
		film_rating.innerHTML = data.vote_average
		film_voting.innerHTML = data.vote_count
		film_desc.innerHTML = data.overview

		for (genre of data.genres)
			film_genres.innerHTML += `<div class="genre"><p>${genre.name}</p></div>`

		currentFilm.style.display = 'flex'
	})

	document.querySelector('.back').addEventListener('click', () => {
		back.style.display = 'none'
		pagination.style.display = 'flex'
		header.style.display = 'flex'
		films.style.display = 'flex'
		currentFilm.style.display = 'flex'
		document.querySelector('.film').style.display = 'none'
	})
})



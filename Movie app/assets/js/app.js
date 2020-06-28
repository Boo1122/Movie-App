console.log('start')


//Selecting elements from the DOM
const buttonElement = document.querySelector('#search');
const inputElement = document.querySelector('#inputValue');
const movieSearchable = document.querySelector('#movies-searchable');
const moviesContainer = document.querySelector('#movies-container');


    function movieSection(movies) {
        return movies.map(movie => {
            if (movie.poster_path) {
                return `<img 
            src=${IMAGE_URL + movie.poster_path} 
            data-movie-id=${movie.id}/>`;
            }
        })
    }


    function createMovieContainer(movies, title = '') {
        const movieElement = document.createElement('div');
        movieElement.setAttribute('class', 'movie');

        const movieTemplate = `
        <h2>${title}</h2>
    <section class="section">
   
    ${movieSection(movies)}
    </section>

    <div class="content">
    <p id="content-close">X</p>
    </div>
    `;

        movieElement.innerHTML = movieTemplate;
        return movieElement;
    }

    function renderSearchMovies(data) {
        movieSearchable.innerHTML = '';
        const movies = data.results;
        const movieBlock = createMovieContainer(movies);
        movieSearchable.appendChild(movieBlock);
        console.log('Data: ', data);
    }

    function renderMovies(data) {
       
        const movies = data.results;
        const movieBlock = createMovieContainer(movies, this.title);
        moviesContainer.appendChild(movieBlock);
        console.log('Data: ', data);
    }

  
    function handleError(error) {
        console.log('Error:', error)
    }


    buttonElement.addEventListener('click', event => {
        event.preventDefault();
        // inputElement.value = null;
        const value = inputElement.value;
        searchMovie(value);
          inputElement.value = '';

        console.log('Value:', value);
      
    })


    function createIframe(video) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${video.key}`;
        iframe.width = 360;
        iframe.height = 315;
        iframe.allowFullscreen = true;
        return iframe;
    }

    function createVideoTemplate(data, content) {
        //TODO
        //display movie videos
        content.innerHTML = '<p id="content-close">X</p>'
        console.log('Videos:', data)
        const videos = data.results
        const length = videos.length > 4 ? 4 : videos.length;
        const iframeContainer = document.createElement('div');
        for (let i = 0; i < length; i++) {

            const video = videos[i] //video
            const iframe = createIframe(video);
            iframeContainer.appendChild(iframe);
            content.appendChild(iframeContainer);

        }
    }

    //Event Delegation
    document.addEventListener('click', event => {
        const target = event.target;
        if (target.tagName.toLowerCase() === 'img') {
            console.log('clicked any image');
            console.log('Event:', event);

            const movieId = target.dataset.movieId;
            console.log('Movie ID:', movieId)
            const section = event.target.parentElement; //target section
            const content = section.nextElementSibling; //target content
            content.classList.add('content-display')

            const path = `/movie/${movieId}videos`;
            const url = generateUrl(path);
            //fetch movie videos
            fetch(url)
                .then((response) => response.json())
                .then((data) => createVideoTemplate(data, content))

                .catch((error) => {
                    console.log('Error: ', error)
                });
        }



        if (target.id === 'content-close') {
            const content = target.parentElement;
            content.classList.remove('content-display');
        }
    })

    searchMovie()
    getUpcomingMovies();

    getTopRatedMovies();

    getPopularMovies();
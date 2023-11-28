// IIFE (Immediately Invoked Function Expression) function
let pokemonRepository=(function(){
    let pokemonList= [];
    let apiUrl= 'https://pokeapi.co/api/v2/pokemon/?limit=150';

    function getAll(){
        return pokemonList;
    }

    function add(pokemon){
        return pokemonList.push(pokemon);
    }

    function showDetails(pokemon) {
        loadDetails(pokemon).then(function ()  {
            showModal(pokemon);
        });
    }

    function addListItem(pokemon) {
        let pokemonList = document.querySelector('.pokemon-list');
        let listItem = document.createElement('li');
        let button = document.createElement('button');
        button.innerText = pokemon.name;
        button.classList.add('button-class');
        listItem.appendChild(button);
        pokemonList.appendChild(listItem);
        //added an event listener
        button.addEventListener('click', function () {
            showDetails(pokemon);
        });
    }

    function loadList() {
        return fetch(apiUrl).then(function (response) {
            return response.json();
        }).then(function (json) {
            json.results.forEach(function (item) {
                let pokemon= {
                    name: item.name,
                    height: item.height,
                    detailsUrl: item.url
                };
                add(pokemon);
            });
        }).catch(function (e) {
            console.error(e);
        })
    }

    function loadDetails(item) {
        let url= item.detailsUrl;
        return fetch(url).then(function (response) {
            return response.json();
        }).then(function (details) {
            //Details to the item
            item.imageUrl = details.sprites.front_default;
            item.height= details.height;
            item.types= details.types;
        }).catch(function (e){
            console.error(e);
        });
    }

    function showModal(pokemon) {
        let modalContainer= document.querySelector('#modal-container');

        //Clear all existing modal content
        modalContainer.innerHTML= '';

        let modal= document.createElement('div');
        modal.classList.add('modal');

        //Add new modal content
        let closeButtonElement= document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText= 'x';
        closeButtonElement.addEventListener('click', hideModal);

        let titleElement= document.createElement('h1');
        titleElement.innerText= pokemon.name;

        let contentElement= document.createElement('p');
        contentElement.innerText= 'Height:' + ' ' + pokemon.height;

        let imageElement= document.createElement('img');
        imageElement.src= pokemon.imageUrl;

        modal.appendChild(closeButtonElement);
        modal.appendChild(titleElement);
        modal.appendChild(contentElement);
        modal.appendChild(imageElement);
        modalContainer.appendChild(modal);

        modalContainer.classList.add('is-visible');

        modalContainer.addEventListener('click', (e) => {
            //Since this is also triggered when clicking inside the modal, we only want to close if the user clicks directly on the overlay
            let target= e.target;
            if(target === modalContainer) {
                hideModal();
            }
        });
    }

    function hideModal() {
        let modalContainer= document.querySelector('#modal-container');
        modalContainer.classList.remove('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        let modalContainer= document.querySelector('#modal-container');
        if(e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
            hideModal();
        }
    });

    return {
        getAll: getAll,
        add: add,
        addListItem: addListItem,
        loadList: loadList,
        loadDetails: loadDetails,
        showModal: showModal,
        hideModal: hideModal
    }
})()

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function(pokemon){
        pokemonRepository.addListItem(pokemon);
    });
})








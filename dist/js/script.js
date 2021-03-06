const search = document.getElementById('search');
const postContainer = document.getElementById("post-container");
const btnUp = document.getElementById('btn-up');
const newest = document.getElementById('newest');
const oldest = document.getElementById('oldest');
const sortTags = document.getElementsByClassName('checkbox');

let dataStore = [];
let currentState = [];
let currentSortType = "newest";
let selectedSort = [];
let currentCountPage = 0;

for(let i = 0; i < sortTags.length ; i++) {


    sortTags[i].addEventListener('change', function(e) {
        if (_.isEmpty(currentState)) return;
        
        if (e.target.checked && !selectedSort.includes(e.target.value)) {
            selectedSort.push(e.target.value);
        } else {
            selectedSort = selectedSort.filter((elem) => elem !== e.target.value);
        }
        currentState = sortByTags(currentState, selectedSort);
        localStorage.setItem('sortTags', selectedSort);

        currentCountPage = 0;
        
        postContainer.innerHTML = '';
        renderCards(currentState.slice(currentCountPage, currentCountPage+10));
        currentCountPage += 10;
    })
}

function setSelectedSort() {
    let tags = localStorage.getItem('sortTags');
    if (_.isNil(tags) || _.isEmpty(tags)) {
        tags = [];
        localStorage.setItem('sortTags', []);
     } else {
        selectedSort = tags.split(',');
    }
    for (let i = 0; i < sortTags.length; i++) {
        if (tags.includes(sortTags[i].value)) {
            sortTags[i].checked = true;
        }
    }
}

fetch('https://api.myjson.com/bins/152f9j')
    .then(response => response.json())
    .then(json => {
        data = json.data;
        main(data);
    })
    .catch(err => console.log(err));


function renderCard(postData) {

    let article = document.createElement('article');
    article.classList.add('post');
    article.setAttribute('id', postData.id);

    article.innerHTML = `<i class="fas fa-times btn-delete"></i>

                <img src = ${postData.image} alt = "post-pic">
                <h2 class = "post-name">${postData.title}</h2>
                <div class = "post-date">${new Date(postData.createdAt).toDateString()}</div>
                <div class = "tags">
                ${postData.tags.reduce((acc, tag) => {
                      return acc + "<div class = 'tags-item'>"+tag+"</div>"
                },'')}
                </div>
                <p class = "post-body">${postData.description}</p>`

    postContainer.appendChild(article);

}

function renderCards(postsArray) {

    postsArray.forEach(element => {
        renderCard(element);
    });
    addBtnDeleteListeners();
    
};

function addBtnDeleteListeners() {
    const deleteButtons = document.getElementsByClassName("btn-delete");

    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', deleteListener);
    }
}

function deleteListener(e) {
    let selectedArticleId = e.target.closest('.post').getAttribute('id');
        currentState = currentState.filter((elem) => elem.id != selectedArticleId);
        dataStore = dataStore.filter((elem) => elem.id != selectedArticleId);
        postContainer.innerHTML = '';
        currentCountPage = 0;
        renderCards(currentState.slice(currentCountPage, currentCountPage+10));
        currentCountPage += 10;
        
}

function sortByTags (arr, sortTags, sortDateType="newest") {
    if (sortDateType == "newest") newest.checked = true;
    return arr.sort((a, b) => {
       let tagsA = _.intersection(sortTags, a.tags.map(tag => tag.toLowerCase()));
       let tagsB = _.intersection(sortTags, b.tags.map(tag => tag.toLowerCase()));
       if (tagsA.length === tagsB.length) {
           if (sortDateType == 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
           else return new Date(a.createdAt) - new Date(b.createdAt);
       }
       return tagsB.length - tagsA.length;
   })
}

window.onscroll = _.debounce(event => {
    if (window.scrollY<=0) btnUp.style.display = "none";
    else btnUp.style.display = "block";
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        renderCards(currentState.slice(currentCountPage, currentCountPage + 10))
        currentCountPage += 10;
    }
  }, 100)

function main(posts) {
    setSelectedSort();
    

    for(let i = 0; i< posts.length; i++) {
        posts[i].id = i;
    }

    dataStore = _.cloneDeep(posts);

    currentState = sortByTags(dataStore, selectedSort);
    renderCards(currentState.slice(currentCountPage, currentCountPage+10));
    currentCountPage += 10;
    

    search.addEventListener('input', function (e) {

        currentCountPage = 0;

        let searchWord = e.target.value.toLowerCase();
        let filtered = dataStore.filter((post) => {
            return post.title.toLowerCase().includes(searchWord)
        });

        currentState = sortByTags(filtered, selectedSort);
 
        postContainer.innerHTML = '';
        renderCards(currentState.slice(currentCountPage, currentCountPage+10));
        currentCountPage += 10;
        

    });

    newest.addEventListener('change', function (e) {
        currentCountPage = 0;
        currentSortType = "newest";
        currentState = sortByTags(currentState, selectedSort, currentSortType);
        postContainer.innerHTML = '';
        renderCards(currentState.slice(currentCountPage, currentCountPage+10));
        currentCountPage += 10;
        

    });

    oldest.addEventListener('change', function (e) {
        currentCountPage = 0;
        currentSortType = 'oldest';
        currentState = sortByTags(currentState, selectedSort, currentSortType);
        postContainer.innerHTML = '';        
        renderCards(currentState.slice(currentCountPage, currentCountPage+10));
        currentCountPage += 10;

    });

    btnUp.addEventListener('click', function () {
        currentCountPage = 0; 
        postContainer.innerHTML = '';        
        renderCards(currentState.slice(currentCountPage, currentCountPage+10));
        currentCountPage += 10;
    })

};


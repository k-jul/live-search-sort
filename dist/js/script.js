const search = document.getElementById('search');
const postContainer = document.getElementById("post-container");
const newest = document.getElementById('newest');
const oldest = document.getElementById('oldest');
const deleteButtons = document.getElementsByClassName("btn-delete");
let selectedTags = document.querySelectorAll(".checkbox:checked");

let currentState = [];
let currentSortType = "newest";




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
};

function sortByDate(arr, sortType) {

    if (sortType == "newest") return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

};

function sortByTag (arr, tags) {
   for (let i = 0; i<arr.length; i++) {
       for (let j = 0; j < tags.length; j++) {
        //    if (arr[i].tags)
       }
   }
}

function main(posts) {

    for(let i = 0; i< posts.length; i++) {
        posts[i].matchedTags = 0;
        posts[i].id = i;
    }

    currentState = sortByDate(posts, currentSortType);
    renderCards(currentState.slice(0, 10));

    search.addEventListener('input', function (e) {

        let searchWord = e.target.value.toLowerCase();
        let filtered = posts.filter((post) => {
            return post.title.toLowerCase().includes(searchWord)
        });

        currentState = sortByDate(filtered, currentSortType);
 
        postContainer.innerHTML = '';
        renderCards(currentState.slice(0, 10));

    });

    newest.addEventListener('change', function (e) {

        currentSortType = "newest";
        currentState = sortByDate(currentState, currentSortType);
        postContainer.innerHTML = '';
        renderCards(currentState.slice(0, 10));

    });

    oldest.addEventListener('change', function (e) {

        currentSortType = 'oldest';
        currentState = sortByDate(currentState, currentSortType);
        postContainer.innerHTML = '';
        renderCards(currentState.slice(0, 10));

    });

    
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', function (e) {
        let selectedArticleId = e.target.closest('.post').getAttribute('id');
        currentState = currentState.filter((elem) => elem.id != selectedArticleId);
        posts = currentState;
        postContainer.innerHTML = '';
        renderCards(currentState.slice(0, 10));        
        });

    }
};

const search = document.getElementById('search');
const postContainer = document.getElementById("post-container");
const newest = document.getElementById('newest');
const oldest = document.getElementById('oldest');
let currentChoice = [];




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

    article.innerHTML = `<div class = "btn-delete"><i class="fas fa-times"></i></div>
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

function main(posts) {

    currentChoice = posts;

    renderCards(posts.slice(0, 10));

    search.addEventListener('input', function (e) {

        let searchWord = e.target.value.toLowerCase();

         currentChoice = posts.filter((post) => {
            return post.title.toLowerCase().includes(searchWord)

        });

        postContainer.innerHTML = '';

        renderCards(currentChoice.slice(0, 10));

    });

    newest.addEventListener('change', function (e) {
         currentChoice = currentChoice.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

         postContainer.innerHTML = '';

         renderCards(currentChoice.slice(0, 10));
    })

    oldest.addEventListener('change', function (e) {
        currentChoice = currentChoice.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));

        postContainer.innerHTML = '';

        renderCards(currentChoice.slice(0, 10));
   })
};
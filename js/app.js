let postWrapper = document.querySelector('#post-holder');
let postForm = document.querySelector('#post-form');
let title = document.querySelector('#title');
let body = document.querySelector('#body');
let msg = document.querySelector('#msg');
let msg2 = document.querySelector('#msg2');

const url = 'https://jsonplaceholder.typicode.com/posts';

let postBox = [];

function postData (data) {
    postBox.unshift(data);  
    let postHolder = '';
    postBox.forEach(post => { 
        postHolder += `
        <div class ="col-lg-6 col-md-6 col-12 my-3" >
        <div class="card h-100">
            <div class="card-body">
                <h6 class="post-title">${post.title}</h6>
                <p class="text-secondary">${post.id}</p>
                <p class="post-body">${post.body}</p>
                <div div class = "float-end d-flex align-items-end" >
                    <a class="card-link bi bi-arrows-angle-expand" onclick="openSingle(${post.id})"></a>
                    <a class="card-link bi bi-pencil-square" onclick="updatePost(${post.id})"></a>
                    <a class="card-link bi bi-trash3 red-bin" onclick="deletePost(${post.id})"></a>
                </div>
            </div>
        </div>
    </div>
    `
    });
    postWrapper.innerHTML = postHolder;
} 

// get posts
function getPosts() {
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            postBox = data.splice(0,20);
            renderUI(postBox)
        })
}

getPosts();

// create post
function createPost(e) {
    
    e.preventDefault();
    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            title: title.value,
            body: body.value,
            userId: 2,
            id: 1
        }),
        headers: {
            'Content-type': 'application/json'
        }
    })
        .then((response) => response.json())
        .then((data) => {
            
            // begin validation
        let formValidation = () => {               
            if(title.value === "" &&  body.value === "") {
                    msg.innerHTML = "Title cannot be empty";
                    msg2.innerHTML = "You cannot submit a blank post";
            }
            else if  (body.value === "") {
                msg.innerHTML = ""
                msg2.innerHTML = "You cannot submit a blank post";
            }
            else if  (title.value === "") {
                msg.innerHTML = "Title cannot be empty";
                msg2.innerHTML = "";
            }
                
            else{
                postData (data)
                msg.innerHTML = ""
                msg2.innerHTML = ""
                title.value = ""
                body.value = ""
            }
        }
        formValidation();
// end validation
        })
}

postForm.addEventListener('submit', createPost)

// update post
function updatePost(id) {

    fetch(`${url}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: title.value,
            body: body.value,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((data) => {

            let postTitles = document.querySelectorAll('.post-title')
            let postBodies = document.querySelectorAll('.post-body')
            postTitles.forEach((postTitle, index) => {
                if (index + 1 === id) {
                    if (data.title !== "") {
                        postTitle.innerHTML = data.title
                    }
                }
            })

            postBodies.forEach((postBody, index) => {
                if (index + 1 === id) {
                    if (data.body !== "") {
                        postBody.innerHTML = data.body
                    }
                }
            })
        });
}

// delete post
function deletePost(id) {
    fetch(`${url}/${id}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then((data) => {
            postBox = postBox.filter(post => post.id !== id)
            renderUI(postBox) 
            // postData (postBox) 
        })
    
}

// single page
function openSingle(id) {
    fetch(`${url}/${id}`)
        .then((response) => response.json())
        .then((data) => {
            localStorage.setItem('viewedPost', JSON.stringify(data))
            window.location.href = 'single.html'
        });
}

// render
function renderUI (arr) {
    let postHolder = '';
           arr.forEach(post => {
                postHolder += `
                    <div class ="col-lg-6 col-md-6 col-12 my-3" >
                        <div class="card h-100">
                            <div class="card-body">
                                <h6 class="post-title">${post.title}</h6>
                                <p class="text-secondary">${post.id}</p>
                                <p class="post-body">${post.body}</p>
                                <div div class = "float-end d-flex align-items-end" >
                                    <a class="card-link bi bi-arrows-angle-expand" onclick="openSingle(${post.id})"></a>
                                    <a class="card-link bi bi-pencil-square" onclick="updatePost(${post.id})"></a>
                                    <a class="card-link bi bi-trash3 red-bin" onclick="deletePost(${post.id})"></a>
                                </div>
                            </div>
                        </div>
                    </div>
                `
            });
            postWrapper.innerHTML = postHolder;       
}
// API CALLS //

// FETCH CONTENT //
async function getDiscos (){
  const response = await fetch('http://localhost:3001/api/discos');
  let discos =  await response.json();
  if(window.location.pathname === '/')
    console.log(discos);
    setNovedades(discos);
};

async function getPosts (){
  const response = await fetch('http://localhost:3001/api/posts');
  let posts = await response.json();

  if(window.location.pathname === '/')
    setPosts(posts);
  else if (window.location.pathname === '/admin/admin.html')
    managePosts(posts);
};

async function deletePostApi(post){
  fetch(`http://localhost:3001/api/posts/${post.id}`, {
    method: 'DELETE',
    mode: 'cors'
  });
}



if(window.location.pathname === '/'){
  getDiscos();
}

getPosts();

// DELETE CONTENT //

function deletePost (event) {
  const post  = event.target.parentNode;
  console.log(post);

  let confirm = window.confirm('¿Esta seguro que desea eliminar el post?');
  if(confirm){
    post.classList.add('removing');
    post.onanimationend = (event) => {post.style.display = 'none';}
    deletePostApi(post);
  }

  else return;
}

// sticky nav handler

var navSticky = false;
const navBar = document.querySelector('.main-nav');
const navBound = navBar.getBoundingClientRect(); 
const navTop = navBound.y + window.scrollY;


document.addEventListener('scroll', onScrollCheck);

function onScrollCheck (){


  console.log(navTop);

  if(window.scrollY >= navTop  && !navSticky){
    makeNavSticky();
    navSticky = true;
  } else if (window.scrollY <= navTop  && navSticky){
    makeNavUnstick();
    navSticky = false
  }
}

function makeNavSticky(){
  navBar.classList.add('sticky');
}

function makeNavUnstick(){
  navBar.classList.remove('sticky');
}

// DISPLAY CONTENT //

function setPosts(posts){
  const novedadesElem = document.querySelector(".novedades_content");

  posts.forEach((e,i) => {
    const html = 
      `<div class="novedades_post">
        <div class="post_image">
            <img alt="Portada Album" role="img" src=${e.imgUrl} height="140"> 
        </div>
        <div class="post_title"><h2>${e.title}</h2></div>
        <div class="post_content">
            <p class="text-center">${e.content}</p>
        </div>
      </div>`

    let div = document.createElement('div');
    div.innerHTML = html;

    novedadesElem.appendChild(div);
  })

}

function managePosts(posts){

  const managerElement = document.getElementsByClassName('manager_wrapper')[0];

  posts.forEach((e,i) => {
    const html = 
      `<button class="post_delete-button">X</button>
       <div class="post_image">
            <img alt="Portada Album" role="img" src='${e.imgUrl}'> 
        </div>
        <div class="post_title"><h2>${e.title}</h2></div>
        <div class="post_content">
            <p class="text-center">${e.content}</p>
        </div>`

    let div = document.createElement('div');
    div.className = 'manager_post';
    div.id = e.id;

    console.log(html);

    div.innerHTML = html;

    managerElement.appendChild(div);

  })

  addPostListener();
}

function setNovedades(discos) {

  const novedadesList = $('#discos-list')

  discos.forEach((e, i) => {
    novedadesList.append(
      `<li class="card card${i + 1}" style="margin-top:${i * 5}em">
        <a href=${e.url}>
          <img src= ${e.img} width="300" height="300">
        </a>
        <div class="card-info">
          <h3>${e.artista.toUpperCase()}<br><br>
          ${e.disco.toUpperCase()}</h3>
        </div>
      </li>`
    )
  })

  addHovers(".card")

}

// HANDLE POINTER EVENTS //



function addPostListener (){
  const deletePostButtons = document.getElementsByClassName('post_delete-button');
  const deleteArray = Array.prototype.slice.call(deletePostButtons);

  console.log(deletePostButtons);
  
  deleteArray.forEach( item => {
    item.addEventListener('click', deletePost);
  })

}

function addHovers(className) {
  $(className).hover((e) => {
    $(e.currentTarget).children(".card-info").removeClass("hover-out")
    $(e.currentTarget).children(".card-info").addClass("hover-in")
  }, (e) => {
    $(e.currentTarget).children(".card-info").removeClass("hover-in")
    $(e.currentTarget).children(".card-info").addClass("hover-out")
  }
  )
}

function addClicks(){
    const sliderLeft = document.getElementsByClassName('slider-button_left')[0]; 
    const sliderRight = document.getElementsByClassName('slider-button_right')[0];
    const slider = document.getElementsByClassName('caimanes-slider_inner')[0];

    sliderLeft.onclick = (e) => onSliderLeft(e);
    sliderRight.onclick = (e) => onSliderRight(e);
    
    slider.ondragstart = (e) => onSliderDrag(e);
    document.onmouseup = (e) => onSliderDragEnd(e);
}

function onSliderLeft(e){
  const slider = document.getElementsByClassName('caimanes-slider_inner')[0];
  const translateVal = Number(slider.style.transform.replace(/[^\d-]/g, ''));
  console.log(translateVal);
  if(translateVal < 0){
    slider.style.transform = `translateX(${translateVal + 300}px)`; 
  }
}

function onSliderRight(e){
  const slider = document.getElementsByClassName('caimanes-slider_inner')[0];
  const translateVal = Number(slider.style.transform.replace(/[^\d-]/g, ''));
  console.log(translateVal);
  if(translateVal > -1000){
  slider.style.transform = `translateX(${translateVal - 300}px)`;
  }
}

function onSliderDrag(e){
  // console.log(e);
  e.preventDefault();
  let originalX = e.clientX;
  let origSlider = Number(e.currentTarget.style.transform.replace(/[^\d-]/g, ''));
  document.onmousemove = (event) => onSliderMove(event, originalX, origSlider);

}

function onSliderDragEnd(e){
  // console.log('termine drag');
  document.onmousemove = null;
}

function onSliderMove(e, origX, origSlider){
  let movMouseX = e.clientX - origX;
  let movSliderX = origSlider + movMouseX;
  // console.log(movX);
  
  const slider = document.getElementsByClassName('caimanes-slider_inner')[0];
  if(movSliderX <= 0 && movSliderX >= -1000){
  slider.style.transform = `translateX(${movSliderX}px)`;
  }
}

addClicks();


// HANDLE CREATE FORM //

const imgInput = document.getElementById('create-image');

const createForm = document.forms.create_form;

imgInput.addEventListener('change', handleImage);

createForm.addEventListener('submit', createSubmit);

function handleImage (e){
  const file = imgInput.files[0];
  const reader = new FileReader();
  const preview = document.getElementsByClassName('post-img_preview')[0];

  if(file.type.includes('image/')){
    console.log(file);

    if(document.getElementsByClassName('prev-img').length){
      document.getElementsByClassName('prev-img')[0].remove();
    }

    var prevImg = document.createElement('img');
    prevImg.className = 'prev-img';
    preview.appendChild(prevImg);

    reader.onloadend = (e) => {
      console.log('se cargo la imagen');
      prevImg.src = e.target.result;
    }

    console.log(reader);
    reader.readAsDataURL(file);
  }

}

async function createSubmit (event) {

  event.preventDefault();

  const file = imgInput.files[0];

  const uploadPreset = 'caimandiscos';

  let imgData = new FormData();
  imgData.append('file', file);
  imgData.append('upload_preset', uploadPreset);

  let data = new FormData(createForm);
  data.delete('post-img');


  let imgResponse = await fetch('https://api.cloudinary.com/v1_1/terrero/image/upload', {
    method: 'POST',
    body: imgData
  })

  let imgJson = await imgResponse.json();
  data.append('img_url', imgJson.url);
  
  let formResponse = await fetch('http://localhost:3001/api/posts/create', {
    method: 'post',
    body: data
  });


  createForm.reset();
  console.log(formResponse);
  alert('el post se ha creado con exito');
  
};




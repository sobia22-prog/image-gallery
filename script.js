const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-box");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");

const apiKey = "Dcdz5sU2m6h1TdX15T5virbx7XaWDMsaNEWLbLaLIactYeRavnWonQNe";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
  fetch(imgURL).then(res => res.blob()).then(file => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();
  }).catch(() => alert("Failed to download image!"));
}

const showLightbox = (name, img) => {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadImgBtn.setAttribute("data-img", img)
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images.map(img =>
    `<li class="card" onclick="showLightbox('${img.photographer}', '${img.src.large2x}')">
        <img src="${img.src.large2x}" alt="img">
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick="downloadImg('${img.src.large2x}')">
            <i class="uil uil-import"></i>
          </button>
        </div>
      </li>`
  ).join("");
}

const getImages = (apiURL) => {
  loadMoreBtn.innerText = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey }
  }).then(res => res.json()).then(data => {
    console.log(data);
    generateHTML(data.photos);
    loadMoreBtn.innerText = "Load More";
    loadMoreBtn.classList.remove("disabled");
  }).catch(() => {
    alert("Failed to load images!")
    loadMoreBtn.innerText = "Try Loading Again";
    loadMoreBtn.classList.remove("disabled")
  })
}

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
  getImages(apiURL);
}

const loadSearchImages = (e) => {
  if (e.target.value === "") return searchTerm = null;
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`)
  }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);
loadMoreBtn.addEventListener("click", loadMoreImages);
searchInput.addEventListener("keyup", loadSearchImages);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img))
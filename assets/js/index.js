const btnDropDown = document.getElementById("drop_down_input");
const inputFile = document.getElementById("input_file");
const inputUrl = document.getElementById("input_url");
const btnAgregar = document.getElementById("btn_agregar");
const containerImages = document.getElementById("container_images");
const inputTitulo = document.getElementById("input_titulo");
const inputDescription = document.getElementById("input_descrip");
const listPages = document.getElementById("list_pages");
const containerPagination = document.getElementById("container_pagination");
var listPopevers = [];

function selectDropDownItem() {
  const btns_opts = document.querySelectorAll(".dropdown-item");

  btns_opts.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (btn.innerHTML === "URL") {
        if (inputUrl.className.includes(" hidden")) {
          inputUrl.className = inputUrl.className.replace(" hidden", "");
        }
        if (!inputFile.className.includes(" hidden")) {
          inputFile.className = inputFile.className + " hidden";
        }
      } else {
        if (inputFile.className.includes(" hidden")) {
          inputFile.className = inputFile.className.replace(" hidden", "");
        }
        if (!inputUrl.className.includes(" hidden")) {
          inputUrl.className = inputUrl.className + " hidden";
        }
      }
      btnDropDown.childNodes[0].nodeValue = e.target.innerText;
    });
  });
}

async function getUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function clickBtnAgregar() {
  btnAgregar.addEventListener("click", async () => {
    let url = inputUrl.value;
    let titulo = inputTitulo.value;
    let descrip = inputDescription.value;
    const image = {
      url: url,
      titulo: titulo,
      description: descrip,
    };
    if (btnDropDown.childNodes[0].nodeValue !== "URL") {
      url = await getUrl(inputFile.files[0]);
      image.url = url;
    }

    const images = getItemByKey("images");
    console.log(images);
    if (images) {
      images.push(image);
      setItem("images", images);
    } else {
      setItem("images", [image]);
    }
    containerImages.innerHTML += getHtmlImage(image);
  });
}

function clicBtnsPagination() {
  const btns_pagination = document.querySelectorAll(".page-item");

  btns_pagination.forEach((item) => {
    item.addEventListener("click", (e) => {
      const val = item.children[0].innerHTML.split(" ")[0];
      console.log("click Page:", val);
      if (/[0-9]/i.test(val)) {
        const page = parseInt(val);
        pushPaginationHtml();
        pushImagesPageHtml(page);
        selectPaginationHmlt(page);
        clicBtnsPagination();
        listenerPopovers();
      }
    });
  });
}

function setItem(key, value) {
  window.localStorage.setItem(key, JSON.stringify({ value: value }));
}

function getItemByKey(key) {
  let val = window.localStorage.getItem(key);
  if (val) {
    val = JSON.parse(val);
    return val.value;
  }
}

function getKeybyIndex(num) {
  return window.localStorage.key(num);
}

function getValuebyIndex(num) {
  return getItemByKey(getKeybyIndex(num));
}

function getHtmlImage(image) {
  return ` 
  <div  data-bs-toggle="popover" data-bs-title="${image.titulo}" data-bs-content="${image.description}" data-bs-placement="top">    
      <img class="w-full h-full rounded-lg" src=${image.url} id="img-l">
  </div>
  `;
}

function removeAllImagesFromHtml() {
  containerImages.innerHTML = "";
}

function addImagesToHtml(images) {
  images.forEach((image) => {
    containerImages.innerHTML += getHtmlImage(image);
  });
}

function pushImagesPageHtml(page) {
  removeAllImagesFromHtml();
  const images = getItemByKey("images");
  console.log(images);
  if (images) {
    console.log(images.slice((page - 1) * 12, page * 12));
    addImagesToHtml(images.slice((page - 1) * 12, page * 12));
  }
}

function selectPaginationHmlt(page) {
  listPages.children[page].innerHTML = `
    <a
      class="page-link relative block py-1.5 px-3 border-0 bg-blue-600 outline-none transition-all duration-300 rounded-full text-white hover:text-white hover:bg-blue-600 shadow-md focus:shadow-md"
      href="#">${page} <span class="visually-hidden">(current) </span>
    </a>`;
}

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function pushPaginationHtml() {
  const amountPages = getAmountPages();
  if (amountPages) {
    if (amountPages > 1) {
      if (listPages.childNodes.length > 2) {
        for (let index = 1; index <= listPages.children.length - 1; index++) {
          listPages.removeChild(listPages.children[index]);
        }
      }
      listPages.innerHTML = `
    <li class="page-item disabled">
      <a class="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-500 pointer-events-none focus:shadow-none"
        href="#" tabindex="-1" aria-disabled="true">Anterior</a>
    </li>
    `;
      
      for (let i = 1; i <= amountPages; i++) {
        listPages.innerHTML += getPaginationHTML(i);
      }

      listPages.innerHTML += `  
    <li class="page-item">
    <a class="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
    href="#">Siguiente</a></li>`;

    } else {
      containerPagination.className = "container hidden";
    }
  } else {
    containerPagination.className = "container hidden";
  }
}

function getAmountPages() {
  const images = getItemByKey("images");
  if (images) {
    return Math.ceil(images.length / 12);
  }
}

function getPaginationHTML(page) {
  return `
  <li class="page-item">
    <a class="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded-full text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
     href="#">${page}</a>
  </li> `;
}

function listenerPopovers() {
  for (const popover of listPopevers) {
    popover.dispose();
  }
  listPopevers = [];

  var popoverTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="popover"]')
  );
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    const pop = new Popover(popoverTriggerEl);
    popoverTriggerEl.addEventListener("click", function (e) {
      listPopevers.map((popover) => {
        if (pop !== popover) {
          popover.hide();
        }
      });
    });
    listPopevers.push(pop);
    return pop;
  });
}

function listeners() {
  clickBtnAgregar();
  clicBtnsPagination();
  listenerPopovers();
}

function init() {
  selectDropDownItem();
  pushPaginationHtml();
  selectPaginationHmlt(1);
  pushImagesPageHtml(1);
}

init();
listeners();

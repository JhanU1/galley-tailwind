const btnDropDown = document.getElementById("drop_down_input");
const inputFile = document.getElementById("input_file");
const inputUrl = document.getElementById("input_url");
const btnAgregar = document.getElementById("btn_agregar");
const containerImages = document.getElementById("container_images");
const inputTitulo = document.getElementById("input_titulo");
const inputDescription = document.getElementById("input_descrip");

function selectDropDownItem() {
  const btns_opts = document.querySelectorAll(".dropdown-item");

  btns_opts.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      console.log(e.target.innerText);
      if (btn.innerHTML === "URL") {
        console.log("URL", inputUrl.className);
        if (inputUrl.className.includes(" hidden")) {
          inputUrl.className = inputUrl.className.replace(" hidden", "");
        }
        if (!inputFile.className.includes(" hidden")) {
          inputFile.className = inputFile.className + " hidden";
        }
      } else {
        if (inputFile.className.includes(" hidden")) {
          inputFile.className = inputFile.className.replace(" hidden", "");
          console.log(inputFile.className);
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
    console.log("titulo", titulo);
    let descrip = inputDescription.value;
    console.log("descrip", descrip);
    const image = {
      url: url,
      titulo: inputTitulo.value,
      description: inputDescription.value,
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
    console.log(getValuebyIndex(0));
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
  console.log(image);
  return ` 
  <div  data-bs-toggle="tooltip" title="${image.titulo}" class="text-blue-600 hover:text-blue-700 transition duration-150 ease-in-out">
      <img class="w-full h-full rounded-lg" src=${image.url}>
  </div>`;
}

function init() {
  const images = getItemByKey("images");
  if (images) {
    images.forEach((image) => {
      containerImages.innerHTML += getHtmlImage(image);
    });
  }
}

init();

clickBtnAgregar();
selectDropDownItem();

import {data} from "./data.js";

const burgerBtn = document.querySelector(".burger-btn");
const burgerMenu = document.querySelector(".header-right");
const burgerMenuLinks = burgerMenu.querySelectorAll("a");
const menuLinkInBurger = document.querySelector(".menu-link-s");
let isBurgerOpen = false;

burgerMenuLinks.forEach((el) => {
  el.addEventListener("click", () => {
    isBurgerOpen = false;
    burgerMenu.classList.remove("burger-menu-active");
    burgerBtn.classList.remove("burger-btn-clicked");
    document.body.classList.remove("scroll-locked");
  });
});

burgerBtn.addEventListener("click", burgerMenuOpenAndClose);

function burgerMenuOpenAndClose() {
  if (!isBurgerOpen) {
    isBurgerOpen = true;
    burgerBtn.classList.add("burger-btn-clicked");
    burgerMenu.classList.add("burger-menu-active");
    document.body.classList.add("scroll-locked");
  } else {
    isBurgerOpen = false;
    burgerBtn.classList.remove("burger-btn-clicked");
    burgerMenu.classList.remove("burger-menu-active");
    document.body.classList.remove("scroll-locked");
  }
}

if (document.body.classList.contains("home")) {
  const sliderArrowBtnLeft = document.querySelector(".arr-ar-left");
  const sliderArrowBtnRight = document.querySelector(".arr-ar-right");
  const slide = document.querySelector(".slide");
  const sliderLine = document.querySelector(".slide-line");
  const sliderProgressBar = document.querySelectorAll(".bar");
  const slidesWrapperArr = document.querySelectorAll(".slide-wrapper");
  const sliderTouchArea = document.querySelector(".favorites-wrapper");

  let interval;
  let progress = 0;
  let slideCount = 0;
  let touchPositionX;
  let currentMovePositionX;

  sliderArrowBtnLeft.addEventListener("click", () => {
    slideCount--;
    nextSlide();
  });
  sliderArrowBtnRight.addEventListener("click", () => {
    slideCount++;
    nextSlide();
  });
  slidesWrapperArr.forEach((el) => {
    el.addEventListener("pointerover", mouseOverSlide);
  });

  slidesWrapperArr.forEach((el) => {
    el.addEventListener("pointerout", mouseOutSlide);
  });
  sliderTouchArea.addEventListener("touchstart", (e) => {
    touchPositionX = e.touches[0].clientX;
  });

  sliderTouchArea.addEventListener("touchmove", (e) => {
    clearInterval(interval);
    let touchMovePositionX = e.touches[0].clientX;
    currentMovePositionX = touchMovePositionX - touchPositionX;
  });

  sliderTouchArea.addEventListener("touchend", () => {
    if (currentMovePositionX !== 0) {
      if (currentMovePositionX < 0) {
        slideCount++;
      } else {
        slideCount--;
      }
      nextSlide();
      currentMovePositionX = 0;
    }
  });
  document.addEventListener("DOMContentLoaded", () => {
    showSliderProgressBar();
  });
  window.addEventListener("resize", () => {
    sliderLine.style.transform = `translateX(-${
      slideCount * slide.offsetWidth
    }px)`;
  });

  function nextSlide() {
    if (slideCount < 0) {
      slideCount = 2;
    }
    if (slideCount > 2) {
      slideCount = 0;
    }
    clearInterval(interval);
    progress = 0;
    sliderLine.style.transform = `translateX(-${
      slideCount * slide.offsetWidth
    }px)`;
    showSliderProgressBar();
  }

  function showSliderProgressBar() {
    sliderProgressBar.forEach((el, i) => {
      if (i === slideCount) {
        fillTheBar(el);
      } else {
        el.style.width = "0";
      }
    });
  }

  function mouseOverSlide() {
    clearInterval(interval);
    progress = sliderProgressBar[slideCount].style.width;
    sliderProgressBar[slideCount].style.width = progress;
  }
  function mouseOutSlide() {
    sliderProgressBar[slideCount].style.width = parseFloat(progress);
    fillTheBar(sliderProgressBar[slideCount]);
  }

  function fillTheBar(currentBar) {
    progress = parseFloat(progress);
    interval = setInterval(() => {
      if (progress > 100) {
        clearInterval(interval);
        slideCount++;
        progress = 0;
        nextSlide();
      } else {
        progress += 1;
        currentBar.style.width = `${progress}%`;
      }
    }, 40);
  }
} else {
  const filterBtns = document.querySelectorAll(".filter-btns");
  const cards = document.querySelector(".cards");
  const loadMoreBtn = document.querySelector(".refresh-btn");
  const modal = document.querySelector(".modal");
  const closeModalBtn = document.querySelector(".modal-btn");
  const modalBody = document.querySelector(".modal-body");
  const price = document.querySelector(".total-price");
  
  let activeFilterBtn = "coffee";
  let productsPerPage;
 
  filterBtns.forEach((el, i) => {
    el.addEventListener("click", () => {
      if (i === 0) {
        activeFilterBtn = "coffee";
        el.classList.add("filter-btn-active");
        filterBtns[1].classList.remove("filter-btn-active");
        filterBtns[2].classList.remove("filter-btn-active");
      }
      if (i === 1) {
        activeFilterBtn = "tea";
        el.classList.add("filter-btn-active");
        filterBtns[0].classList.remove("filter-btn-active");
        filterBtns[2].classList.remove("filter-btn-active");
      }
      if (i === 2) {
        activeFilterBtn = "dessert";
        el.classList.add("filter-btn-active");
        filterBtns[0].classList.remove("filter-btn-active");
        filterBtns[1].classList.remove("filter-btn-active");
      }
      renderCards();
    });
  });

  loadMoreBtn.addEventListener("click", () => {
    cards.classList.remove("cards-4");
    loadMoreBtn.style.display = "none";
  });
  
  function renderCards() {
    productsPerPage = 0;
    cards.innerHTML = "";
    data.forEach((el, i) => {
      if (el.category === activeFilterBtn) {
        const cardWrapper = document.createElement("div");
        cardWrapper.className = "card-wrapper";
        cardWrapper.addEventListener("click", openModal);
        const cardImage = document.createElement("div");
        cardImage.className = "card-image";
        const cardTitle = document.createElement("span");
        cardTitle.className = "card-title";
        const cardDescription = document.createElement("p");
        cardDescription.className = "card-description";
        const cardPrice = document.createElement("span");
        cardPrice.className = "card-price";
        cardTitle.textContent = el.name;
        cardDescription.textContent = el.description;
        cardPrice.textContent = `$${el.price}`;
        cardImage.style.backgroundImage = `url(${el.image})`;
        cardWrapper.appendChild(cardImage);
        cardWrapper.appendChild(cardTitle);
        cardWrapper.appendChild(cardDescription);
        cardWrapper.appendChild(cardPrice);
        cards.appendChild(cardWrapper);
        cardWrapper.dataset.index = i;
        setTimeout(() => {
          cardWrapper.style.opacity = "1";
        }, 100);
        productsPerPage++;
      }

      showCardsPerPage();
    });
  }

  renderCards();

  function showCardsPerPage() {
    if (window.innerWidth <= 768 && productsPerPage > 4) {
      cards.classList.add("cards-4");
      loadMoreBtn.style.display = "flex";
    } else {
      cards.classList.remove("cards-4");
      loadMoreBtn.style.display = "none";
    }
  }

  window.addEventListener("resize", showCardsPerPage);

  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (!modalBody.contains(e.target)) {
      closeModal();
    }
  });

  function openModal(e) {
    generateDataModal(e);
    modal.classList.add("modal-active");
    document.body.classList.add("scroll-locked");
  }
  function closeModal() {
    modal.classList.remove("modal-active");
    document.body.classList.remove("scroll-locked");
  }

  function generateDataModal(e) {
    const image = document.querySelector(".modal-image");
    const title = document.querySelector(".modal-title");
    const description = document.querySelector(".modal-description");
    const sizeInnerArr= document.querySelectorAll(".size-unit-inner");
    image.style.backgroundImage = e.currentTarget.children[0].style.backgroundImage;
    title.textContent = e.currentTarget.children[1].textContent;
    description.textContent = e.currentTarget.children[2].textContent;
    price.textContent = e.currentTarget.children[3].textContent;
    sizeInnerArr[0].textContent = data[e.currentTarget.dataset.index].sizes.s.size;
    sizeInnerArr[1].textContent = data[e.currentTarget.dataset.index].sizes.m.size;
    sizeInnerArr[2].textContent = data[e.currentTarget.dataset.index].sizes.l.size;
    sizeInnerArr[3].textContent = data[e.currentTarget.dataset.index].additives[0].name;
    sizeInnerArr[4].textContent = data[e.currentTarget.dataset.index].additives[1].name;
    sizeInnerArr[5].textContent = data[e.currentTarget.dataset.index].additives[2].name;
    calculatePrice(e.currentTarget.dataset.index);
  }
  
  function calculatePrice(index) {
    const additivesBtnArr = document.querySelectorAll(".adit-btn-click");
    const sizeBtnArr = document.querySelectorAll(".size-btn-clicked");
    const permanentPrice = Number(data[index].price);
    let finishPrice = permanentPrice;;
    let additivesPrice = 0;
    let isClick1 = false,
        isClick2 = false,
        isClick3 = false;
    
    sizeBtnArr[0].classList.add("modal-btn-active");
    sizeBtnArr[1].classList.remove("modal-btn-active");
    sizeBtnArr[2].classList.remove("modal-btn-active");
    sizeBtnArr.forEach((btn, i) => {
      btn.addEventListener("click", (e) => {
        if(i === 0) {
          finishPrice = permanentPrice + Number(data[index].sizes.s["add-price"]);
          btn.classList.add("modal-btn-active");
          sizeBtnArr[1].classList.remove("modal-btn-active");
          sizeBtnArr[2].classList.remove("modal-btn-active");
        } 
        if(i === 1) {
          finishPrice = permanentPrice + Number(data[index].sizes.m["add-price"]);
          btn.classList.add("modal-btn-active");
          sizeBtnArr[0].classList.remove("modal-btn-active");
          sizeBtnArr[2].classList.remove("modal-btn-active");
        } 
        if(i === 2) {
          finishPrice = permanentPrice + Number(data[index].sizes.l["add-price"]);
          btn.classList.add("modal-btn-active");
          sizeBtnArr[0].classList.remove("modal-btn-active");
          sizeBtnArr[1].classList.remove("modal-btn-active");
        }
        price.textContent = `$${(finishPrice + additivesPrice).toFixed(2)}`;
      })
    })
      
    additivesBtnArr.forEach((btn, i) => {    
      btn.classList.remove("modal-btn-active");
      btn.addEventListener("click", (e) => {
        
        if(i === 0) {
          if(!isClick1) {
            isClick1 = true;
            btn.classList.add("modal-btn-active");
            btn.style.pointerEvents = "auto";
            additivesPrice += Number(data[index].additives[0]["add-price"]);
          } else {
            isClick1 = false;
            btn.classList.remove("modal-btn-active");
            additivesPrice -= Number(data[index].additives[0]["add-price"]);
          }
        }
        if(i === 1) {
          if(!isClick2) {
            isClick2 = true;
            btn.classList.add("modal-btn-active");
            btn.style.pointerEvents = "auto";
            additivesPrice += Number(data[index].additives[1]["add-price"]);
          } else {
            isClick2 = false;
            btn.classList.remove("modal-btn-active");
            additivesPrice -= Number(data[index].additives[1]["add-price"]);
          }
        }
        if(i === 2) {
          if(!isClick3) {
            isClick3 = true;
            btn.classList.add("modal-btn-active");
            btn.style.pointerEvents = "auto";
            additivesPrice += Number(data[index].additives[2]["add-price"]);
          } else {
            isClick3 = false;
            btn.classList.remove("modal-btn-active");
            additivesPrice -= Number(data[index].additives[2]["add-price"]);
          }
        }
        price.textContent = `$${(finishPrice + additivesPrice).toFixed(2)}`
      })    
    })
  }

  menuLinkInBurger.addEventListener("click", () => {
    isBurgerOpen = false;
    burgerMenu.classList.remove("burger-menu-active");
    burgerBtn.classList.remove("burger-btn-clicked");
    document.body.classList.remove("scroll-locked");
  });
}







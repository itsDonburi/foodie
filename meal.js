`use strict`;

var mealService = {
  getMealDataByName: async function (name) {
    let url = `https://www.themealdb.com/api/json/v1/1/search.php?${name}`;
    let res = await getData(url);
    return res;
  },
  getRandomMeal: function () {
    let url = `https://www.themealdb.com/api/json/v1/1/random.php`;
    let res = getData(url);
    return res;
  },
};

function getData(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();

      return resolve(json);
    } catch (error) {
      console.error(error.message);
      reject(error.message);
    }
  });
}

function getCard(title, imgSrc, instruction = "") {
  return new Promise((resolve, reject) => {
    var cardTemplate = `
              <div>
                  <div class="uk-inline image-wrapper">
                      <img class="random-meal-img" src="${imgSrc}" alt=""></>
                      <div class="uk-overlay uk-overlay-default uk-position-top">
                          <p>${title}</p>
                      </div>
      
                      <div class="uk-overlay uk-overlay-default uk-position-bottom-right action-toolbar">
                          <span>
                              <button class="uk-button uk-button-default heart-button">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                  </svg>
                              </button>
                          </span>
                      </div>
                  </div>
              </div>
          `;
    $("#randomMealContainer").append(cardTemplate);

    resolve(1);
  });
}

// IIFE for code isolation (Immediately Invoked Function Expression)
(async function () {
  //   var url = "https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata";
  //   getData(url);

  for (let i = 0; i < 3; i++) {
    let response = mealService.getRandomMeal();
    response.then((res) => {
      $.each(res.meals, function (i, data) {
        console.log(data);
        let title = data.strMeal || "";
        let instruction = data.strInstructions || "";
        let imgSrc = `${data.strMealThumb}/medium` || "";
        getCard(title, imgSrc).then((res) => {
          $(".heart-button").off("click");
          $(".heart-button").on("click", function (e) {
            $(this).toggleClass('hearted');
          });
        });
      });
    });
  }
})();

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

function renderModal(mealId) {
  return new Promise((resolve, reject) => {
    let meal = JSON.parse(localStorage.getItem(mealId));

    document.getElementById("mealModal").innerText = "";

    var modalTemplate = `
      <div class="uk-modal-body uk-modal-dialog">
        <button class="uk-modal-close-default" type="button" aria-label="Close" uk-close></button>
        <h2 class="uk-modal-title uk-padding-small uk-padding-remove-left">${meal.strMeal}</h2>
        <p class="uk-text-justify">${meal.strInstructions}</p>
        <p class="uk-text-right uk-padding-remove-bottom uk-padding-small uk-padding-remove-right">
        <button class="uk-button uk-button-secondary uk-width-1-1" type="button" onclick="window.open('${meal.strYoutube}', '_blank')">View Recipe</a></button>
        </p>
      </div>
    `;

    $("#mealModal").append(modalTemplate);

    resolve(1);
  });
}

function getCard(title, imgSrc, mealId = "") {
  return new Promise((resolve, reject) => {
    var cardTemplate = `
              <div>
                  <div class="uk-inline image-wrapper">
                      <img class="random-meal-img" src="${imgSrc}" alt=""></>
                      <div class="uk-overlay uk-overlay-default uk-position-top">
                          <p class="uk-text-large uk-text-center">${title}</p>
                      </div>
      
                      <div class="uk-overlay uk-overlay-default uk-position-bottom-right action-toolbar">
                          <span id="meal_${mealId}">
                              <button class="uk-button uk-button-default heart-button" uk-tooltip="title: Like">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                  </svg>
                              </button>

                              <button class="uk-button uk-button-default read-button" type="button" uk-toggle="target: #mealModal" uk-tooltip="title: Read more">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
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
        let imgSrc = `${data.strMealThumb}/medium` || "";
        let mealId = data.idMeal || "";

        getCard(title, imgSrc, mealId).then(() => {
          $(".heart-button").off("click");
          $(".heart-button").on("click", function () {
            $(this).toggleClass("hearted");

            if ($(this).hasClass("hearted")) {
              let mealId = $(this).parent("span").attr("id");
              let id = mealId.split("_")[1];
              let mealData = localStorage.getItem(mealId);
              localStorage.setItem(`liked_meal_${id}`, mealData);
            } else {
              localStorage.removeItem(`liked_meal_${data.idMeal}`);
            }
          });

          $(".read-button").off("click");
          $(".read-button").on("click", function () {
            // render modal by reusing mealModal elem
            let mealId = $(this).parent("span").attr("id");
            renderModal(mealId).then(() => {
              UIkit.modal("#mealModal").show();
            });
          });
        });

        // Store fetched meals data
        localStorage.setItem(`meal_${data.idMeal}`, JSON.stringify(data));
      });
    });
  }
})();

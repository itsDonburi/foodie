`use strict`;

(function(){


    function insertMealCardV2(mealObj){

        let strMealThumb = mealObj?.strMealThumb || '';
        let strMeal = mealObj?.strMeal || '';
        let mealId = mealObj?.idMeal || '';
        let imgTemplate = `
            <img data-meal-id="${mealId}" src="${strMealThumb}" alt=""></img>
        `;
        
        $('#mealTitle').append(strMeal);
        $('#mealImg').append(imgTemplate);
    
        let ingredientTemplate = getIngredientTemplate(mealObj);
        $(`#ingredientList`).append(ingredientTemplate);
    }
    
    function insertMealInstruction(mealObj){
        
        let instructionsArr = mealObj.strInstructions.replaceAll('\r\n\r\n', '\r\n').split('\r\n');
        let res = ``;
    
        instructionsArr.forEach(string => {
          res += `<li>${string}</li>`
        });

        $(`#mealInstruction`).append(res);
    }

    function insertToolbar(mealObj){

        let mealId = mealObj.idMeal || "";
        let toolbarTemplate = `
                <div class="uk-overlay uk-overlay-default uk-position-bottom-right action-toolbar">
                <span id="meal_${mealId}">
                    <button class="uk-button uk-button-default heart-button hearted" uk-toggle="target: #confirmModal" uk-tooltip="title: Like">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                    </button>
                </span>
            </div>
        `;

        $('.toolbar-wrapper').append(toolbarTemplate);

        $('.heart-button').off("click");
        $('.heart-button').on("click", function(){
            $('.modal-content').html('');
            let strMeal = mealObj?.strMeal || '';
            $('.modal-content').append(`Are you sure you want to remove "${strMeal}"?`);
        });

        $('#confirmBtn').off("click")
        $('#confirmBtn').on("click", function(){
            let mealId = $('#mealImg img').first().data('meal-id');
            localStorage.removeItem(`liked_meal_${mealId}`);
            UIkit.modal('#confirmModal').hide();
            UIkit.notification({message:`<div class='uk-flex uk-flex-middle'><span class='uk-flex-none uk-margin-small-right'><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6fcb6f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg></span>Successfully removed from favorites!</div>`, timeout:5000, pos:'top-right'});
            resetCardFields();
            renderMealCard();
        });
    }

    function getIngredientTemplate(mealObj){
        
        let ingredientRegex = /strIngredient/;
        let mealEntry = Object.entries(mealObj);
        let res = '';

        for (let i = 0; i < mealEntry.length; i++) {
            if (ingredientRegex.test(mealEntry[i]) && mealEntry[i][1] !== ''){

                let ingredient = mealEntry[i][1];
                let [t, index] = mealEntry[i][0].split(ingredientRegex);
                let measurement = mealObj[`strMeasure${index}`];

                if ((ingredient !== null && ingredient !== "") && (measurement !== null && measurement !== "")){
                    let favMealIngredientTemplate = `
                        <div class="uk-grid">
                            <div class="uk-width-expand list-child" uk-leader>${ingredient}</div>
                            <div>${measurement}</div>
                        </div>
                    `;
    
                    res += favMealIngredientTemplate;
                }
            }
        }

        return res;
    }

    function getLikedMealsList(){
        let likedPattern = /liked_/;
        let likedMeals = Object.keys(localStorage).filter((val) => likedPattern.test(val)) || [];
        return likedMeals;
    }

    function checkFavListIsEmpty(){
        let likedMealsList = getLikedMealsList();
    
        if (likedMealsList.length == 0){
            if ($('#content').is(':visible')){
                $('#content').hide();
            }
            $('#emptyListContainer').show();
        } 
        else {
            $('#emptyListContainer').hide();
        }
    }

    function renderMealCard(){
        let likedMealsList = getLikedMealsList();

        if (likedMealsList.length > 0){
            for(let i = 0; i < likedMealsList.length; i++){
                mealObj = JSON.parse(localStorage.getItem(likedMealsList[i]));
                insertMealCardV2(mealObj);
                insertMealInstruction(mealObj);
                insertToolbar(mealObj);
                break;
            }
        } 
        else {
            checkFavListIsEmpty();
        }
        
    }

    function resetCardFields(){
        $('#mealTitle').html('');
        $('#mealImg').html('');
        $(`#ingredientList`).html('');
        $(`#mealInstruction`).html('');
        $('.toolbar-wrapper').html('');
    }

    function main(){
        $('#mealImg').off('change');
        $('#mealImg').on('change', function(){
            alert('something changed');
        })
        checkFavListIsEmpty();
        renderMealCard();
    }

    main();

})()
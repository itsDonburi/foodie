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
        $(`#mealInstruction`).html(renderMealInstructions(parseMealInstructions(mealObj.strInstructions)));
    }

    function insertToolbar(mealObj){

        let mealId = mealObj.idMeal || "";
        let toolbarTemplate = `
                <div class="action-toolbar absolute bottom-0 right-0 bg-muted">
                <span id="meal_${mealId}">
                    <button class="uk-btn uk-btn-default uk-btn-icon heart-button hearted" type="button" data-uk-toggle="target: #confirmModal" data-uk-tooltip="title: Like">
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
            UIkit.notification({message:`<div class='flex items-center gap-2'><span class='shrink-0'><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6fcb6f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg></span>Successfully removed from favorites!</div>`, timeout:5000, pos:'top-right'});
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
                        <div class="ingredient-row flex items-center gap-4">
                            <div class="min-w-0 flex-1 list-child" uk-leader>${ingredient}</div>
                            <div class="shrink-0">${measurement}</div>
                        </div>
                    `;
    
                    res += favMealIngredientTemplate;
                }
            }
        }

        return res;
    }

    let currentIndex = 0;

    function getLikedMealsList(){
        return Object.keys(localStorage).filter((key) => /^liked_meal_\d+$/.test(key));
    }

    function updatePagination(index, total){
        const hasMeals = total > 0;
        $('#favPagination').toggle(hasMeals);
        $('#favPage').text(hasMeals ? `${index + 1} / ${total}` : '');
        $('#favPrev, #favNext').prop('disabled', total < 2).toggleClass('uk-disabled', total < 2);
    }

    function checkFavListIsEmpty(){
        let likedMealsList = getLikedMealsList();
    
        if (likedMealsList.length == 0){
            $('#content').hide();
            $('#emptyListContainer').show();
            updatePagination(0, 0);
        } 
        else {
            $('#emptyListContainer').hide();
            $('#content').show();
        }
    }

    function showMealAt(index){
        let likedMealsList = getLikedMealsList();

        if (likedMealsList.length === 0){
            currentIndex = 0;
            resetCardFields();
            checkFavListIsEmpty();
            return;
        }

        currentIndex = ((index % likedMealsList.length) + likedMealsList.length) % likedMealsList.length;
        let mealObj = JSON.parse(localStorage.getItem(likedMealsList[currentIndex]));

        resetCardFields();
        checkFavListIsEmpty();
        insertMealCardV2(mealObj);
        insertMealInstruction(mealObj);
        insertToolbar(mealObj);
        updatePagination(currentIndex, likedMealsList.length);
    }

    function renderMealCard(){
        let likedMealsList = getLikedMealsList();

        if (currentIndex >= likedMealsList.length){
            currentIndex = Math.max(0, likedMealsList.length - 1);
        }

        showMealAt(currentIndex);
    }

    function resetCardFields(){
        $('#mealTitle').html('');
        $('#mealImg').html('');
        $(`#ingredientList`).html('');
        $(`#mealInstruction`).html('');
        $('.toolbar-wrapper').html('');
    }

    function main(){
        $('#favNext').on('click', function(){
            showMealAt(currentIndex + 1);
        });
        $('#favPrev').on('click', function(){
            showMealAt(currentIndex - 1);
        });
        renderMealCard();
    }

    main();

})()
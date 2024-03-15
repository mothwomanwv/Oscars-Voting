// Get DOM elements
const sortableList = document.querySelector('.sortable-list');
const numList = document.querySelector('.num-col');

// ****************** ADD PROPERTIES TO MOVIES ARR *************************


// add movies to list function executed on page load:
document.addEventListener('DOMContentLoaded', function() {
    addProperties(movies) 
});   


function addProperties(moviesArr) {

    // remove "A"/"The" from title for alphabetizing
    for (mov of moviesArr) {
        mov.noATheName = mov.name.replace("The ", "").replace("A ", "");
    }

    renderMovies(moviesArr);
}


// ****************** RENDER MOVIES *************************


function renderMovies(moviesArr) {

    sortableList.innerHTML = '';

    // sort movies alphabetically
    moviesArr.sort(function(a,b) {
        return a.noATheName > b.noATheName ? 1 : -1;
    });

    // dynamically create movie holder divs
    for (mov of moviesArr) {

        let i = moviesArr.indexOf(mov);

        // rank numbering
        const rankNum = document.createElement('div');
        rankNum.className = 'num-rank';
        rankNum.textContent = i + 1;
        numList.appendChild(rankNum);

        // movie holder div
        const movieLIDiv = document.createElement('div');
        movieLIDiv.className = 'movie-div';
        sortableList.appendChild(movieLIDiv);

        // drag icon
        const dragIcon = document.createElement('span');
        dragIcon.className = 'icons';
        dragIcon.id = "drag-icon"; 
        dragIcon.innerHTML = "<img src='./images/icons/grip-vertical.svg' alt='vertical drag-indicator'>";
        movieLIDiv.appendChild(dragIcon);

        // movie poster
        const poster = new Image();
        // ====== temp image ==========
        poster.src = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`;
        poster.className = 'movie-poster';
        movieLIDiv.appendChild(poster);

        // title of movie div
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title-div';
        titleDiv.textContent = mov.name;
        movieLIDiv.appendChild(titleDiv);

        // arrows div
        const arrowsDiv = document.createElement('div');
        arrowsDiv.className = 'arrows';
        movieLIDiv.appendChild(arrowsDiv);

        // up arrow 
        const upBtn = document.createElement('button');
        upBtn.classList.add('icons', 'arrow-up');
        upBtn.innerHTML = "<img src='./images/icons/arrow-up.svg' alt='move item up'>";
        arrowsDiv.appendChild(upBtn);
        upBtn.addEventListener('click', moveItem);

        // down arrow 
        const downBtn = document.createElement('button');
        downBtn.classList.add('icons', 'arrow-down');
        downBtn.innerHTML = "<img src='./images/icons/arrow-down.svg' alt='move item down'>";
        arrowsDiv.appendChild(downBtn);
        downBtn.addEventListener('click', moveItem);

    } // end for()


    // ablity to drag icons/imgs ruins the drag and drop functionality
    const images = document.querySelectorAll("img");

    for (img of images) {
       img.ondragstart = () => false;
    }

}  // end renderMovies()



// ****************** SORTABLE LIST *************************

// *************** DRAG/DROP METHODS ***************


let isDragging = false;         // if any item is currently being dragged
let currentItem = null;         // item being dragged
let sortableListOffsetY = 0;   // distance between currentItem and top of list div
let initY = 0;               // inital pos of mouse when item is selected


// the "mousedown" event
document.addEventListener("mousedown", (e) => {

    // only activate drag/drog when clicking outside of arrows
    if (!e.target.closest(".arrows")) {

        // returns the closest .titlediv class elem to the target elem
        const item = e.target.closest(".movie-div");

        if(item) {
            isDragging = true;
            currentItem = item;
            sortableListOffsetY = currentItem.offsetTop;
            document.body.style.userSelect = 'none';
            currentItem.style.top = sortableListOffsetY + "px";
            initY = e.clientY   //initPos is where user clicked
        } 

    } // end outer if()

});  // end "mousedown" EventListener



// the "mousemove" event
document.addEventListener("mousemove", (e) => {

    //check if item is selected while mouse is moving
    if (isDragging && currentItem) {

        currentItem.classList.add('dragging');
        
        // calc new positon for item based on previous mouse pos(initY) and current mouse pos (e.clientY)
        let newTop = sortableListOffsetY - (initY - e.clientY);
        currentItem.style.top = newTop + "px";

        if(newTop < -50) {
            newTop = -50;
        } else if (newTop > sortableList.offsetHeight - 30) {
            newTop = sortableList.offsetHeight - 30;
        }

        currentItem.style.top = newTop + "px";

        // make dragged item drop after desired sibling item
        // store all items without .dragging class
        let itemSiblings = [...document.querySelectorAll('.movie-div:not(.dragging)')];

        // identify the nextItem based on mouse pos relative to sortableList and pos of item sibling
        let nextItem = itemSiblings.find((sibling) => {
            return (e.clientY - sortableList.getBoundingClientRect().top <= sibling.offsetTop + sibling.offsetHeight / 2);
        });

        // keeps margin at 10px while NOT TARGETED for drag/drop
        itemSiblings.forEach((sibling) => {
            sibling.style.marginTop = '10px';
        });

        // set margin spacing while TARGETED for drag/drop
        if (nextItem) {
            nextItem.style.marginTop = currentItem.offsetHeight + 20 + 'px';
        }

        sortableList.insertBefore(currentItem, nextItem);

    } //end outer if()

});  // end "mousemove" EventListener



// the "mouseup" event
document.addEventListener("mouseup", (e) => {

    // reset .dragging/currentItem/topPos/isDragging boolean to deafaults
    if(currentItem) {
        currentItem.classList.remove("dragging");
        currentItem.style.top = 'auto';
        currentItem = null;
        isDragging = false;

        document.body.style.userSelect = 'auto';
    }

    let itemSiblings = [...document.querySelectorAll('.movie-div:not(.dragging)')];

    // reset margin 
    itemSiblings.forEach((sibling) => {
        sibling.style.marginTop = '10px';
    });

});  // end "mouseup" EventListener




// *************** ARROW METHODS ***************

function moveItem() {

    // UP
    // get all UP arrow buttons -- put in array
    var upBtns = Array.from(document.querySelectorAll(".arrow-up"));

    // get index of specific up-button clicked
    let UPitemIndex = upBtns.indexOf(this);


    // DOWN
    // get all DOWN arrow buttons -- put in array
    var downBtns = Array.from(document.querySelectorAll(".arrow-down"));

    // get index of specific down-button clicked
    let DOWNitemIndex = downBtns.indexOf(this);


    // DIVS
    // get movieDivs -- put in array
    var movDivs = Array.from(document.querySelectorAll(".movie-div"));


    // *************** UP ***************
    // if 'this' is an UP arrow btn (+1 because 0 if falsey)
    if (UPitemIndex + 1) {

        // get CURRENT movie-div (the one user wants to move)
        let currentItem = movDivs[UPitemIndex];

        // get item ABOVE movie-div
        let aboveItem = movDivs[UPitemIndex -1]

         // only move if NOT top item
        if(aboveItem) {
            // currentItem.classList.add('moving');
            sortableList.insertBefore(currentItem, aboveItem);
    
            // ============ ADD GSAP SWAP ANIMATION LATER ==================

        } else {
            // shake first item if trying to move up
            // use gsap instead of css
            TweenMax.fromTo(currentItem, 0.1, {x:-5}, {x:5, clearProps:"x", repeat:2});

        } // end inner if()


    // *************** DOWN ***************
    // if 'this' is down btn 
    } else {

        // get CURRENT movie-div (the one user wants to move)
        currentItem = movDivs[DOWNitemIndex];

        // get item BELOW movie-div
        let belowItem = movDivs[DOWNitemIndex +1]


        // only move if NOT bottom item
        if(belowItem) {
            belowItem.parentNode.insertBefore(currentItem, belowItem.nextSibling);

            // ============ ADD GSAP SWAP ANIMATION LATER ==================

        } else {
            // shake last item if trying to move down
            TweenMax.fromTo(currentItem, 0.1, {x:-5}, {x:5, clearProps:"x", repeat:2});

        } // end inner if()

    }  // end outer if()

}   // end moveItem() function





// ************************ VOTING *****************************


// *************** SUBMIT VOTE ***************

// called by submit vote btn on DOM
function submitVote() {

    // get all movie title divs
    const titleDiv = document.querySelectorAll('.title-div');

    // get title text in ranked order, push into new array
    const titlesVoteOrder = [];
    titleDiv.forEach(mov => titlesVoteOrder.push(mov.textContent));

    console.log(titlesVoteOrder);  


    // refresh page after submit for next voter
    location.reload();

}




// *************** CALCULATE WINNER ***************

// called by calc winner btn on DOM
function calcWinner() {
    console.log('test');

}
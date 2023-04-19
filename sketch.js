const rangeInputs = document.querySelectorAll('input')
rangeInputs.forEach(input => {
    input.addEventListener('change', redrawOnChange)
})

function redrawOnChange(event){
    //Edit values
    angle = document.querySelector('#angleVal').value
    childLength = document.querySelector('#childLenVal').value/100
    nChildrenPerGen = document.querySelector('#nChildPerGenVal').value
    let nGeneration = document.querySelector('#nGenerationVal').value
    minLength = stemLength * Math.pow(childLength, nGeneration)

    redraw() //redraw is defined don't worry

    //Edit number of branches span
    document.getElementById('branchesNSpan').innerText = branchesN
}

document.querySelector('#saveCanvas').addEventListener('click', ()=>{
    saveCanvas('my-L-system', 'jpg')
})

//Arbitrary values, they might get updated by the DOM
let angle = 25
let childLength = 66/100
let nChildrenPerGen = 2
let minLength = 2

let theta
let stemLength = 180

let branchesN = 1

redrawOnChange()

// P5js function below
function setup() {
    let c = createCanvas(1136, 640);
    //No automatic redraw
    noLoop()
}


function draw() {
    //Canvas set up
    background(0);
    frameRate(20)
    //Color of our lines
    stroke('rgb(156, 173, 58)')
    theta = radians(angle)
    branchesN = 1

    // Start the tree from the bottom of the screen
    translate(width / 2, height);
    // rotate(theta)
    // Draw a line of stemLength pixels
    line(0, 0, 0, -stemLength);
    // Move to the end of that line
    translate(0, -stemLength);
    // Start the recursive branching!
    branch(stemLength);
}

function branch(length){
    //Each branch will be 2/3 the length of its parent
    length = length*childLength

    // Stop creating branches if they are too small, base case recursion
    if(length>=minLength){

        if(nChildrenPerGen%2===1){
            branchesN++
            //if odd number of children, there is a branch which is a direct continuation of the stem
            push()
            line(0, 0, 0, -length); // Draw the branch
            translate(0, -length); // Move to the end of the branch
            branch(length); // Ok, now call myself to draw two new branches!!
            pop();// Whenever we get back here, we "pop" in order to restore the previous matrix state
        }

        //Right branch
        for(let i=1 ; i<=Math.floor(nChildrenPerGen/2) ; i++){
            branchesN++
            push()// Save the current state of transformation (i.e. where are we now)
            rotate(theta*i); // Rotate by theta
            line(0, 0, 0, -length); // Draw the branch
            translate(0, -length); // Move to the end of the branch
            branch(length); // Ok, now call myself to draw two new branches!!
            pop();// Whenever we get back here, we "pop" in order to restore the previous matrix state
        }
    
        // Repeat the same thing for the left branch
        for(let i=1 ; i<=Math.floor(nChildrenPerGen/2) ; i++){
            branchesN++
            push();
            rotate(-theta*i);
            line(0, 0, 0, -length);
            translate(0, -length);
            branch(length);
            pop();
        }
    }
}
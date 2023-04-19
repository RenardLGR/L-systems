const rangeInputs = document.querySelectorAll('input')
rangeInputs.forEach(input => {
    input.addEventListener('change', redrawOnChange)
})

function redrawOnChange(event){
    //Edit values
    angle = Number(document.querySelector('#angleVal').value)
    childLength = Number(document.querySelector('#childLenVal').value)/100
    nChildrenPerGen = Number(document.querySelector('#nChildPerGenVal').value)
    let nGeneration = Number(document.querySelector('#nGenerationVal').value)
    minLength = stemLength * Math.pow(childLength, nGeneration)
    minLength = minLength.toFixed(5)
    //Update branches coordinates
    branches = [ [[568, 640], [568, 460]] ]
    getBranches([568, 460], -90, stemLength)

    //Draw branches
    branchIndex = branches.length
    redraw() //redraw is defined don't worry

    //Edit number of branches span
    document.getElementById('branchesNSpan').innerText = branches.length
}

document.querySelector('#saveCanvas').addEventListener('click', ()=>{
    saveCanvas('my-L-system', 'jpg')
})

document.querySelector('#animate').addEventListener('click', ()=> {
    //Activate the first branch to draw to index 0
    branchIndex = 0
    //Activate loop, so a new branch is drawned at each refresh
    loop()
})

//Arbitrary values, they might get updated by the user
let angle = 25
let childLength = 66/100
let nChildrenPerGen = 2
let minLength = 2

let theta
let stemLength = 180

//Keeping track variables
let branchesN = 1 //total number of branches
//First branch initialized
let branches = [ [[568, 640], [568, 460]] ]

getBranches([568, 460], -90, stemLength) //starting coords, starting angle, starting stem length
let branchIndex = branches.length //Keep track of the index the last branch should be drawn, by default, every branches are drawn, but if we want to animate, this will be set to 0 

redrawOnChange() //first draw

// console.log(branches, branches.length);


// P5js functions
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

    //Animate draws a new branch on each fram
    for(let i=0 ; i<branchIndex && i<branches.length ; i++){
        let [[startX, startY], [endX, endY]] = branches[i]
        line(startX, startY, endX, endY);
    }

    branchIndex++

    //Stop the redraw after the end 
    if(branchIndex > branches.length){
        noLoop()
    }
}



//Custom functions

//From starting coordinates [x, y], angle in degrees and a length, returns the destination coordinates [x, y]
function calculateDestination(start, theta, length){
    let [x, y] = start
    let radians = theta * (Math.PI/180)
    return [x-Math.cos(radians)*length, y+Math.sin(radians)*length]
}

//Add to variable branches every branches our system have. A branch is a segment given by an array of couples [[startX, startY], [endX, endY]]
function getBranches(start, theta, length){
        //Each branch is smaller than its parent by a ratio of childLength %
        length = length*childLength

        // Stop creating branches if they are too small, base case recursion
        if(length+0.01>minLength){
            
            //if odd number of children, there is a branch which is a direct continuation of the stem
            if(nChildrenPerGen%2===1){
                let destination = calculateDestination(start, theta, length)
                branches.push([start, destination])
                getBranches(destination, theta, length)
            }
    
            //Left branch
            for(let i=1 ; i<=Math.floor(nChildrenPerGen/2) ; i++){
                let newTheta = theta + i*angle
                let destination = calculateDestination(start, newTheta, length)
                branches.push([start, destination])
                getBranches(destination, newTheta, length)
            }
        
            // Repeat the same thing for the right branch
            for(let i=1 ; i<=Math.floor(nChildrenPerGen/2) ; i++){
                let newTheta = theta - i*angle
                let destination = calculateDestination(start, newTheta, length)
                branches.push([start, destination])
                getBranches(destination, newTheta, length)
            }
        }
}






// This version below was using a code close to what the tutorial had : https://p5js.org/examples/simulate-recursive-tree.html
//The behavior wouldn't allow us to access each individual branch. Hence it is not used.

// function draw() {
//     //Canvas set up
//     background(0);
//     frameRate(20)
//     //Color of our lines
//     stroke('rgb(156, 173, 58)')
//     theta = radians(angle)
//     branchesN = 1

//     // Start the tree from the bottom of the screen
//     translate(width / 2, height);
//     // rotate(theta)
//     // Draw a line of stemLength pixels
//     line(0, 0, 0, -stemLength);
//     // Move to the end of that line
//     translate(0, -stemLength);
//     // Start the recursive branching!
//     branch(stemLength);
// }

// function branch(length){
//     //Each branch will be 2/3 the length of its parent
//     length = length*childLength

//     // Stop creating branches if they are too small, base case recursion
//     if(length>=minLength){

//         if(nChildrenPerGen%2===1){
//             branchesN++
//             //if odd number of children, there is a branch which is a direct continuation of the stem
//             push()
//             line(0, 0, 0, -length); // Draw the branch
//             translate(0, -length); // Move to the end of the branch
//             branch(length); // Ok, now call myself to draw two new branches!!
//             pop();// Whenever we get back here, we "pop" in order to restore the previous matrix state
//         }

//         //Right branch
//         for(let i=1 ; i<=Math.floor(nChildrenPerGen/2) ; i++){
//             branchesN++
//             push()// Save the current state of transformation (i.e. where are we now)
//             rotate(theta*i); // Rotate by theta
//             line(0, 0, 0, -length); // Draw the branch
//             translate(0, -length); // Move to the end of the branch
//             branch(length); // Ok, now call myself to draw two new branches!!
//             pop();// Whenever we get back here, we "pop" in order to restore the previous matrix state
//         }
    
//         // Repeat the same thing for the left branch
//         for(let i=1 ; i<=Math.floor(nChildrenPerGen/2) ; i++){
//             branchesN++
//             push();
//             rotate(-theta*i);
//             line(0, 0, 0, -length);
//             translate(0, -length);
//             branch(length);
//             pop();
//         }
//     }
// }
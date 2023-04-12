const rangeInputs = document.querySelectorAll('input')
rangeInputs.forEach(input => {
    input.addEventListener('mousemove', setOutput)
})


function setOutput(event){
    angle = document.querySelector('#angleVal').value
    childLength = document.querySelector('#childLenVal').value/100
    nChildrenPerGen = document.querySelector('#nChildPerGenVal').value

    console.log(angle, childLength, nChildrenPerGen);
}

let angle = 25
let childLength = 66/100
let nChildrenPerGen = 2

let theta
let stemLength = 120

function setup() {
    createCanvas(710, 400);
}

function draw() {
    //Canvas set up
    background(0);
    frameRate(30)
    //Color of our lines
    stroke(156, 173, 58)
    theta = radians(angle)


    // Start the tree from the bottom of the screen
    translate(width / 2, height);
    rotate(theta)
    // Draw a line 120 pixels
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
    if(length>2){
        push();// Save the current state of transformation (i.e. where are we now)

        //Right branch
        rotate(theta); // Rotate by theta
        line(0, 0, 0, -length); // Draw the branch
        translate(0, -length); // Move to the end of the branch
        branch(length); // Ok, now call myself to draw two new branches!!
        pop();// Whenever we get back here, we "pop" in order to restore the previous matrix state
    
        // Repeat the same thing for the left branch
        push();
        rotate(-theta);
        line(0, 0, 0, -length);
        translate(0, -length);
        branch(length);
        pop();
    }
}
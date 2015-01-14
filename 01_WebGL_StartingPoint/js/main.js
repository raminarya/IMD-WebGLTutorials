/*

WebGL Tutorial - Starting Point

Ryan Bottriell - 2014
ryanbottriell@live.ca

*/


//we create global variables which point to
//the canvas DOM element and the webGL 
//drawing context for the canvas
var canvas,
    gl;

//called when the page is done loading
function onPageLoaded()
{
    //we store the canvas DOM element in our variable
    canvas = document.getElementById("webgl-canvas");
    
    //this function gets the drawing context for the 
    //canvas element, it will return an undefined 
    //object if it fails
    gl = canvas.getContext('webgl');
    
    //a simple check to make sure the context
    //was successfully initialized
    if(!gl) 
    {
        alert("webgl not supported");
    }
    
    //requestAnimationFrame lets the browser
    //know that we have drawing to do
    //we pass it a callback function
    window.requestAnimationFrame(update);
}

function update()
{
    //this allows us to keep the loop going
    window.requestAnimationFrame(update);
    
    // update code here //
    
    
    //////////////////////
    
    render();
}

function render()
{
    // render code here //
    
    
    //////////////////////
}
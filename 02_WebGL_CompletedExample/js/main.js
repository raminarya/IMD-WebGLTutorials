/*

WebGL Tutorial - Completed Exmaple

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
    
    //as with OpenGL, setting values is usually a 
    //function call in WebGL
    //clear color sets the color that is used to 
    //clear the frame
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    
    //clear is the function we call to clear the frame
    //is takes in a bit mask that describes which buffers to clear
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    //////////////////////
}
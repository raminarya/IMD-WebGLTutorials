/*

Three.js Tutorial - Starting Point

Ryan Bottriell - 2014
ryanbottriell@live.ca

*/

//TODO declare global variables


//called when the page is done loading
function onPageLoaded()
{
    //TODO initalize input events
    
    //TODO initialize three.js renderer
    
    //TODO setup three.js scene
    
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
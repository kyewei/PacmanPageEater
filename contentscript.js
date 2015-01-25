//(function() {

var hmm;


var catify = function () {
    var images = document.getElementsByTagName('img');
    var srcList = [];
    for(var i = 0; i < images.length; i++) {
        images[i].src = "https://upload.wikimedia.org/wikipedia/commons/2/22/Turkish_Van_Cat.jpg";
    }
};

var drawcontext;
var drawcanvas;
function createCanvasOverlay()
{
    // Create a blank div where we are going to put the canvas into.
    var canvasContainer = document.createElement('div');
    // Add the div into the document
    document.body.appendChild(canvasContainer);
    canvasContainer.style.position="absolute";
    // Set to 100% so that it will have the dimensions of the document
    canvasContainer.style.left="0px";
    canvasContainer.style.top="0px";
    canvasContainer.style.width="100%";
    canvasContainer.style.height="100%";
    // Set to high index so that this is always above everything else
    // (might need to be increased if you have other element at higher index)
    canvasContainer.style.zIndex="1000";

    // Now we create the canvas
    myCanvas = document.createElement('canvas');
    myCanvas.style.width = canvasContainer.scrollWidth+"px";
    myCanvas.style.height = canvasContainer.scrollHeight+"px";
    // You must set this otherwise the canvas will be streethed to fit the container
    myCanvas.width=canvasContainer.scrollWidth;
    myCanvas.height=canvasContainer.scrollHeight;
    myCanvas.style.overflow = 'visible';
    myCanvas.style.position = 'absolute';
    // Add int into the container
    canvasContainer.appendChild(myCanvas);

    //myCanvas = document.createElement('canvas');
    var context=myCanvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0,0, myCanvas.width, myCanvas.height);

    drawcontext = context;
    drawcanvas = myCanvas;

};

/*var arrayofgreen = [];

function makeGreen (x,y) {
    var green = {};
    green.x=x;
    green.y=y;
    green.alive = true;
    return green;
};

function makeGreenArea (x1,y1,x2,y2) {
    var arr = [];

    for (var i=x1; i<= x2; i=i+8){
        arr.push(makeGreen(i,y1));
        arr.push(makeGreen(i,y2));
    }

    for (var i=y1; i<= y2; i=i+8){
        arr.push(makeGreen(x1,i));
        arr.push(makeGreen(x2,i));
    }
    return arr;
};*/

var worm = {};

var keys = {"w":false, "a":false, "s":false, "d": false};

function handleKeyDown(e) {
    if (e.keyCode ==65) {
        keys.a=true;
        //console.log(e.keyCode);
    } else if (e.keyCode ==87) {
        keys.w=true;
        //console.log(e.keyCode);
    } else if (e.keyCode ==68) {
        keys.d=true;
        //console.log(e.keyCode);
    } else if (e.keyCode ==83) {
        keys.s=true;
        //console.log(e.keyCode);
    }
};

function handleKeyUp(e) {
    if (e.keyCode ==65) {
        keys.a=false;
        //console.log(e.keyCode);
    } else if (e.keyCode ==87) {
        keys.w=false;
        //console.log(e.keyCode);
    } else if (e.keyCode ==68) {
        keys.d=false;
        //console.log(e.keyCode);
    } else if (e.keyCode ==83) {
        keys.s=false;
        //console.log(e.keyCode);
    }
};

var domlist = [];
var image;

function startGame() {

    var alldomarr = document.body.getElementsByTagName("*");
    for (var i =0; i< alldomarr.length; ++i) {
        var dom = alldomarr[i];
        if (dom.getBoundingClientRect() /*&& dom.nodeName != "DIV"*/ && dom.nodeName != "CANVAS"){
            domlist.push([dom, dom.getBoundingClientRect()]);
            //var domsize = dom.getBoundingClientRect();
            //arrayofgreen = arrayofgreen.concat(makeGreenArea(domsize.left, domsize.top, domsize.right, domsize.bottom));

        }
    }
    image = new Image();
    image.src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Pacman.svg/400px-Pacman.svg.png";
    image.loaded=false;
    image.onload= function() {
        image.loaded=true;
    }


    var pagerect = document.body.getBoundingClientRect();
    worm.x = (pagerect.left+pagerect.right)/2;
    worm.y = (pagerect.top+pagerect.bottom)/2;

    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    //console.log(arrayofgreen);
    setTimeout(loop, 20);
};

function drawGreen(green) {
    drawcontext.fillStyle="#00FF00";
    drawcontext.fillRect(green.x-2, green.y-2,2,2);
};
function drawWorm() {
    if (!image.loaded) {
        drawcontext.fillStyle="#964B00";
        drawcontext.fillRect(worm.x-8, worm.y-8,16,16);
    } else {
        var TO_RADIANS = Math.PI/180;

        drawcontext.save();
        drawcontext.translate(worm.x-16,worm.y-16);
        drawcontext.rotate(image.angle * TO_RADIANS);
        drawcontext.drawImage(image,/*worm.x*/-16,/*worm.y*/-16,32,32);
        drawcontext.fillStyle="#964B00";
        drawcontext.fillRect(-1, -1,2,2);
        drawcontext.restore();
    }
};

function drawDom(x1, y1, x2, y2) {
    drawcontext.fillStyle="#00FF00";
    drawcontext.rect(x1, y1,x2-x1,y2-y1);

    //drawcontext.stroke();
};

function shouldeatdom(dom,x,y) {

    var domloc = dom.getBoundingClientRect();
    var shouldeat = domloc.left <= worm.x && domloc.right >= worm.x && domloc.top <= worm.y && domloc.bottom >= worm.y;

    if (shouldeat) {
        var subdoms = dom.getElementsByTagName("*");
        if (subdoms.length===0) {
            return true;
        }

        var nosubdom = true;
        for (var i =0; i< subdoms.length; ++i) {
            var subdom = subdoms[i];

            if (subdom.nodeName == "CANVAS") {
                return false;
            } else if (subdom.getBoundingClientRect && subdom.style.visibility!="hidden") {
                /*if (subdom.style.visibility==="hidden") {
                    continue;
                }*/
                nosubdom =false;
                var result = shouldeatdom(subdom, x, y);
                if (result) {
                    //console.log("Should eat",domlist[i][0]);
                    subdom.style.visibility="hidden";
                }
            } else {
                //return false;
                continue;
            }
        }
        if (nosubdom) {
            return true;
        }
    } else {
        return false;
    }
}


function loop () {
    //console.log(keys);
    drawcontext.clearRect ( 0 , 0 , drawcanvas.width, drawcanvas.height );
    //drawcontext.clearRect ( worm.x-8 , worm.y-8 , 16,16);

    //drawcontext.fillStyle = '#FFFFFF';
    //drawcontext.fillRect(0,0, drawcanvas.width, drawcanvas.height);
    if (keys.w === true){
        worm.y=worm.y-16;
        //console.log("w");
        image.angle=270;
    }

    if (keys.s === true){
        worm.y=worm.y+16;
        //console.log("s");
        image.angle=90;
    }

    if (keys.a === true){
        worm.x=worm.x-16;
        //console.log("a");
        image.angle=180;
    }

    if (keys.d === true) {
        worm.x=worm.x+16;
        //console.log("d");
        image.angle=0;
    }



    /*arrayofgreen = arrayofgreen.filter(function(element) {
        return 16 < Math.sqrt(Math.pow((element.x-worm.x),2) + Math.pow((element.y-worm.y),2));
    });*/

    /*for (var i=0; i< arrayofgreen.length; ++i) {
        if (arrayofgreen[i].alive) {
            var good = 16 < Math.sqrt(Math.pow((arrayofgreen[i].x-worm.x),2) + Math.pow((arrayofgreen[i].y-worm.y),2));
            if (good)
                drawGreen(arrayofgreen[i]);
            else
                arrayofgreen[i].alive=false;
        }
    }*/
    //var needredraw=false;
    drawcontext.beginPath();
    for (var i=0; i< domlist.length; ++i) {
        var dom = domlist[i][0];
        if (domlist[i][0].style.visibility==="" /*&& domlist[i][0].nodeName != "CANVAS"*/) {

            var domloc = domlist[i][1];

            var result = shouldeatdom(dom, worm.x, worm.y);
            if (result) {
                //console.log("Should eat",dom);
                dom.style.visibility="hidden";
            } else {
                drawDom(domloc.left, domloc.top, domloc.right, domloc.bottom);
            }
        }
    }
    drawcontext.stroke();
    drawcontext.closePath()

    drawWorm(worm);


    setTimeout(loop, 50);
};
//createCanvasOverlay();
//startGame();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        // request is object being sent
        //this[request.action]();
        createCanvasOverlay();
        startGame();

    });
//})();

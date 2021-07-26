const app = document.querySelector('#app');
const menu = document.querySelector('.menu');
const page = document.querySelector('.page');
const c = page.getContext('2d');

var historyList = [];
var line = [];
var ctrl = false;
var z = false;

var pageZoom = 600; page.style.width = pageZoom + 'px';
var scrollSpeed = 25;
var mouseDown = false;
var mouseX; var mouseY;
var tool = 0;
var col = black;
var width = 50;
var iwidth = 10;

function save(){
	console.log(historyList);
};

function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function start(){
  await sleep(2*1000);
  app.style.display = 'block';
}

start();

page.onmousedown = function(){
	c.beginPath();
	mouseDown = true;
	if (mouseDown==true
		&& tool==1){
		line.push(new Brush(mouseX,mouseY,mouseX,mouseY,width,col));
		for (var i = 0; i < line.length; i++) {
			line[i].draw();
		}
		c.beginPath();
	}
}

window.onmouseup = function(){
	if (mouseDown == true){
		mouseDown = false;
		if (line.length !== 0) {
			historyList.push(line)

			//ADD TO LIST
			var node = document.createElement("li");
			var textnode = document.createTextNode("Pencil");
			node.appendChild(textnode);

			var node2 = document.createElement("P");
			var textnode2 = document.createTextNode(' ');
			node2.appendChild(textnode2);
			node2.className += 'history-style';
			node2.style['background-color'] = col;

			var node3 = document.createElement("P");
			var textnode3 = document.createTextNode(width);
			node3.appendChild(textnode3);
			node3.className += 'history-style2';

			node.appendChild(node2);
			node.appendChild(node3);
			node.style['display'] = 'flex';

			document.getElementById("list").appendChild(node);

		  var elem = document.getElementById('history-list');
		  elem.scrollTop = elem.scrollHeight;

			line = [];
		}
	}
}

window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);
window.addEventListener("mousemove", function(){
	var mouse = getpos(event);
	mouseX = mouse.x;
	mouseY = mouse.y;

	// >>>>>>>>>>>>>>>>>> IF ERROR, TRY UN COMMENT THIS <<<<<<<<<<<<<<
	// c.clearRect(0, 0, page.width, page.height);
	// for (var i = 0; i < historyList.length; i++) {
	// 	for (var j = 0; j < historyList[i].length; j++)
	// 	historyList[i][j].draw();
	// 	c.beginPath();
	// }
	// >>>>>>>>>>>>>>>>>> IF ERROR, TRY UN COMMENT THIS <<<<<<<<<<<<<<

	if (mouseDown==true
		&& tool==1){
		line.push(new Brush(mouseX,mouseY,mouseX,mouseY,width,col));
		for (var i = 0; i < line.length; i++) {
			line[i].draw();
		}
		c.beginPath();
	}
});

document.addEventListener("mousewheel", function(e){
    wDelta = e.wheelDelta < 0 ? scrollDown() : scrollUp();
});

document.querySelector('#width-div').addEventListener("mousewheel", function(e){
    wDelta = e.wheelDelta < 0 ? widthDown() : widthUp();
});

selectCol('black');

function getpos(event) {
	var k = page.getBoundingClientRect();
      scaleX = page.width / k.width,    // relationship bitmap vs. element for X
      scaleY = page.height / k.height;  // relationship bitmap vs. element for Y
	return {
		x: (event.clientX - k.left) * scaleX,
		y: (event.clientY - k.top) * scaleY
	};
};

function onKeyDown(event) {
  var keyCode = event.keyCode;
  switch (keyCode) {
    case 17: //ctrl
      ctrl = true;
      break;
    case 90: //z
      z = true;
      if (ctrl==true){
      	historyList.pop();
      	document.getElementById("list").removeChild(document.getElementById("list").lastElementChild);

				c.clearRect(0, 0, page.width, page.height);
				for (var i = 0; i < historyList.length; i++) {
					for (var j = 0; j < historyList[i].length; j++)
					historyList[i][j].draw();
					c.beginPath();
				}

      	console.log('undo')
      }
      break;
  }
};

function onKeyUp(event) {
  var keyCode = event.keyCode;

  switch (keyCode) {
    case 17: //ctrl
      ctrl = false;
      break;
    case 90: //z
      z = false;
      break;
  }
};

function scrollUp() {
	if (ctrl == true) {
		pageZoom += scrollSpeed;
		page.style.width = pageZoom + 'px';
	}
};

function scrollDown() {
	if (ctrl == true && pageZoom > 100) {
		pageZoom += -scrollSpeed;
		page.style.width = pageZoom + 'px';
	}
};

var iwidth = 10;
function widthUp(){
	width += iwidth;
	document.querySelector('#width').innerHTML = width;
};
function widthDown(){
	if (width > iwidth){
		width -= iwidth;
	}
	document.querySelector('#width').innerHTML = width;
};

function selectCol(color){
	col=color;

	if (col=='black'){document.querySelector('#black').classList.add("selected");}
	else{document.querySelector('#black').classList.remove("selected");};

	if (col=='red'){document.querySelector('#red').classList.add("selected");}
	else{document.querySelector('#red').classList.remove("selected");};

	if (col=='green'){document.querySelector('#green').classList.add("selected");}
	else{document.querySelector('#green').classList.remove("selected");};

	if (col=='blue'){document.querySelector('#blue').classList.add("selected");}
	else{document.querySelector('#blue').classList.remove("selected");};

	if (col=='white'){document.querySelector('#white').classList.add("selected");}
	else{document.querySelector('#white').classList.remove("selected");};
};

//

function Brush(x1,y1,x2,y2,width,color){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.width = width;
	this.color = color;

	this.draw = function(){
		c.strokeStyle = this.color;
		c.lineWidth = this.width;
		c.lineCap = 'round';
		c.lineTo(this.x1,this.y1);
		c.stroke();
		c.beginPath();
		c.moveTo(this.x2,this.y2);
	}
}

function selectTool(t){
	tool = t;
	if (tool == 1){
		document.querySelector('.pencil').style.display = 'block';
		document.querySelector('#pencil').style['background-color'] = 'orangered';
	}else{
		document.querySelector('.pencil').style.display = 'none';
		document.querySelector('#pencil').style['background-color'] = '';
	}

	if (tool == 2){
		document.querySelector('.shape').style.display = 'block';
		document.querySelector('#shape').style['background-color'] = 'orangered';
	}else{
		document.querySelector('.shape').style.display = 'none';
		document.querySelector('#shape').style['background-color'] = '';
	}
};

// function animate(event) {
// 	requestAnimationFrame(animate);


// }

// animate();
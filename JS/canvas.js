var Canvas = {
	mouseX: 0,
	mouseY: 0,
	mouseDown: 0,
	touchX: 0,
	touchY: 0,
	lastX: -1,
	lastY: -1,
	init: function () {
		canvas = document.getElementById('canvas-sign');
		context = canvas.getContext('2d');
		document.getElementById('submit').style.display = 'none';
		canvas.addEventListener('mousedown', Canvas.sketchpad_mouseDown, false);
		canvas.addEventListener('mousemove', Canvas.sketchpad_mouseMove, false);
		window.addEventListener('mouseup', Canvas.sketchpad_mouseUp, false);
		canvas.addEventListener('touchstart', Canvas.sketchpad_touchStart, false);
		canvas.addEventListener('touchend', Canvas.sketchpad_touchEnd, false);
		canvas.addEventListener('touchmove', Canvas.sketchpad_touchMove, false);
		document.getElementById('erase').addEventListener('click', function () {
			context.clearRect(0, 0, canvas.width, canvas.height);
			document.getElementById('submit').style.display = 'none';
		});
	},
	drawLine: function(context, x, y, size){
		if (Canvas.lastX == -1) {
			Canvas.lastX = x;
			Canvas.lastY = y;
		}
		context.strokeStyle = '#45505b';
		context.lineCap = 'round';
		context.beginPath();
		context.moveTo(Canvas.lastX, Canvas.lastY);
		context.lineTo(x, y);
		context.lineWidth = size;
		context.stroke();
		context.closePath();
		Canvas.lastX = x;
		Canvas.lastY = y;

		document.getElementById('submit').style.display = 'block';
	},
	sketchpad_mouseDown: function () {
		Canvas.mouseDown = 1;
		Canvas.drawLine(context, Canvas.mouseX, Canvas.mouseY, 4);
	},
	sketchpad_mouseUp: function () {
		Canvas.mouseDown = 0;
		Canvas.lastX = -1;
		Canvas.lastY = -1;
	},
	sketchpad_mouseMove: function (e) {
		Canvas.getMousePos(e);
		if (Canvas.mouseDown == 1) {
			Canvas.drawLine(context, Canvas.mouseX, Canvas.mouseY, 4);
		}
	},
	getMousePos: function (e) {
		if (!e)
			var e = event;

		if (e.offsetX) {
			Canvas.mouseX = e.offsetX;
			Canvas.mouseY = e.offsetY;
		} else if (e.layerX) {
			Canvas.mouseX = e.layerX;
			Canvas.mouseY = e.layerY;
		}
	},
	sketchpad_touchStart: function (e) {
		Canvas.getTouchPos();
		Canvas.drawLine(context, Canvas.touchX, Canvas.touchY, 4);
		event.preventDefault();
	},
	sketchpad_touchEnd: function () {
		Canvas.lastX = -1;
		Canvas.lastY = -1;
	},
	sketchpad_touchMove: function (e) {
		Canvas.getTouchPos(e);
		Canvas.drawLine(context, Canvas.touchX, Canvas.touchY, 4);
		event.preventDefault();
	},
	getTouchPos: function (e) {
		if (!e)
			var e = event;

		if (e.touches) {
			if (e.touches.length == 1) {
				var touch = e.touches[0];
				Canvas.touchX = touch.pageX - touch.target.offsetLeft;
				Canvas.touchY = touch.pageY - touch.target.offsetTop;
			}
		}
	},
};
$(document).ready(function () {
	Canvas.init();
});

var d = document,
		cancel1 = q('#upload-cancel'),
		upOverlay = q('.upload-overlay');

function getImage() {
  var preview = q('.effect-image-preview'),
  		file    = f('input[type=file]');
  
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
  	preview.src = reader.result;
  	upOverlay.style.display = "block";
  }, false);

  if (file) {
    reader.readAsDataURL(file);
  }
}

cancel1.addEventListener('click', close);

function close() {
	upOverlay.style.display = "none";
}

function q(el) {
	return d.querySelector(el);
}

function f(el) {
	return d.querySelector(el).files[0];
}

/* canvas */

var mouse = { x : 0,  y : 0, },
		selected = false,
		num1 = 0,
		num2 = 0,
		canvas = q("#canvas"),
		ctx = canvas.getContext("2d"),
		image = q(".effect-image-preview"),
    btn = q("#upload-submit");

var Rect = function (x, y, w, h, img) 
{
	this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

Rect.prototype = {
	image: function() {
    var image = this.img,
    		width = image.width,
    		num = 1,
    		input = q(".upload-resize-controls-value"),
    		effect = q(".upload-effect[name='effect']:checked");
    if (image.width > canvas.width) {
      num = image.width / canvas.width;
      this.w = image.width / num;
      this.h = image.height / num;
      
      this.w = (image.width / num) * input.value / 100;

      num = canvas.width / this.w;
      
      this.h = this.h / num;
     
      
      if (!this.x && !this.y) {
        this.x = canvas.width / 2 - this.w / 2;
        this.y = canvas.height / 2 - this.h / 2;
      }
    } else {
      this.w = image.width * input.value / 100;
      this.h = image.height * input.value / 100;
      if (!this.x && !this.y) {
        this.x = canvas.width / 2 - this.w / 2;
        this.y = canvas.height / 2 - this.h / 2;
      }
    }
    
    switch (effect.value) {
    	case "none":
    		ctx.filter = "none";
    		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    		break;
    	case "chrome":
    		ctx.filter = "grayscale(100%)";
    		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    		break;
    	case "sepia":
    		ctx.filter = "sepia(100%)";
    		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    		break;
    	case "marvin":
    		ctx.filter = "invert(100%)";
    		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    		break;
    	case "phobos":
    		ctx.filter = "blur(5px)";
    		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    		break;
    	case "heat":
    		ctx.filter = "brightness(200%)";
    		ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    		break;
    }
    
    //sendCanvas(canvas);
    //ctx.filter = "blur(5px)";
    btn.onclick = function() {
      var img = canvas.toDataURL();//.replace("data:image/png;base64,", "");

      var sender = new XMLHttpRequest();
      sender.open("POST", "js/script.php", true);
      sender.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      sender.onreadystatechange = function() {
        if (sender.readyState == 4) {
          console.log(sender.responseText);
        } 
      }
      sender.send("img=" + img);
    }
    btn.addEventListener('click', close);
  }
}

var isCursorInRect = function (rect) {
  return mouse.x > rect.x && mouse.x < rect.x + rect.w && mouse.y > rect.y && mouse.y < rect.y + rect.h;
};

var pic = new Rect(0, 0, 150, 150, image);
setInterval(function () {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	pic.image();
  if (selected) 
  {
   selected.x = mouse.x - num1;
   selected.y = mouse.y - num2;
  }
}, 30);

canvas.onmousedown = function(e) {
  if (isCursorInRect(pic) ) {
    selected = pic;
    if (mouse.x > pic.w || (mouse.x < selected.w && mouse.y > selected.y)) {
      num1 = mouse.x - selected.x;
      num2 = mouse.y - selected.y;
    } else {
      num1 = mouse.x;
      num2 = mouse.y;
    }
  }
}

canvas.onmousemove = function(e) {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
};

canvas.onmouseup = function() {
  selected = false;
};

var con = q(".pictures.container"),
    gallery = q(".gallery-overlay"),
    galleryClose = q(".gallery-overlay-close"),
    galleryImage = q(".gallery-overlay-image"),
    picture = q(".picture");

con.addEventListener("click", function(event) {
  var el = event.target;
  if (el.tagName == "IMG") {
    gallery.style.display = "block";
    galleryImage.src = el.src; 
  }
});

galleryClose.addEventListener("click", function() {
  gallery.style.display = "none";
});

function conclusion() {
  var img = canvas.toDataURL();

  var sender = new XMLHttpRequest();
  sender.open("POST", "js/conclusion.php", true);
  sender.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  sender.onreadystatechange = function() {
    if (sender.readyState == 4) {
      
      
      var json = JSON.parse(sender.responseText);
      
      var obj = [];

      var template = document.getElementById('picture-template2').innerHTML;
      var html = _.template(template)({
          obj: json,
        });
      
      con.innerHTML = html;
    } 
  }
  sender.send();
}

conclusion();
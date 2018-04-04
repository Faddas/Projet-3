
/*constructeur*/
var Slider = {
	init:function(imgPath){
		this.currentSlide = 0;
		this.imgPath = imgPath;
	},
	/*Stockage du chemin des images et selection de l'image actuelle*/
	img:function(){
		document.getElementById('slides').src =  this.imgPath[this.currentSlide] ;
	},
	imgnext:function(){
		this.currentSlide++;
		if(this.currentSlide > this.imgPath.length-1){
			this.currentSlide = 0;
		}
		//document.getElementById('slides').src =  this.imgPath[this.currentSlide] ;
	},
	imgprev:function(){
		this.currentSlide--;
		if(this.currentSlide <  0){
			this.currentSlide = this.imgPath.length-1;
		}
	},
};

var slides = Object.create(Slider);
slides.init(['img/img1.PNG','img/img2.PNG','img/img3.PNG','img/img4.PNG']);
slides.img();


var next = $('.next');
next.click(function () {
	slides.imgnext();
	slides.img();
});

var prev = $('.prev');
prev.click(function(){
	slides.imgprev();
	slides.img();
});

var keyboard =$('body');
keyboard.keydown(function(event) {
	if (event.which === 39) {
		slides.imgnext();
		slides.img();
	} else if (event.which === 37) {
		slides.imgprev();
		slides.img();
	}
});

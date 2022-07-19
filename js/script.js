const upBtns = document.querySelectorAll(".--up");
const downBtn = document.querySelector(".--down");
const slides = document.querySelectorAll(".slide");
const slide_img = document.querySelectorAll(".slide_img img")
const backwardsBtn = document.querySelector('.backwards');
const slider = document.querySelector(".slider_container");

const isTouch = ('ontouchstart' in window)||(navigator.maxTouchPoints > 0)||(navigator.msMaxTouchPoints > 0);

let activeSlide = 0;

//helper функция для предотвращения множестевнного скролла
function throttle(callback, timeout) {

	let timer = null; //объект для замыкания

	return function (...args){
		if (timer) return;

		timer = setTimeout(() =>{
			callback(...args);

			clearTimeout(timer);
			timer=null;
		}, timeout);
	};
}


upBtns.forEach(upBtn =>{
	upBtn.addEventListener("click", () => {
		activeSlide--;
		turnSlide(false);
	});
})

downBtn.addEventListener("click", () => {
	activeSlide++;
	turnSlide(true);
});

function turnSlide(moveDown) {
	console.log(activeSlide)
	//крайнее верхнее положение, стрелка вверх
	if (activeSlide === -1) {
		activeSlide = slides.length - 1;
	}
	//крайнее нижнее положение, стрелка вниз
	if (activeSlide === slides.length) {
		const text = document.querySelector(".text_text");
		const arrowbox = document.querySelector(".slide_arrowbox");
		const body = document.querySelector("body");

		if (moveDown) {
			backwardsBtn.classList.add("--viewed");
			text.classList.add("--viewed");
			arrowbox.style.transform = `translateY(-${activeSlide * 100}vh)`;
			body.style.overflow = `visible`;
			activeSlide++;
		}else {
			backwardsBtn.classList.remove("--viewed");
			text.classList.remove("--viewed");
			arrowbox.style.transform = `translateY(0vh)`;
			body.style.overflow = `hidden`;
			activeSlide--;
		}
	}
	slider.style.transform = `translateY(-${activeSlide * 100}vh)`;
}




function handleMove(e){
	const maxDeltaX = 3;

	let viewportWidth = document.documentElement.clientWidth;
	let mouseX = e.pageX / viewportWidth * 2 - 1;
	let translateX = mouseX * maxDeltaX;

	if (activeSlide < slides.length)
		slide_img[activeSlide].style.transform = `translate(${translateX}vw)`;
}



let throttledHandleScroll = throttle(handleScroll, 150)

function handleScroll(e){
	//для checkDirection если свайп вверх, то движемся вниз и наоборот
	let touchDirection = checkDirection();
	let isDownScroll = isTouch? touchDirection > 0: e.wheelDelta < 0;

	if (isTouch && touchDirection === 0) return; //Если событие - нажатие, ничего не делаем
	if (isDownScroll){
		activeSlide++;
		turnSlide(true);
	}
	else{
		activeSlide--;
		turnSlide(false);
	}

}

let touchstartY = 0;
let touchendY = 0;
let touchstartX = 0;
let touchendX = 0;

function checkDirection() {
	const treshholdY = window.innerHeight * 0.15;

	let deltaX = Math.abs(touchendX - touchstartX);
	let deltaY = Math.abs(touchendY - touchstartY);

	let isUp = 0; //1 - up, -1 - down, 0 - not vertical
	if (deltaX < deltaY){
		// vertical Swipe
		if (deltaY < treshholdY) return isUp;

		if (touchendY < touchstartY)
			isUp = 1;
		else
			isUp = -1;
	}
	console.log("isUp = " + isUp)
	return isUp;
}



function setListeners(){
	//check if its touch device
	if (isTouch){
		document.addEventListener('touchstart', e => {
			touchstartY = e.changedTouches[0].screenY;
			touchstartX = e.changedTouches[0].screenX;
		})

		document.addEventListener('touchend', e => {
			touchendY = e.changedTouches[0].screenY;
			touchendX = e.changedTouches[0].screenX;
			throttledHandleScroll(e);
		})
	}
	else{
		slider.addEventListener('wheel', throttledHandleScroll); // Событие скролл для desktop
		document.addEventListener('mousemove', handleMove); //двигаем картинку при движении мыши
	}
}

setListeners();

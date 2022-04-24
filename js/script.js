const upBtns = document.querySelectorAll(".--up");
const downBtn = document.querySelector(".--down");
const slides = document.querySelectorAll(".slide");
const backwardsBtn = document.querySelector('.backwards');

const slider = document.querySelector(".slider_container");

let activeSlide = 0;

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
	//крайнее верхнее положение, стрелка вверх
	if (activeSlide === -1) {
		activeSlide = slides.length - 1;
	}
	//крайнее нижнее положение, стрелка вниз
	if (activeSlide === slides.length) {
		const text = document.querySelector(".text_text");
		// const text_container = document.querySelector(".text_container");
		const backwardsArr = document.querySelector(".backwards");
		const arrowbox = document.querySelector(".slide_arrowbox");
		const body = document.querySelector("body");

		if (moveDown) {
			backwardsArr.classList.add("--viewed");
			text.classList.add("--viewed");
			// text_container.style.display = `block`;
			arrowbox.style.transform = `translateY(-${activeSlide * 100}vh)`;
			body.style.overflow = `visible hidden`;
			activeSlide++;
		}else {
			backwardsArr.classList.remove("--viewed");
			text.classList.remove("--viewed");
			// setTimeout(( _ => text_container.style.display = `none`, 500));
			arrowbox.style.transform = `translateY(0vh)`;
			body.style.overflow = `hidden`;
			activeSlide--;
		}
	}
	slider.style.transform = `translateY(-${activeSlide * 100}vh)`;
}

//Функционал скролла
const COUNTER_THRESHOLD = 300;
const COUNTER_RESET_DURATION = 500;
let counter = 0;
let ableToScroll = true;


function reset() {
	ableToScroll = true;
	counter = 0;
}
function handleScroll(e) {
	counter += e.wheelDelta;

	if (ableToScroll) {
		if (Math.abs(counter) >= COUNTER_THRESHOLD && counter < 0) {
			activeSlide++;
			turnSlide(true);
			ableToScroll = false;
			setTimeout(reset, COUNTER_RESET_DURATION);
		} else if (Math.abs(counter) >= COUNTER_THRESHOLD && counter > 0) {
			activeSlide--;
			turnSlide(false);
			ableToScroll = false;
			setTimeout(reset, COUNTER_RESET_DURATION);
		}
	}

	e.preventDefault();
}

const maxDeltaX = 3;

const slide_img = document.querySelectorAll(".slide_img img")

function handleMove(e){

	// Get viewport dimensions
	let viewportWidth = document.documentElement.clientWidth;

	let mouseX = e.pageX / viewportWidth * 2 - 1;

	let translateX = mouseX * maxDeltaX;

	if (activeSlide < slides.length)
		slide_img[activeSlide].style.transform = `translate(${translateX}vw)`;
}





slider.addEventListener('wheel', handleScroll);
document.addEventListener('mousemove', handleMove);

var buttons = {
	play: document.getElementById("btn-play"),
	pause: document.getElementById("btn-pause"),
	stop: document.getElementById("btn-stop"),
};

// Create an instance of wave surfer with its configuration
var Spectrum = WaveSurfer.create({
	container: "#audio-spectrum",
	progressColor: "#4353ff00",
	waveColor: "#d9dcff00",
	barWidth: 0,
	barRadius: 0,
	barGap: 3,
	height: 50,
	cursorWidth: 1,
	backend: "MediaElement",
	plugins: [
		WaveSurfer.timeline.create({
			container: "#wave-timeline",
			offset: 0,
			height: 20,
		}),
	],
});

// zooming
document.querySelector("#slider").oninput = function () {
	Spectrum.zoom(Number(this.value));
};

let progressLine = document.querySelector(".progress-line");

// Handle Play button
buttons.play.addEventListener(
	"click",
	function () {
		Spectrum.play();

		// Enable/Disable respectively buttons
		buttons.stop.disabled = false;
		buttons.pause.disabled = false;
		buttons.play.disabled = true;
		progressLine.style.animationPlayState = "running";
		progressLine.style.animation = "progress";
	},
	false
);

// Handle Pause button
buttons.pause.addEventListener(
	"click",
	function () {
		Spectrum.pause();

		// Enable/Disable respectively buttons
		buttons.pause.disabled = true;
		buttons.play.disabled = false;
		progressLine.style.animationPlayState = "paused";
	},
	false
);

// Handle Stop button
buttons.stop.addEventListener(
	"click",
	function () {
		Spectrum.stop();

		// Enable/Disable respectively buttons
		buttons.pause.disabled = true;
		buttons.play.disabled = false;
		buttons.stop.disabled = true;
		progressLine.style.animation = "none";
		progressLine.offsetHeight; /* trigger reflow */
		progressLine.style.animation = null;
	},
	false
);

// Add a listener to enable the play button once it's ready
Spectrum.on("ready", function () {
	buttons.play.disabled = false;

	let duration = Spectrum.getDuration();
	console.log(duration);
	progressLine.style.animationDuration = `${duration}s`;

	let pin0In = 15;
	let pin0Out = 25;
	// console.log(Spectrum.getCurrentTime());

	let lineZero = document.querySelector("#line-zero");
	// console.log(lineZero.x2);
	lineZero.x1.baseVal.valueAsString = `${pin0In}%`;
	lineZero.x2.baseVal.valueAsString = `${pin0Out}%`;
	lineZero.style.left = `${pin0In}%`;

	function line0Timer(currentTime) {
		if (currentTime >= pin0In && currentTime <= pin0Out) {
			lineZero.style.stroke = "green";
			console.log("LED On");
		} else {
			lineZero.style.stroke = "rgba(0, 0, 255, 0.3)";
			console.log("LED Off");
		}
	}

	Spectrum.on("audioprocess", () => {
		let currentTime = Spectrum.getCurrentTime().toFixed(2);
		let duration = Spectrum.getDuration().toFixed(2);
		let remain = duration - currentTime;
		// if (Spectrum.isPlaying()) {
		// 	console.log("Remaining Time : " + remain.toFixed(1) + "");
		// }
		line0Timer(currentTime);
		line1Timer(currentTime);
	});
});

// pin D1
let pin1In = 30;
let pin1Out = 65;

let lineOne = document.querySelector("#line-one");
lineOne.x1.baseVal.valueAsString = `${pin1In}%`;
lineOne.x2.baseVal.valueAsString = `${pin1Out}%`;
lineOne.style.left = `${pin1In}%`;

function line1Timer(currentTime) {
	if (currentTime >= pin1In && currentTime <= pin1Out) {
		lineOne.style.stroke = "green";
	} else {
		lineOne.style.stroke = "rgba(0, 0, 255, 0.3)";
	}
}

// Load the audio file from your domain !
Spectrum.load(
	"https://assets.mixkit.co/music/preview/mixkit-find-me-outside-258.mp3"
);

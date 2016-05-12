function mainWebAudio() {

	let rf = new rfGame('canvas');
	let can = document.getElementById('canvas');
	let w = can.width;
	let h = can.width;
	let ctx = rf.setup2d();

	let wa = new rfWebAudio(1);

	let loader = new rfLoader();
	let drums = loader.loadAudioBuffer(wa, 'drums.ogg');

	function getCoord(x, y) {
		return [
			(w * 0.5) + x*60,
			(h * 0.5) + y*60,
		];
	};

	function drawCircle(ctx, x, y, radius, color) {
		[x, y] = getCoord(x, y);
		//x = (w * 0.5) + x*60;
		//y = (h * 0.5) + y*60;

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, 2*Math.PI);
		ctx.fill();
	};

	loader.download(function() {
		let listenX, listenY;
		listenX = 0.7;
		listenY = 0.4;
		listenDX = -1;
		listenDY = 0;
		wa.setListenPosition(
				listenX, listenY, 0,
				listenDX, listenDY, 0,
				0, 0, 1, true);
		wa.setChannel3d(0, drums, 1);
		let play = wa.play3d(0, 0, 0, 0, true);
		let time = 0.0;

		let soundX, soundY;

		rf.startLoop(function(ft) {
			time += ft;

			soundX = Math.cos(time);
			soundY = Math.sin(time);
			play.setLocalPosition(soundX, soundY, 0.5);

			return true;
		}, function() {
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, w, h);

			drawCircle(ctx, soundX, soundY, 6, "#a88");
			drawCircle(ctx, listenX, listenY, 8, "#55d");

			ctx.beginPath();
			ctx.strokeStyle = "#000";
			let x, y;
			[x, y] = getCoord(listenX, listenY);
			ctx.moveTo(x, y);
			[x, y] = getCoord(
					listenX+listenDX*0.2,
					listenY+listenDY*0.2);
			ctx.lineTo(x, y);
			ctx.stroke();
		});

		//wa.setChannel(0, drums, 1, true);

		//drums.play();
	});
};


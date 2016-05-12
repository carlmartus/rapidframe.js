function mainWebAudio() {
	let rf = new rfGame('canvas');

	let wa = new rfWebAudio(1);

	let loader = new rfLoader();
	let drums = loader.loadAudioBuffer(wa, 'drums.ogg');

	loader.download(function() {
		wa.setListenPosition(
				0, -1, 0,
				0, 1, 0,
				0, 0, 1, true);
		wa.setChannel3d(0, drums, 1);
		let play = wa.play3d(0, 0, 0, 0, true);
		let time = 0.0;

		rf.startLoop(function(ft) {
			time += ft;

			play.setLocalPosition(
					Math.cos(time),
					Math.sin(time),
					0.5);

			return true;
		});

		//wa.setChannel(0, drums, 1, true);

		//drums.play();
	});
};


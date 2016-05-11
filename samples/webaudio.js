function mainWebAudio() {
	var rf = new rfGame('canvas');

	var wa = new rfWebAudio(1);

	var loader = new rfLoader();
	var drums = loader.loadAudioBuffer(wa, 'drums.ogg');

	loader.download(function() {
		console.log('Download done', drums);
		wa.setChannelMono(0, drums, 1);
		wa.playMono(0, false);

		//wa.setChannel(0, drums, 1, true);

		//drums.play();
	});
};


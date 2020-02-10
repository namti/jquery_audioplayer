var int_currentTime;
var int_buffer;
var audio = new Audio();

$(function(){
	audio.src = "sample.mp3";
	audio.preload = "metadata";
	audio.load();

	// Monitor the buffer status
	int_buffer = setInterval(function(){
		if(audio.buffered.end(audio.buffered.length - 1) != audio.duration){
			$('.audio-progress-loaded').css("width", ((audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100) + "%");
		}else{
			// Once the data is totally buffered, stop monitoring
			clearInterval(int_buffer);
			$('.audio-progress-loaded').css("width", ((audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100) + "%");
		}
	}, 500);

	$('#btn_play').click(function(){
		if(audio.paused){
			play();
		}else{
			pause();
		}
	}
	);

	function play(){
		audio.play();
		$('#audio_album').addClass('audio_album_shadow');
		$('#btn_play').addClass('btn-pause').removeClass('btn-play');
		if(audio.duration.toString().toLowerCase() == "nan"){
			$('#time_total').text('00:00');
		}
		else{
			$('#time_total').text(convertToTime(audio.duration));
		}
		updatePlayStatus();
	}

	function pause(){
		audio.pause();
		$('#audio_album').removeClass('audio_album_shadow');
		$('#btn_play').removeClass('btn-pause').addClass('btn-play');
		clearInterval(int_currentTime);
	}

	audio.onplay = function (){
		play();
	}
	audio.onpause = function(){
		pause();
	}

	// Sync the current progress when drag the slider
	$("#audio_slider").on('input', syncProgress);
	function syncProgress(){
		$(".audio-progress-played").css("width", ($("#audio_slider").val() / 5000) * 100 + '%');
	}
	function updatePlayStatus(object){
		int_currentTime = setInterval(function(){
			if(!audio.paused){
				$('#time_played').text(convertToTime(audio.currentTime));
				$('#audio_slider').val((audio.currentTime / audio.duration)* 5000);
				$(".audio-progress-played").css("width", ($("#audio_slider").val() / 5000) * 100 + '%');
				// Stop playing if it reaches the end
				
			}
			if(audio.ended){
				pause();
			}
		}, 200);
	}

	$("#audio_slider").on('input', fastSeek);
	function fastSeek(){
		audio.currentTime = ($("#audio_slider").val() / 5000) * audio.duration;
	}

	// Convert milliseconds to regular time format
	function convertToTime(s){
		var time = "";
		var h = Math.floor(s / 60 / 60 );
		var m = Math.floor(s / 60);
		var s = Math.floor(s % 60);
		// hours
		if(h != 0)
		{
			if(h.toString().length < 2){
				time += ("0" + h + ":");
			}else{
				time += h + ":";
			}
		}
		// minutes
		if(m != 0 && m < 24){
			if(m.toString().length < 2){
				time += ("0" + m + ":");
			}else{
				time += m + ":";
			}
		}else{
			time += "00:";
		}
		// seconds
		if(s != 0){
			if(s.toString().length < 2){
				time += ("0" + s);
			}else{
				time += s;
			}
		}else{
			time += "00";
		}
		return time;
	}
});

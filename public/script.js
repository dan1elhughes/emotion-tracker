navigator.getUserMedia = (navigator.getUserMedia ||
	navigator.webkitGetUserMedia ||
	navigator.mozGetUserMedia ||
	navigator.msGetUserMedia);

var dataURL, context, canvas, video;

var debug = $('.debug');

if (navigator.getUserMedia) {
	navigator.getUserMedia({
			video: true
		},
		function (localMediaStream) {
			video = document.querySelector('video');
			video.src = window.URL.createObjectURL(localMediaStream);
			canvas = document.getElementById("canvas");
			context = canvas.getContext("2d");

			document.getElementById("capture-button").addEventListener("click", function () {
				context.clearRect(0, 0, canvas.width, canvas.height);
				context.drawImage(video, 20, 20, 600, 450, 0, 0, 400, 300);
				dataURL = canvas.toDataURL("image/png");
				debug.text('');
				$(canvas).css('opacity', 0.3);

				$.ajax({
					url: "/img",
					beforeSend: function (xhrObj) {
						xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
					},
					type: "POST",
					data: makeblob(dataURL),
					processData: false,
					success: function (data) {
						var result = JSON.parse(data);
						debug.text(data.replace(/\"/g, ""));
						$(canvas).css('opacity', 1);


						if (result.length) {
							var r = result[0].faceRectangle;
							context.beginPath();
							context.rect(r.left, r.top, r.width, r.height);
							context.lineWidth = "4";
							context.strokeStyle = "green";
							context.stroke();

							updateEmotions(result[0].scores);
						} else {
							updateEmotions();
						}

						//code to show result will be here
					}
				}).fail(function (data) {
					alert("Code: " + data.responseJSON.error.code + " Message:" + data.responseJSON.error.message);
				});


			});


			var makeblob = function (dataURL) {
				var BASE64_MARKER = ';base64,';
				var parts, contentType, raw;

				if (dataURL.indexOf(BASE64_MARKER) == -1) {
					parts = dataURL.split(',');
					contentType = parts[0].split(':')[1];
					raw = decodeURIComponent(parts[1]);
					return new Blob([raw], {
						type: contentType
					});
				}
				parts = dataURL.split(BASE64_MARKER);
				contentType = parts[0].split(':')[1];
				raw = window.atob(parts[1]);

				var rawLength = raw.length;

				var uInt8Array = new Uint8Array(rawLength);

				for (var i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i);
				}

				return new Blob([uInt8Array], {
					type: contentType
				});
			};

		},
		function (err) {
			console.log(err);
		}
	);
} else {
	alert('Sorry, your browser does not support getUserMedia');
}

function draw() {
	context.drawImage(video, 20, 20, 600, 450, 0, 0, 400, 300);
}

function updateEmotions(scores) {
	if (scores && Object.keys(scores).length) {
		for (var score in scores) {
			$('meter.' + score).attr('value', scores[score]);
		}
	} else {
		$('meter').attr('value', 0);
	}
}

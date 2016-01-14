<html>
<head>
    <meta charset="UTF-8"/>
    <script src="video_stat_gathering.js"></script>
</head>
<body>
<style>
.progress {
	border: 1px solid #666666;
}
</style>
<video id="v" width="320" height="240" controls>
    <source src="vid.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>
<canvas id="video_stat_progress" width="100" height="20" class="progress"><canvas>

<script>
var video = document.getElementById("v");

var func = function() {
	var progressBar = document.getElementById("video_stat_progress");
    var ctx = progressBar.getContext('2d');
    var stat = new VideoStatGatherer(video);
    //Making progressBar width equal to video duration in seconds
    progressBar.width = stat.duration;
    //Enlarging progressBar width
    progressBar.style.width = video.offsetWidth;
    progressBar.style.height = "20px";
    setInterval(function() {
        stat.gatherStatistic();
        var data = stat.getInner();
        //Drawing
        ctx.clearRect(0, 0, progressBar.width, progressBar.height);
        console.log( stat.duration );
        for (var i=0; i<stat.duration; i++) {
            if (data[i] !== undefined) {
//                var r_value = 10 * data[i];
//                var g_value = ((data[i]>10) ? 255 - (10*data[i]) : 255);
                var max = stat.getMax();
                var r_value = 255 - 255*( data[i] / max);
                r_value = Math.floor(r_value);
                var g_value = r_value;
                var b_value = r_value;
                ctx.fillStyle = "rgb(" + r_value + "," + g_value + "," + b_value + ")";
                ctx.fillRect(i, 0, 1, progressBar.height);
            }
        }
    }, 1000);
};
video.addEventListener('loadedmetadata', func);
</script>
</body>
</html>
<html>
<head>
    <meta charset="UTF-8"/>
    <script src="hsvtorgb.js"></script>
    <script src="video_stat_gathering.js"></script>
    <script src="colorTempToRGB.js"></script>
</head>
<body>
<style>
.progress-stat {
	border: 1px solid #666666;
    display: block;
}
.progress-bar {
    display: block;
    color: #0063a6;
    font-size: .6em;
    line-height: 1.5em;
    text-indent: .5em;
    width: 15em;
    height: 1.8em;
    border: 1px solid #0063a6;
    background: #fff;
}
</style>
<div class="video_block_wrapper">
    <video id="video_container" width="320" height="240">
    <source src="vid.mp4" type="video/mp4">
    Your browser does not support the video tag.
    </video>
    <progress id='video_progress_bar' max='100' value='0' class="progress-bar"><span>0</span>% played</progress>
    <canvas id="video_stat_progress" width="100" height="20" class="progress-stat"><canvas>
</div>

<script>
var video = document.getElementById("video_container");
video.onclick = function(){
    video.paused ? video.play() : video.pause();
};
var progressBar = document.getElementById('video_progress_bar');
progressBar.style.width = video.offsetWidth;
video.addEventListener('timeupdate', function() {
    var percent = Math.floor((100 / video.duration) * video.currentTime);
    progressBar.value = percent;
    progressBar.getElementsByTagName('span')[0].innerHTML = percent;
}, false);
progressBar.onclick = function(e) {
    var video = document.getElementById("video_container");
    var x = e.pageX - progressBar.offsetLeft;
    var clickedValue = x * progressBar.max / progressBar.offsetWidth;
    video.currentTime = video.duration*(clickedValue/100);
};
var func = function() {
    var statProgressBar = document.getElementById("video_stat_progress");
    var ctx = statProgressBar.getContext('2d');
    var stat = new VideoStatGatherer(video);
    //Making progressBar width equal to video duration in seconds
    statProgressBar.width = stat.duration;
    //Enlarging progressBar width
    statProgressBar.style.width = video.offsetWidth;
    statProgressBar.style.height = "10px";
    amplitude = 20000;
    setInterval(function() {
        stat.gatherStatistic();
        var data = stat.getInner();
        //Drawing
        ctx.clearRect(0, 0, statProgressBar.width, statProgressBar.height);
        for (var i=0; i<stat.duration; i++) {
            if (data[i] !== undefined) {
                var max = stat.getMax();
                var ratio = data[i] / max;
                //var rgb = colorTemperatureToRGB( amplitude * (1 - ratio) );
                var rgb = HSVtoRGB((0.333*(1-ratio)), 1, 1);
                var r_value = rgb.r;
                var g_value = rgb.g;
                var b_value = rgb.b;
                ctx.fillStyle = "rgb(" + r_value + "," + g_value + "," + b_value + ")";
                ctx.fillRect(i, 0, 1, statProgressBar.height);
            }
        }
    }, 1000);
};
video.addEventListener('loadedmetadata', func);
</script>
</body>
</html>
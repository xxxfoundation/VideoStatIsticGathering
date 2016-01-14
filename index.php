<html>
<head>
    <meta charset="UTF-8"/>
    <script src="video_stat_gathering.js"></script>
</head>
<body>

<video id="v" width="320" height="240" controls>
    <source src="vid.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

<script>
    var video = document.getElementById("v");
    var stat = new VideoStatGatherer(video);

    setInterval(function() {
        stat.gatherStatistic();
        console.log( stat.getInner() );
    }, 1000);


</script>
</body>
</html>
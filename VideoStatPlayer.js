function VideoStatPlayer(target, w, h) {
    this.construct(target, w, h);
}

VideoStatPlayer.prototype = {
    construct : function(target, w, h) {
        this.block =
            '<video id="video_container" width="'+w+'" height="'+h+'"><source src="vid.mp4" type="video/mp4"></video>\
            <progress id="video_progress_bar" max="100" value="0" class="progress-bar"><span>0</span>% played</progress>\
            <canvas id="video_stat_progress" width="100" height="8" class="progress-stat"><canvas>';
        //Creating elements
        var div = document.createElement('div');
        div.innerHTML = this.block;
        while (div.children.length > 0) {
            target.appendChild(div.children[0]);
        }
        //Saving links to created elements
        this.video = document.getElementById("video_container");
        this.progress = document.getElementById("video_progress_bar");
        this.canvas = document.getElementById("video_stat_progress");
        this.context = this.canvas.getContext('2d');
        //Creating statistics gatherer
        this.inner = {};
        this.max = 0;
        //Styling
        this.progress.style.width = this.video.offsetWidth;
        this.canvas.style.width = this.video.offsetWidth;
        //Event binding
        this.videoClickEvent = this.videoClick.bind(this);
        this.videoUpdateEvent = this.videoUpdate.bind(this);
        this.progressClickEvent = this.progressClick.bind(this);
        this.metadataLoadedEvent = this.metadataLoaded.bind(this);
        this.video.addEventListener("click", this.videoClickEvent, false);
        this.video.addEventListener("timeupdate", this.videoUpdateEvent, false);
        this.progress.addEventListener("click", this.progressClickEvent, false);
        this.video.addEventListener('loadedmetadata', this.metadataLoadedEvent, false);
    },
    videoClick : function() {
        this.video.paused ? this.video.play() : this.video.pause();
    },
    videoUpdate : function() {
        var percent = Math.floor((100 / this.video.duration) * this.video.currentTime);
        this.progress.value = percent;
        this.progress.getElementsByTagName('span')[0].innerHTML = percent;
    },
    progressClick : function(e) {
        var x = e.pageX - this.progress.offsetLeft;
        var clickedValue = x * this.progress.max / this.progress.offsetWidth;
        this.video.currentTime = this.video.duration*(clickedValue/100);
    },
    metadataLoaded : function() {
        this.duration = Math.round(this.video.duration);
        this.canvas.width = this.duration;
        var that = this;
        setInterval(function() {
            that.gatherStatistic();
            var data = that.getInner();
            //Drawing
            that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
            for (var i=0; i<that.duration; i++) {
                if (data[i] !== undefined) {
                    var max = that.getMax();
                    var ratio = data[i] / max;
                    var rgb = that.HSVtoRGB((0.333*(1-ratio)), 1, 1);
                    var r_value = rgb.r;
                    var g_value = rgb.g;
                    var b_value = rgb.b;
                    that.context.fillStyle = "rgb(" + r_value + "," + g_value + "," + b_value + ")";
                    that.context.fillRect(i, 0, 1, that.canvas.height);
                }
            }
        }, 1000);
    },
    increaseInner : function(second) {
        if(this.inner[second] == undefined) {
            this.inner[second] = 0;
        }
        this.inner[second]++;
        this.setMaxIfMax(this.inner[second]);
    },
    setMaxIfMax : function(value) {
        if( this.getMax() < value ) {
            this.max = value;
        }
    },
    getInner : function() {
        return this.inner;
    },
    gatherStatistic : function(video) {
        if( this.video.paused ) {return;}
        var time = this.video.currentTime;
        time = Math.floor(time);
        this.increaseInner(time);
    },
    getMax : function(video) {
        return this.max;
    },
    HSVtoRGB : function(h, s, v) {
        /* accepts parameters
         * h  Object = {h:x, s:y, v:z}
         * OR
         * h, s, v
         * http://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
         * by http://stackoverflow.com/users/1615483/paul-s
         */
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s, v = h.v, h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v, g = t, b = p; break;
            case 1: r = q, g = v, b = p; break;
            case 2: r = p, g = v, b = t; break;
            case 3: r = p, g = q, b = v; break;
            case 4: r = t, g = p, b = v; break;
            case 5: r = v, g = p, b = q; break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
};

document.addEventListener('DOMContentLoaded', function() {
    videoStatPlayer = new VideoStatPlayer(document.getElementById("video_stat_player"), 320, 240);
}, false);


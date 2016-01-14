var VideoStatGatherer = function(video) {
    this.inner = {};
    this.video = video;
    this.duration = Math.round(video.duration);
    this.max = 0;
};
VideoStatGatherer.prototype.increaseInner = function(second) {
    if(this.inner[second] == undefined) {
        this.inner[second] = 0;
    }
    this.inner[second]++;
    this.setMaxIfMax(this.inner[second]);
};
VideoStatGatherer.prototype.setMaxIfMax = function(value) {
    if( this.getMax() < value ) {
        this.max = value;
    }
};
VideoStatGatherer.prototype.getInner = function() {
    return this.inner;
};
VideoStatGatherer.prototype.gatherStatistic = function(video) {
    if( this.video.paused ) {return;}
    var time = this.video.currentTime;
    time = Math.floor(time);
    this.increaseInner(time);
};
VideoStatGatherer.prototype.getMax = function(video) {
    return this.max;
};
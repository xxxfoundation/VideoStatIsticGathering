var VideoStatGatherer = function(video) {
    this.inner = {};
    this.video = video;
};
VideoStatGatherer.prototype.increaseInner = function(second) {
    if(this.inner[second] == undefined) {
        this.inner[second] = 0;
    }
    this.inner[second]++;
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

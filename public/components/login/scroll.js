/**
    Smoothly scroll element to the given target (element.scrollTop)

    Returns a promise that's fulfilled when done, or rejected if
    interrupted
 */
var smooth_scroll_to = function(dir) {
    if (dir == 1) {
        // Set it to scroll down
        target = document.body.scrollTop + window.innerHeight;
    } else {
        // Set it to scroll up
        target = document.body.scrollTop - window.innerHeight;
    }

    // Set animation duration to be 1 second
    var DURATION = 1000;

    // Start time for animation
    var start_time = Date.now();
    // End time for animation
    var end_time = start_time + DURATION;

    // Gets the current vertical position of the body's scroll bar
    var start_top = document.body.scrollTop;
    // Set how far it scrolls
    var distance = target - start_top;

    // Function for smooth scrolling
    var smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        var x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }

    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        var previous_top = document.body.scrollTop;

        // This is like a think function from a game loop
        var scroll_frame = function() {
            if(document.body.scrollTop != previous_top) {
                reject("interrupted");
                return;
            }

            // set the scrollTop for this frame
            var now = Date.now();
            var point = smooth_step(start_time, end_time, now);
            var frameTop = Math.round(start_top + (distance * point));
            document.body.scrollTop = frameTop;

            // check if we're done!
            if(now >= end_time) {
                resolve();
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if(document.body.scrollTop === previous_top
                && document.body.scrollTop !== frameTop) {
                resolve();
                return;
            }
            previous_top = document.body.scrollTop;

            // schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
}
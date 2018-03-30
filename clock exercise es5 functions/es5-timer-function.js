(function () {
    "use strict";

    var times, stop_clocks, start_clocks, reset_clocks;
    var timers = {},
        defaultValues = {
            hours: '20',
            minutes: '00',
            seconds: '00'
        };

    function getDomElements() {
        times = document.querySelectorAll('.time');
        stop_clocks = document.querySelectorAll('.stop_clock');
        start_clocks = document.querySelectorAll('.start_clock');
        reset_clocks = document.querySelectorAll('.reset_clock');
    }

    function setTime(time, currentClock) {
        var timeData = time && (time.hours + ':' + time.minutes + ':' + time.seconds) || '00:00:00';
        if (currentClock) {
            currentClock.childNodes.forEach(function (item) {
                (item.nodeType == 1 && item.className == 'time') ? item.innerText = timeData : '';
            })
        } else {
            times.forEach(function (item) { item.innerText = timeData });
        }
    }

    function getTime(id) {
        var interval = timers[id] && timers[id]['interval'],
            timer = timers[id] && timers[id]['timer'],
            defaultValuesCopy = Object.create(defaultValues);

        if (timer) {
            if (timer.hours == 0 && timer.minutes == 0 && timer.seconds == 0) return clearInterval(interval);
            if (parseInt(defaultValuesCopy.minutes) == 0) defaultValuesCopy.minutes = 60;
            if (parseInt(defaultValues.seconds) == 0) defaultValuesCopy.seconds = 59;

            if (timer.minutes == 0 && timer.seconds == 0) {
                timer.hours > 0 ? --timer.hours : timer.hours = 0;
                timer.hours >= 0 ? timer.minutes = defaultValuesCopy.minutes : timer.minutes = 0;
            }
            if (timer.hours !== 0 && timer.seconds == 0) {
                --timer.minutes;
                timer.seconds = defaultValuesCopy.seconds;
            } else if (timer.seconds > 0) {
                --timer.seconds;
            }
            (parseInt(timer.hours) < 10 && timer.hours.toString().length == 1) ? timer.hours = '0' + timer.hours : timer.hours;
            (parseInt(timer.minutes) < 10 && timer.minutes.toString().length == 1) ? timer.minutes = '0' + timer.minutes : timer.minutes;
            (parseInt(timer.seconds) < 10 && timer.seconds.toString().length == 1) ? timer.seconds = '0' + timer.seconds : timer.seconds;

            return {
                hours: timer.hours,
                minutes: timer.minutes,
                seconds: timer.seconds
            }
        } else {
            return defaultValues;
        }
    }

    function timerData(value) {
        return {
            hours: value.hours,
            minutes: value.minutes,
            seconds: value.seconds,
        }
    }

    function intervalHandler(id, parent) {
        var value = getTime(id);
        setTime(value, parent);
        if (!timers[id]['timer']) timers[id]['timer'] = timerData(value);
    }

    function resetHandler(id, currentClock) {
        setTime(defaultValues, currentClock);
        if (timers[id]) {
            clearInterval(timers[id].interval);
            timers[id]['timer'] = Object.assign({}, defaultValues);
            timers[id]['starting'] = false;
        }
    }

    function start() {
        var parent = this.parentNode,
            id = parent.id;

        if (!timers[id]) {
            timers[id] = {
                interval: setInterval(intervalHandler.bind(null, id, parent), 1000),
                starting: true
            };
        } else {
            if (timers[id] && !timers[id]['starting']) {
                timers[id]['interval'] = setInterval(intervalHandler.bind(null, id, parent), 1000);
                timers[id]['starting'] = true;
            }
        }
    }

    function stop() {
        var id = this.parentNode.id;
        if (timers[id]) {
            clearInterval(timers[id].interval);
            timers[id]['starting'] = false;
        }
    }

    function reset() {
        resetHandler(this.parentNode.id, this.parentNode);
    }

    window.onload = function () {
        getDomElements();
        setTime(defaultValues);
        start_clocks && start_clocks.forEach(function (start_clock) { start_clock.addEventListener('click', start) });
        stop_clocks && stop_clocks.forEach(function (stop_clock) { stop_clock.addEventListener('click', stop); })
        reset_clocks && reset_clocks.forEach(function (reset_clock) { reset_clock.addEventListener('click', reset) });
    };
})();
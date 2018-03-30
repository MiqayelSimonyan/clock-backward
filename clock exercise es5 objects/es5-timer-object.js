(function () {
    "use strict";

    function Timer() {
        this.times = document.querySelectorAll('.time');
        this.stop_clocks = document.querySelectorAll('.stop_clock');
        this.start_clocks = document.querySelectorAll('.start_clock');
        this.reset_clocks = document.querySelectorAll('.reset_clock');
        this.timers = {};
        this.defaultValues = {
            hours: '20',
            minutes: '00',
            seconds: '00'
        }
    }

    Timer.prototype.setTime = function (time, currentClock) {
        var timeData = time && (time.hours + ':' + time.minutes + ':' + time.seconds) || '00:00:00';
        if (currentClock) {
            currentClock.childNodes.forEach(function (item) {
                (item.nodeType == 1 && item.className == 'time') ? item.innerText = timeData : '';
            })
        } else {
            this.times.forEach(function (item) { item.innerText = timeData });
        }
    }

    Timer.prototype.getTime = function (id) {
        var interval = this.timers[id] && this.timers[id]['interval'],
            timer = this.timers[id] && this.timers[id]['timer'],
            defaultValuesCopy = Object.create(this.defaultValues);

        if (timer) {
            if (timer.hours == 0 && timer.minutes == 0 && timer.seconds == 0) return clearInterval(interval);
            if (parseInt(defaultValuesCopy.minutes) == 0) defaultValuesCopy.minutes = 60;
            if (parseInt(defaultValuesCopy.seconds) == 0) defaultValuesCopy.seconds = 59;

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
            return this.defaultValues;
        }
    }

    Timer.prototype.timerData = function (value) {
        return {
            hours: value.hours,
            minutes: value.minutes,
            seconds: value.seconds,
        }
    }

    Timer.prototype.intervalHandler = function (id, parent) {
        var value = this.getTime(id);
        this.setTime(value, parent);
        if (!this.timers[id]['timer']) this.timers[id]['timer'] = this.timerData(value);
    }

    Timer.prototype.resetHandler = function (id, currentClock) {
        this.setTime(this.defaultValues, currentClock);
        if (this.timers[id]) {
            clearInterval(this.timers[id].interval);
            this.timers[id]['timer'] = Object.assign({}, this.defaultValues);
            this.timers[id]['starting'] = false;
        }
    }

    Timer.prototype.start = function (start_clock) {
        var parent = start_clock.parentNode,
            id = parent.id;

        if (!this.timers[id]) {
            this.timers[id] = {
                interval: setInterval(this.intervalHandler.bind(this, id, parent), 1000),
                starting: true
            };
        } else {
            if (this.timers[id] && !this.timers[id]['starting']) {
                this.timers[id]['interval'] = setInterval(this.intervalHandler.bind(this, id, parent), 1000)
                this.timers[id]['starting'] = true;
            }
        }
    }

    Timer.prototype.stop = function (stop_clock) {
        var id = stop_clock.parentNode.id;
        if (this.timers[id]) {
            clearInterval(this.timers[id].interval);
            this.timers[id]['starting'] = false;
        }
    }

    Timer.prototype.reset = function (reset_clock) {
        this.resetHandler(reset_clock.parentNode.id, reset_clock.parentNode);
    }

    window.onload = function () {
        var timer = new Timer();
        timer.setTime(timer.defaultValues);
        timer.start_clocks && timer.start_clocks.forEach(function (start_clock) { start_clock.addEventListener('click', timer.start.bind(timer, start_clock)) });
        timer.stop_clocks && timer.stop_clocks.forEach(function (stop_clock) { stop_clock.addEventListener('click', timer.stop.bind(timer, stop_clock)) })
        timer.reset_clocks && timer.reset_clocks.forEach(function (reset_clock) { reset_clock.addEventListener('click', timer.reset.bind(timer, reset_clock)) });
    };
})();
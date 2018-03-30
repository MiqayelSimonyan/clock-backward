class Timer {
    constructor(props) {
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

    setTime(time = {}, currentClock) {
        const { hours, minutes, seconds } = time;
        const timeData = time && Object.keys(time).length && `${hours}:${minutes}:${seconds}` || '00:00:00';
        currentClock ?
            currentClock.childNodes.forEach(item => (item.nodeType == 1 && item.className == 'time') ? item.innerText = timeData : '')
            :
            this.times.forEach(item => item.innerText = timeData)
    }

    getTime(id) {
        const { interval, timer } = this.timers[id];
        const defaultValuesCopy = Object.assign({}, this.defaultValues);
        if (timer) {
            let { hours, minutes, seconds, min, sec } = timer;

            if (hours == 0 && minutes == 0 && seconds == 0) return clearInterval(interval);
            if (parseInt(defaultValuesCopy.minutes) == 0) defaultValuesCopy.minutes = 60;
            if (parseInt(defaultValuesCopy.seconds) == 0) defaultValuesCopy.seconds = 59;

            if (minutes == 0 && seconds == 0) {
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
            return { hours, minutes, seconds, min, sec }
        } else {
            return this.defaultValues;
        }
    }

    timerData(value) {
        return {
            hours: value.hours,
            minutes: value.minutes,
            seconds: value.seconds,
        }
    }

    intervalHandler(id, parent) {
        var value = this.getTime(id);
        this.setTime(value, parent);
        if (!this.timers[id]['timer']) this.timers[id]['timer'] = this.timerData(value);
    }

    resetHandler(id, currentClock) {
        const { starHours, startMinutes, startSeconds, setTime, timers, defaultValues } = this;

        this.setTime(this.defaultValues, currentClock);
        if (timers[id]) {
            clearInterval(timers[id].interval);
            timers[id]['timer'] = Object.assign({}, this.defaultValues);
            timers[id]['starting'] = false;
        }
    }

    start(start_clock) {
        const parent = start_clock.parentNode;
        const { id } = parent;

        if (!this.timers[id]) {
            this.timers[id] = {
                interval: setInterval(this.intervalHandler.bind(this, id, parent), 1000),
                starting: true
            };
        } else {
            if (this.timers[id] && !this.timers[id]['starting']) {
                this.timers[id]['interval'] = setInterval(this.intervalHandler.bind(this, id, parent), 1000);
                this.timers[id]['starting'] = true;
            }
        }
    }

    stop(stop_clock) {
        const { id } = stop_clock.parentNode;
        if (this.timers[id]) {
            clearInterval(this.timers[id].interval);
            this.timers[id]['starting'] = false;
        }
    }

    reset(reset_clock) {
        this.resetHandler(reset_clock.parentNode.id, reset_clock.parentNode);
    }
}

window.onload = () => {
    const timer = new Timer();
    timer.setTime(timer.defaultValues);
    timer.start_clocks && timer.start_clocks.forEach((start_clock) => { start_clock.addEventListener('click', timer.start.bind(timer, start_clock)) });
    timer.stop_clocks && timer.stop_clocks.forEach((stop_clock) => { stop_clock.addEventListener('click', timer.stop.bind(timer, stop_clock)) })
    timer.reset_clocks && timer.reset_clocks.forEach((reset_clock) => { reset_clock.addEventListener('click', timer.reset.bind(timer, reset_clock)) });
};
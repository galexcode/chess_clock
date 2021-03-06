define(['backbone', 'jquery', 'underscore'],
    function (Backbone, $, _) {

        var Clock_Model = Backbone.Model.extend({

            defaults: {
                'startMSecs': 1200000,
                'remainingMSecs': 1200000,
                'startTime': '00:20:00',
                'remainingTime': '00:20:00',
                'additionalTime': 5000,
                'turnTime': null,
                'timeIsUp': false
            },

            initialize: function () {
                _.bindAll(this, 'startClock', 'pauseClock', 'resumeClock', 'stopClock', 'isTimeUp','displayMessages','mSecsToHMS', 'addLeadingZero');

                this.mSecsRemaining = this.get('remainingMSecs');
                this.clockTick = [];
                this.elapsedTime = 0;

                this.on('change:remainingMSecs',function(event){
                    var hms = this.mSecsToHMS(event.attributes.remainingMSecs);
                    this.set('remainingTime', hms);
                });


            },

            startClock: function () {
                console.log('start clock called');

                var startTime, currentTime, newTime, self = this;

                startTime = new Date().getTime();
                //reset the value of elapsedTime
                this.elapsedTime = 0;

                this.clockTick = window.setInterval(function () {
                    //start by loading in the milliseconds remaining in the model
                    self.mSecsRemaining = self.get('remainingMSecs');
                    //get the current time for comparison
                    currentTime = new Date().getTime();
                    //update the current millisecond count in the model by subtracting startTime from currentTime
                    self.mSecsRemaining -= (currentTime - startTime);
                    //get the new time in HHMMSS by converting the mSecsRemaining
                    newTime = self.mSecsToHMS(self.mSecsRemaining);
                    //update the model with the new HHMMSS time, triggering an update to the view
                    self.set('remainingTime', newTime);
                    self.isTimeUp(self.mSecsRemaining);
                }, 100);
            },

            pauseClock: function() {
                console.log('pause clock called');

                window.clearInterval(this.clockTick);
                //store elapsedTime so it can be accumulated properly
                this.elapsedTime += this.get('remainingMSecs') - this.mSecsRemaining;
                this.set('remainingMSecs', this.mSecsRemaining);
            },

            resumeClock: function() {
                console.log('resume clock called');

                var startTime, currentTime, newTime, self = this;

                startTime = new Date().getTime();

                this.clockTick = window.setInterval(function () {
                    self.mSecsRemaining = self.get('remainingMSecs');
                    currentTime = new Date().getTime();
                    self.mSecsRemaining -= (currentTime - startTime);
                    newTime = self.mSecsToHMS(self.mSecsRemaining);
                    self.set('remainingTime', newTime);
                }, 100);
            },

            stopClock: function () {
                console.log('stop clock called');

                window.clearInterval(this.clockTick);
                this.set('remainingMSecs', this.mSecsRemaining);
            },

            isTimeUp: function(mSecs) {
                if(mSecs <= 100) {
                    this.stopClock();
                    this.set('remainingMSecs', 0);
                    this.set('timeIsUp',true);
                }
            },

            displayMessages: function(mSecs) {
                console.log(mSecs);
            },


            mSecsToHMS: function (mSecs) {
                var secs = Math.floor(mSecs / 1000);
                var hoursDisplay = this.addLeadingZero(Math.floor(secs / (60 * 60)));

                var divisor_for_minutes = secs % (60 * 60);
                var minutesDisplay = this.addLeadingZero(Math.floor(divisor_for_minutes / 60));

                var divisor_for_seconds = divisor_for_minutes % 60;
                var secondsDisplay = this.addLeadingZero(Math.ceil(divisor_for_seconds));

                var timeString = hoursDisplay.concat(":", minutesDisplay, ":", secondsDisplay);

                return timeString;
            },

            addLeadingZero: function (unit) {
                var leadingZero = "0";
                var displayUnit = (unit.toString().length < 2) ? leadingZero.concat(unit.toString()) : unit.toString();

                return displayUnit;
            }
        });

        return Clock_Model;
    });

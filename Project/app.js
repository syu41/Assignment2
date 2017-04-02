// create a new board 
var five = require("johnny-five");
five.Board().on("ready", function() {
    // create a new 'LED' instance
    var led = new five.Led(13);
    // create a new `motion` hardware instance
    var motion = new five.Motion(7);


    // setup firebase
    var firebase = require("firebase");
    firebase.initializeApp ({
        databaseURL: "https://project1-41068.firebaseio.com"
    });
    var db = firebase.database();

    // set up command channel for client to communicate with server
    var commandRef = db.ref("/Commands");
    /*
    commandRef.set({
        LED: "off",
        MotionSensor: "off",
        Reset: "false"
    });
    */

    // set up motion channel to record motion data
    var motionsRef = db.ref("/Motions");
    /*
    motionsRef.set({
        LongMotionCount: 0,
        ShortMotionCount: 0,
        IntruderCount: 0,
        SequenceArray: ""
    });
    */

    // listen to command channel from database
    commandRef.on("value", function(snapshot) {
        var commands = snapshot.val();
        if (commands['LED'] == "on") {
            led.on();
            console.log('led on');
        } else {
            led.off();
            console.log('led off');
        };

        
        if (commands['MotionSensor'] == "on") {
            console.log('motion sensor on');
            //create variable to determine motion duration
            var stime,
            etime,
            duration

            // "calibrated" occurs once, at the beginning of a session
            motion.on("calibrated", function() {
                console.log("calibrated");
            });
                
            motion.on('motionstart', function() {
                // record time of motion detected
                console.log('motion detected')
                stime = Date.now();
            });

            motion.on('motionend', function() {
                // calculate motion duration
                console.log('motion ended')
                etime = Date.now();
                duration = etime - stime;
                // send message to client based on duration of motion detected
                if (duration >= 6000) {
                    console.log('long motion detected');
                    
                    motionsRef.once("value", function(snapshot) {
                        var motions = snapshot.val();
                        motionsRef.update({
                            '/LongMotionCount': motions['LongMotionCount'] + 1
                        });
                        sequenceArray = motions['SequenceArray'];
                        if (sequenceArray.length < 4) {
                            sequenceArray += "l";
                            if (sequenceArray == "lsll") {
                                motionsRef.update({
                                    '/IntruderCount': motions['IntruderCount'] + 1,
                                });
                            };
                        } else {
                            sequenceArray = sequenceArray.substring(1);
                            sequenceArray += "l";
                            if (sequenceArray == "lsll") {
                                motionsRef.update({
                                    '/IntruderCount': motions['IntruderCount'] + 1,
                                });
                            };
                        };
                        motionsRef.update({
                            '/SequenceArray': sequenceArray
                        });
                    });
                } else {
                    console.log('short motion detected');
                    motionsRef.once("value", function(snapshot) {
                        var motions = snapshot.val();
                        motionsRef.update({
                            '/ShortMotionCount': motions['ShortMotionCount'] + 1
                        });
                        sequenceArray = motions['SequenceArray'];
                        if (sequenceArray.length < 4) {
                            sequenceArray += "s";
                        } else {
                            sequenceArray = sequenceArray.substring(1);
                            sequenceArray += "s";
                        };
                        motionsRef.update({
                            '/SequenceArray': sequenceArray
                        });
                    });
                };
            });
        };
        if (commands['MotionSensor'] == "off") {
            console.log('motion sensor off');
        };

        if (commands['Reset'] == "true") {
            // reset all motion counts
            var clearMotions = db.ref("/Motions");
            clearMotions.set({
                LongMotionCount: 0,
                ShortMotionCount: 0,
                IntruderCount: 0,
                SequenceArray: ""
            });
            // set reset back to false
            commandRef.update({
                '/Reset': "false"
            });
            console.log('reseted');
            };
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code)
    });
});

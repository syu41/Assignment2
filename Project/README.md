# assignment-2-team41
function: 
         the function of the program intent to using a HTML web page to control a Arduion Board with a led light and a motion sensor and reset the firebase database to clean all pervious data. the client using the Iot Control Panel runing on HTML to control the LED light, motion sensor, and database by press the button on right side of the controler, the controler also has a display function to display the number of motion, short motion, long motion and intruder that sensor detected, the long motion is defines a s a motion more than 5000ms, a short motion is defines as a motion less than 5000ms, and a intruder is define as a series of motion in a 4 motions pattern which is "long short long long".

structure: 
          this application has following structure, the client(HTML Page) is communicate with Server(app.js that control the Arduion board) via firebase database, in the firebase database there are two channels that store different data, on channel call "Commands" which stored all information that client need send to server such as LED status, motion status, whether to reset the server. another channel call "Motion", which stored all data, the server need to send to client, include the intruder count, the long motion count, the short motion count, and the sequence array. 

project layer:  
                    1. user layer:HTML Page.
                    2. database layer:Firebase data base.
                    3. server layer:a node.js server that run app.js and firebase server that host HTML file.
                    4. headware layer: Arduion board.

How to use:
            1. user need to running a command "npm install" to get all necessary modules.
            2. in the terminal input command "node app.js" to start running the server.
            3. open another terminal input command "firebase serve" to start host the HTML page.
            4. than open browser go to localhost:5000 to start using it.
            
used packages: 
              1. node.js
              2. johnny-five
              3. firebase
              
How to connect: 1. The LED light connect to pin 13.
                2. The motion sensor connect to the pin 7, get power from Pin 5v.

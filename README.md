Concuss.js
=======

##Steps
* Create a suite of Javascript tests
* Test the suite on a group of non-concussed subjects and on a group of post concussed subjects
* Note the differences in the test results and develop a classification algorithm
* Whilst accomplishing the other steps, create the UI. Try using React (Facebook Javascript API)
* Create the base iOS, Android, and Blackberry apps 
* Try implementing eye-tracking type game if possible
* Send raw data and result to the server for visualization (non - critical)

##Agile Todo
* Finish creating the Canvas utilities: *done*
* Bootstrap it up
* Create game that tells the user to keep two balls in two circles
	* Generate random paths by having an increasing probability of changing direction as time since last change increases
	* Use setInterval
* Create image moving from circle to circle game (Keep this for later)
	* Creates map for this game
		* Create a picture of a maze using paint or something
* Get sensor data on the same screen as the circle game
	* Use sensor data to move a ball around a screen
* For the dynamic game, ending the touch should pause all movement

##Global TODO
* Research commonly used tests for:
	* Cognition
		* Stroop color word test
		* Move two images through a dynamic configuration space
	* Reflex
		* Tap on a prescribed shape with certain color as fast as possible
		* Left-right test
		* Keep two balls between two different circles
	* Balance 
		* Roll ball from one hole into another (on one foot)
		* Try to get sound to a certain pitch by adjusting the accelerometer readings


import eyetracker
import cv2
import numpy as np

class EyeCalibration:

	def __init__(self):
		self.camera = cv2.VideoCapture(0)
		self.tracker = eyetracker.EyeTracker()

	def run(self):
		while True:
		    _, frame = self.camera.read()
		    self.tracker.setImage(frame)
		    results = self.tracker.track()
		    cv2.imshow('e2', results.getTrackingImage())
		    """
		    try:
		    	print "Id:", results[0].getId()
		    except IndexError:
		    	pass
		    """
		    if cv2.waitKey(1) == 27:
		        break
		cv2.destroyAllWindows()


if __name__ == "__main__":
	eyeCalibration = EyeCalibration()
	eyeCalibration.run()

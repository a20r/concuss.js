
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
		    #print map(lambda r: r.getId(), results)
		    cv2.imshow('e2', results.getCentroidImage())
		    if cv2.waitKey(1) == 27:
		        break
		cv2.destroyAllWindows()


if __name__ == "__main__":
	eyeCalibration = EyeCalibration()
	eyeCalibration.run()

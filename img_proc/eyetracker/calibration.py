
import eyetracker
import cv2
import numpy as np
from movingaverage import MovingAveragePoints

class EyeCalibration:

	def __init__(self):
		self.camera = cv2.VideoCapture(0)
		self.tracker = eyetracker.EyeTracker()
		self.movAvgDict = dict()
		self.movAvgLength = 13

	def drawCanvas(self):
		canvas = np.zeros((480, 640))
		for key in self.movAvgDict:
			try:
				"""
				cv2.circle(
					canvas,
					(
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().x,
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().y
					),
					5, 255, 5
				)
				"""
				"""
				cv2.line(
					canvas,
					(
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().x,
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().y
					), 
					(
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().x + 
						self.movAvgDict[key]["rVector"].getLastCompoundedResult().x,
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().y + 
						self.movAvgDict[key]["rVector"].getLastCompoundedResult().y
					),
					255, 5
				)
				"""
				cv2.circle(
					canvas,
					(
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().x + 
						self.movAvgDict[key]["rVector"].getLastCompoundedResult().x,
						self.movAvgDict[key]["centroid"].getLastCompoundedResult().y + 
						self.movAvgDict[key]["rVector"].getLastCompoundedResult().y
					),
					5, 255, 5
				)
			except AttributeError:
				pass

		return canvas

	def updateMovAvgDict(self, results):
		newDict = dict()
		for r in results:
			try:
				self.movAvgDict[r.getId()]["centroid"].compound(r.getPupil().getCentroid())
				self.movAvgDict[r.getId()]["rVector"].compound(r.getResultantVector(
					self.tracker.getXScale(), self.tracker.getYScale()))
			except KeyError:
				self.movAvgDict[r.getId()] = {"centroid": MovingAveragePoints(
					r.getPupil().getCentroid(), self.movAvgLength), 
					"rVector": MovingAveragePoints(r.getResultantVector(
						self.tracker.getXScale(), self.tracker.getYScale()), 
					self.movAvgLength)}
			newDict[r.getId()] = self.movAvgDict[r.getId()]
		self.movAvgDict = newDict

	def run(self):
		while True:
		    _, frame = self.camera.read()
		    self.tracker.setImage(frame)

		    results = self.tracker.track()
		    #print results.idMap
		    self.updateMovAvgDict(results)

		    cv2.imshow('Canvas', self.drawCanvas())
		    cv2.imshow('e2', results.getTrackingImage())
		    if cv2.waitKey(1) == 27:
		        break
		cv2.destroyAllWindows()


if __name__ == "__main__":
	eyeCalibration = EyeCalibration()
	eyeCalibration.run()


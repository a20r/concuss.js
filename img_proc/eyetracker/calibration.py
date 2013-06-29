
import eyetracker
import cv2
import numpy as np
from movingaverage import MovingAveragePoints
from collections import namedtuple

class EyeCalibration:

	def __init__(self):
		self.Point = namedtuple("Point", "x y")
		self.camera = cv2.VideoCapture(0)
		self.tracker = eyetracker.EyeTracker()
		self.movAvgDict = dict()
		self.lookingPointMovAvg = MovingAveragePoints(
			self.Point(
				self.tracker.xScale / 2,
				self.tracker.yScale / 2
			),
			4
		)
		self.subDict = dict()
		self.movAvgLength = 4

	def drawCanvas(self, img):
		canvas = np.ones_like(img)

		avgX = 0
		avgY = 0
		sLen = len(self.subDict.keys())
		for key in self.subDict.keys():
			avgX += self.subDict[key]["rVector"].getLastCompoundedResult().x / sLen
			avgY += self.subDict[key]["rVector"].getLastCompoundedResult().y / sLen

		#print avgX, avgY
		avgLookingPoint = self.Point(
			self.tracker.xScale / 2 - avgX,
			self.tracker.yScale / 2 + avgY
		)

		currentPoint = self.lookingPointMovAvg.compound(avgLookingPoint)

		cv2.circle(canvas, currentPoint, 5, (255, 100, 100), 5)

		return canvas

	def updateExistingValue(self, r):
		self.movAvgDict[r.getId()]["centroid"].compound(
			r.getPupil().getCentroid()
		)
		self.movAvgDict[r.getId()]["rVector"].compound(
			r.getResultantVector(
				self.tracker.getXScale(), 
				self.tracker.getYScale()
			)
		)

	def updateMovAvgDict(self, results):
		newDict = dict()
		for r in results:
			try:
				self.updateExistingValue(r)
			except KeyError:
				self.movAvgDict[r.getId()] = {
					"centroid": 
						MovingAveragePoints(
							r.getPupil().getCentroid(), 
							self.movAvgLength
						), 
					"rVector": 
						MovingAveragePoints(
							r.getResultantVector(
								self.tracker.getXScale(), 
								self.tracker.getYScale()
							), 
							self.movAvgLength
						)
				}
				self.updateExistingValue(r)
			newDict[r.getId()] = self.movAvgDict[r.getId()]

		self.subDict = newDict

	def run(self):
		while True:
		    _, frame = self.camera.read()
		    self.tracker.setImage(frame)

		    results = self.tracker.track()
		    #print results.idMap
		    self.updateMovAvgDict(results)

		    flippedImage = cv2.flip(results.getTrackingImage(), 1)

		    cv2.imshow('Canvas', self.drawCanvas(flippedImage))
		    cv2.imshow('e2', flippedImage)
		    if cv2.waitKey(1) == 27:
		        break
		cv2.destroyAllWindows()


if __name__ == "__main__":
	eyeCalibration = EyeCalibration()
	eyeCalibration.run()


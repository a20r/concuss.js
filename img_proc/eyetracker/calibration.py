
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
			5
		)
		self.subDict = dict()
		self.movAvgLength = 4

		self.topLeft = None
		self.topRight = None
		self.bottomLeft = None
		self.bottomRight = None
		self.center = None

		self.xBias = 0
		self.yBias = 0

		self.xMin = 0
		self.yMin = 0
		self.xMax = self.tracker.getXScale()
		self.yMax = self.tracker.getYScale()

		self.rangePadding = 40

	def getAverageLookingPoint(self, avgDict):
		avgX = 0
		avgY = 0
		sLen = len(avgDict.keys())
		for key in avgDict.keys():
			avgX += avgDict[key]["rVector"].getLastCompoundedResult().x / sLen
			avgY += avgDict[key]["rVector"].getLastCompoundedResult().y / sLen

		return self.Point(
			self.tracker.mapVal(
				self.tracker.getXScale() / 2 - avgX - self.xBias,
				self.xMin - self.rangePadding - self.xBias,
				self.xMax + self.rangePadding - self.xBias,
				0,
				self.tracker.getXScale()
			),
			self.tracker.mapVal(
				self.tracker.getYScale() / 2 + avgY - self.yBias,
				self.yMin - self.rangePadding - self.yBias,
				self.yMax + self.rangePadding - self.yBias,
				0,
				self.tracker.getYScale()
			)
		)

	def drawCanvas(self, img, avgDict):
		avgLookingPoint = self.getAverageLookingPoint(avgDict)
		currentPoint = self.lookingPointMovAvg.compound(avgLookingPoint)
		cv2.circle(img, currentPoint, 5, (0, 255, 255), 5)
		return self

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
		return newDict

	def setPointAfterButton(self, button = 32):
		while True:
			_, frame = self.camera.read()
			self.tracker.setImage(frame)

			results = self.tracker.track()
			avgDict = self.updateMovAvgDict(results)
			avgPoint = self.getAverageLookingPoint(avgDict)

			flippedImage = cv2.flip(results.getTrackingImage(), 1)
			self.drawCanvas(flippedImage, avgDict)
			cv2.imshow('Eye Tracking', flippedImage)

			if cv2.waitKey(1) == button:
				return avgPoint

	def setCornerPointsInteractive(self):
		self.lookingPointMovAvg.setLength(15)
		print "Set top left corner"
		self.topLeft = self.setPointAfterButton()

		print "Set top right corner"
		self.topRight = self.setPointAfterButton()

		print "Set bottom left corner"
		self.bottomLeft = self.setPointAfterButton()

		print "Set bottom right corner"
		self.bottomRight = self.setPointAfterButton()

		print "Set center"
		self.center = self.setPointAfterButton()

		self.xMax = self.topRight.x
		self.xMin = self.topLeft.x
		self.yMax = self.bottomRight.y
		self.yMin = self.topRight.y

	def getAverageBias(self):
		return (
			int(self.center.x - self.tracker.getXScale() / 2),
			int(self.center.y - self.tracker.getYScale() / 2)
		)

	def calibrate(self):
		self.setCornerPointsInteractive()
		self.xBias, self.yBias = self.getAverageBias()
		self.run()

	def run(self):
		self.lookingPointMovAvg.setLength(10)
		self.setPointAfterButton(27)


if __name__ == "__main__":
	eyeCalibration = EyeCalibration()
	eyeCalibration.calibrate()


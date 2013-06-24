
import cv2
import blob
import numpy as np
from collections import namedtuple
from eyestats import EyeStats
from trackingstats import TrackingStats

class EyeTracker:

	def __init__(self, img_input):
		
		self.Rectangle = namedtuple("Rectangle", "x y w h")

		self.img_input = img_input
		self.img_orig = cv2.resize(img_input, (640, 480))

		# detects the eye using haar cascades
		self.cascade = cv2.CascadeClassifier("cascades/haarcascade_mcs_righteye.xml")

		# sclera color constants
		self.eyeMin = np.array([0, 0, 0], np.uint8)
		self.eyeMax = np.array([255, 38, 127], np.uint8)
		self.eyeThresh = 4000 #14013

		# pupil color constants
		self.pupilMin = np.array([0, 0, 0], np.uint8)
		self.pupilMax = np.array([255, 255,  20], np.uint8)
		self.pupilThresh = 2395

	def setImage(self, image):
		self.img_input = image
		self.img_orig = cv2.resize(img_input, (640, 480))
		return self

	def getBlobList(self, img_hsv):

		# creates a binary image via color segmentation
		# using the sclera color constants
		eyeBW = cv2.inRange(img_hsv, self.eyeMin, self.eyeMax)
		eyeBList = blob.getBlobs(eyeBW, self.eyeThresh, 10000000)

		# creates a binary image via color segmentation
		# using the pupil color constants
		pupilBW = cv2.inRange(img_hsv, self.pupilMin, self.pupilMax)
		pupilBList = blob.getBlobs(pupilBW, self.pupilThresh, 10000000)

		return eyeBList, pupilBList

	def track(self):
		trackingStats = TrackingStats()

		img = np.copy(self.img_orig)
		trackingStats.setImage(np.copy(img))

		self.eyeRects = self.cascade.detectMultiScale(self.img_orig)

		img_disp_colors = np.copy(self.img_orig)
		img_disp_centroids = np.copy(self.img_orig)

		# changes the ROI of the image
		for x, y, w, h in self.eyeRects:
			eyeStats = EyeStats()
			eyeStats.setHaarRectangle = self.Rectangle(x, y, w, h)
			img = self.img_orig[y:y+h, x:x+w]
			eyeStats.setImage(self.img_orig[y:y+h, x:x+w])
			img = cv2.resize(img, (640, 480))

			img_centroid = np.copy(img)

			# converts to HSV colorspace 
			img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

			eyeBList, pupilBList = self.getBlobList(img_hsv)

			if len(pupilBList) == 0 or len(eyeBList) == 0:
				continue

			# draws the pupil onto the image
			cv2.drawContours(img, map(lambda b: b.getContour(), pupilBList), -1, (0, 255, 255), -1)

			# gets the distances from the pupil to all of 
			# color classified sclera parts
			distList = np.array([self.norm(eye.getCentroid(), pupil.getCentroid()) for \
				eye in eyeBList for pupil in pupilBList])
			distStd = np.std(distList)
			distMean = np.mean(distList) 

			# iterates through the pupils and scleras classified
			# and only draws scleras that are one standard deviation
			# away in distance from the pupil
			for b in eyeBList:
				pb = pupilBList[0]
				eyeStats.setPupil(pb)

				if self.norm(pb.getCentroid(), b.getCentroid()) < distMean + distStd \
					and self.angleFilter(b, pb, 10):

					eyeStats.pushScleraBlob(b)
					cv2.circle(img_centroid, b.getCentroid(), 20, (255, 100, 0), 10)
					cv2.drawContours(img, [b.getContour()], -1, (255, 0, 0), -1)
					cv2.line(img_centroid, pb.getCentroid(), b.getCentroid(), (255, 255, 255), 8)

			# draws a circle for the pupils found
			for b in pupilBList:
				cv2.circle(img_centroid, b.getCentroid(), 10, (0, 255, 255), 10)

			# resizes images so they can be put back into the original image
			img = cv2.resize(img, (w, h))
			img_centroid = cv2.resize(img_centroid, (w, h))

			eyeStats.setColorImage(np.copy(img))
			eyeStats.setCentroidImage(np.copy(img_centroid))

			# sets the inner ROIs to the colored and centroid images
			img_disp_colors[y:y+h, x:x+w] = img
			img_disp_centroids[y:y+h, x:x+w] = img_centroid
			cv2.rectangle(img_disp_colors, (x, y), (x + w, y + h), (255, 255, 0), 4)
			trackingStats.pushEye(eyeStats)

		trackingStats.setColorImage(np.copy(img_disp_colors))
		trackingStats.setCentroidImage(np.copy(img_disp_centroids))
		return trackingStats

	def angleFilter(self, b, pb, padding):
		deltaY = b.getCentroid()[1] - pb.getCentroid()[1]
		deltaX = b.getCentroid()[0] - pb.getCentroid()[0]

		angleInDegrees = np.arctan(deltaY / deltaX) * 180 / np.pi
		return abs(angleInDegrees + 45) < padding or abs(angleInDegrees) < padding

	def norm(self, p1, p2):
		"""
		Finds the distance between the two points
		"""
		return np.sqrt(pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2))

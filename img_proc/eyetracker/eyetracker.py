import cv2
import blob
import numpy as np
from collections import namedtuple
from eyestats import EyeStats
from trackingstats import TrackingStats

class EyeTracker:

	def __init__(self, img_input = None):

		self.Rectangle = namedtuple("Rectangle", "x y w h")

		if img_input != None:
			self.img_input = img_input
			self.img_orig = cv2.resize(img_input, (640, 480))

		# detects the eye using haar cascades
		self.cascade = cv2.CascadeClassifier("cascades/haarcascade_mcs_righteye.xml")

		# pupil color constants
		self.pupilMin = self._val2np(0)
		self.pupilMax = self._val2np(20)
		self.pupilThresh = 4000

	def setImage(self, image):
		self.img_input = image
		self.img_orig = cv2.resize(self.img_input, (640, 480))
		return self

	def _val2np(self, val):
		return np.array([val], np.uint8)

	def _tupleSum(self, t1, t2):
		retList = list()
		for i in xrange(len(t1)):
			retList += [t1[i] + t2[i]]
		return tuple(retList)

	def _mapVal(x, in_min, in_max, out_min, out_max):
	  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min

	def getBlobList(self, img):

		# creates a binary image via color segmentation
		pupilBW = cv2.inRange(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), self.pupilMin,
			self.pupilMax)
		pupilBList = blob.getBlobs(pupilBW, self.pupilThresh)

		return pupilBList

	def drawPupils(self, img_centroid, pupilBList, eyeStats):
		for pb in pupilBList:
			eyeStats.pushPupil(pb)
			cv2.circle(img_centroid, pb.getCentroid(), 10, (0, 255, 255), 10)
			cv2.line(img_centroid, pb.getCentroid(), (0, 0), (255, 255, 255), 10)
			cv2.line(img_centroid, pb.getCentroid(), (img_centroid.shape[1], 
				img_centroid.shape[0]), (255, 255, 255), 10)
			cv2.line(img_centroid, pb.getCentroid(), (0, img_centroid.shape[0]), 
				(255, 255, 255), 10)
			cv2.line(img_centroid, pb.getCentroid(), (img_centroid.shape[1], 0), 
				(255, 255, 255), 10)

	def track(self):
		trackingStats = TrackingStats()

		img = np.copy(self.img_orig)
		trackingStats.setImage(np.copy(img))

		self.eyeRects = self.cascade.detectMultiScale(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), 
			scaleFactor = 1.4, minNeighbors = 3, maxSize = (100, 100), minSize = (0, 0))

		img_disp_colors = np.copy(self.img_orig)
		img_disp_centroids = np.copy(self.img_orig)
		img_disp_tracking = np.copy(self.img_orig)

		# changes the ROI of the image
		for x, y, w, h in self.eyeRects:
			eyeStats = EyeStats()
			eyeStats.setHaarRectangle(self.Rectangle(x, y, w, h))
			img = self.img_orig[y:y+h, x:x+w]
			eyeStats.setImage(self.img_orig[y:y+h, x:x+w])
			img = cv2.resize(img, (640, 480))

			img_centroid = np.copy(img)
			img_tracking = np.copy(img)

			pupilBList = self.getBlobList(img)

			if len(pupilBList) == 0:
				continue

			# draws the pupil onto the image
			cv2.drawContours(img, map(lambda b: b.getContour(), pupilBList), -1, (0, 255, 255), -1)

			# draws a circle for the pupils found
			self.drawPupils(img_centroid, pupilBList, eyeStats)

			resVecs = eyeStats.getResultantVectors()
			for i in xrange(len(resVecs)):
				cv2.circle(img_centroid, eyeStats[i].getCentroid(), 10, (0, 255, 255), 10)
				endPoint = self._tupleSum(eyeStats[i].getCentroid(), resVecs[i])
				cv2.line(img_tracking, eyeStats[i].getCentroid(),
					endPoint,
					(0, 255, 0), 10)
				cv2.line(img_centroid, eyeStats[i].getCentroid(),
					self._tupleSum(eyeStats[i].getCentroid(), resVecs[i]),
					(0, 255, 0), 10)

			# resizes images so they can be put back into the original image
			img = cv2.resize(img, (w, h))
			img_centroid = cv2.resize(img_centroid, (w, h))
			img_tracking = cv2.resize(img_tracking, (w, h))

			eyeStats.setTrackingImage(np.copy(img_tracking))
			eyeStats.setColorImage(np.copy(img))
			eyeStats.setCentroidImage(np.copy(img_centroid))

			# sets the inner ROIs to the colored and centroid images
			img_disp_colors[y:y+h, x:x+w] = img
			img_disp_centroids[y:y+h, x:x+w] = img_centroid
			img_disp_tracking[y:y+h, x:x+w] = img_tracking
			cv2.rectangle(img_disp_colors, (x, y), (x + w, y + h), (255, 0, 0), 2)
			cv2.rectangle(img_disp_centroids, (x, y), (x + w, y + h), (255, 0, 0), 2)
			trackingStats.pushEye(eyeStats)

		trackingStats.setColorImage(np.copy(img_disp_colors))
		trackingStats.setTrackingImage(np.copy(img_disp_tracking))
		trackingStats.setCentroidImage(np.copy(img_disp_centroids))
		return trackingStats

	def norm(self, p1, p2):
		"""
		Finds the distance between the two points
		"""
		return np.sqrt(pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2))


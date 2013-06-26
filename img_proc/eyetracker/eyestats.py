
import numpy as np
from collections import namedtuple

class EyeStats(object):

	def __init__(self):
		self.haarRectangle = None
		self.pupilBlobs = list()
		self.centroidImage = None
		self.colorImage = None
		self.image = None
		self.trackingImage = None

	def norm(self, p1, p2):
		"""
		Finds the distance between the two points
		"""
		return np.sqrt(pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2))

	def pushPupil(self, nPupil):
		self.pupilBlobs += [nPupil]
		return self

	def setCentroidImage(self, cImage):
		self.centroidImage = cImage
		return self

	def setColorImage(self, cImage):
		self.colorImage = cImage
		return self

	def setImage(self, image):
		self.image = image
		return self

	def setHaarRectangle(self, rect):
		self.haarRectangle = rect
		return self

	def setTrackingImage(self, image):
		self.trackingImage = image
		return self

	def getTrackingImage(self):
		return self.trackingImage

	def getHaarRectangle(self):
		return self.haarRectangle

	def getCornerDistances(self):
		CornerDistances = namedtuple("CornerDistances", "topLeft topRight bottomLeft bottomRight")
		return [CornerDistances(
			self.norm(pb.getCentroid(), (self.haarRectangle.x, self.haarRectangle.y)),
			self.norm(pb.getCentroid(), (self.haarRectangle.x + self.haarRectangle.w, 
				self.haarRectangle.y)),
			self.norm(pb.getCentroid(), (self.haarRectangle.x, 
				self.haarRectangle.y + self.haarRectangle.h)),
			self.norm(pb.getCentroid(), (self.haarRectangle.x + self.haarRectangle.w, 
				self.haarRectangle.y + self.haarRectangle.h))) for pb in self.pupilBlobs]

	def getCornerVectors(self):
		Vector = namedtuple("Vector", "x y")
		CornerVectors = namedtuple("CornerDistances", "topLeft topRight bottomLeft bottomRight")
		retList = list()
		for pb in self.pupilBlobs:
			centroid = Vector(pb.getCentroid()[0], pb.getCentroid()[1])
			retList += [CornerVectors(
				Vector(centroid.x - self.haarRectangle.x, centroid.y - self.haarRectangle.y),
				Vector(centroid.x - self.haarRectangle.x - self.haarRectangle.w, 
					centroid.y - self.haarRectangle.y),
				Vector(centroid.x - self.haarRectangle.x, centroid.y - self.haarRectangle.y - 
					self.haarRectangle.h),
				Vector(centroid.x - self.haarRectangle.x - self.haarRectangle.w, 
					centroid.y - self.haarRectangle.y - self.haarRectangle.h))]
		return retList

	def getResultantVectors(self):
		Vector = namedtuple("Vector", "x y")
		cVectors = self.getCornerVectors()
		return [reduce(lambda a, b: Vector(a.x + b.x, a.y + b.y), cVecs) for cVecs in cVectors]

	def getPupil(self):
		return self.pupil

	def getCentroidImage(self):
		return self.centroidImage

	def getColorImage(self):
		return self.colorImage

	def getImage(self):
		return self.image

	def __str__(self):
		return "Pupil: " + str(self.pupil.getCentroid())

	def __getitem__(self, key):
		return self.pupilBlobs[key]

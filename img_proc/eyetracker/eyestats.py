
import numpy as np
from collections import namedtuple

class EyeStats(object):

	def __init__(self):
		self.haarRectangle = None
		self.pupil = None
		self.centroidImage = None
		self.colorImage = None
		self.image = None
		self.uId = None
		self.trackingImage = None
		self.Point = namedtuple("Point", "x y")

	def norm(self, p1, p2):
		"""
		Finds the distance between the two points
		"""
		return np.sqrt(pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2))

	def setId(self, uId):
		self.uId = uId
		return self

	def setPupil(self, nPupil):
		self.pupil = nPupil
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

	def getHaarCentroid(self):
		return self.Point(self.haarRectangle.x + self.haarRectangle.w / 2, 
			self.haarRectangle.y + self.haarRectangle.h / 2)

	def getId(self):
		return self.uId

	def getTrackingImage(self):
		return self.trackingImage

	def getHaarRectangle(self):
		return self.haarRectangle

	def getCornerDistances(self):
		CornerDistances = namedtuple("CornerDistances", "topLeft topRight bottomLeft bottomRight")
		pb = self.pupil
		return CornerDistances(
			self.norm(pb.getCentroid(), (self.haarRectangle.x, self.haarRectangle.y)),
			self.norm(pb.getCentroid(), (self.haarRectangle.x + self.haarRectangle.w, 
				self.haarRectangle.y)),
			self.norm(pb.getCentroid(), (self.haarRectangle.x, 
				self.haarRectangle.y + self.haarRectangle.h)),
			self.norm(pb.getCentroid(), (self.haarRectangle.x + self.haarRectangle.w, 
				self.haarRectangle.y + self.haarRectangle.h)))

	def getCornerVectors(self, xSize, ySize):
		Vector = namedtuple("Vector", "x y")
		CornerVectors = namedtuple("CornerVectors", "topLeft topRight bottomLeft bottomRight")
		pb = self.pupil
		centroid = pb.getCentroid()
		return CornerVectors(
			Vector(centroid.x, centroid.y),
			Vector(centroid.x - xSize, centroid.y),
			Vector(centroid.x, centroid.y - ySize),
			Vector(centroid.x - xSize, centroid.y - ySize)
		)

	def getResultantVector(self, xSize, ySize):
		Vector = namedtuple("Vector", "x y")
		cVecs = self.getCornerVectors(xSize, ySize)
		return reduce(lambda a, b: Vector(a.x + b.x, a.y + b.y), cVecs)

	# IMPORTANT: returns the pupil for the given size
    # of the sub image. Therefore the centroid will
    # be respective of the sub image and not the entire
    # frame!
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

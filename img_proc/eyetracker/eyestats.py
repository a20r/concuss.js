
from collections import namedtuple

class EyeStats(object):

	def __init__(self):
		self.haarRectangle = None
		self.pupilBlobs = list()
		self.centroidImage = None
		self.colorImage = None
		self.image = None

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

	def getHaarRectangle(self):
		return self.haarRectangle

	def getCornerDistances(self):
		CornerDistances = namedtuple("CornerDistances", "topLeft topRight bottomLeft bottomRight")
		return [CornerDistances(
			self.norm(pb.getCentroid(), (this.haarRectangle.x, this.haarRectangle.y)),
			self.norm(pb.getCentroid(), (this.haarRectangle.x + this.haarRectangle.w, 
				this.haarRectangle.y)),
			self.norm(pb.getCentroid(), (this.haarRectangle.x, 
				this.haarRectangle.y + this.haarRectangle.h)),
			self.norm(pb.getCentroid(), (this.haarRectangle.x + this.haarRectangle.w, 
				this.haarRectangle.y + this.haarRectangle.h))) for pb in self.pupilBlobs]

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

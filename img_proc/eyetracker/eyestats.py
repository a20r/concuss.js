class EyeStats(object):

	def __init__(self):
		self.scleraBlobs = list()
		self.haarRectangle = None
		self.pupil = None
		self.centroidImage = None
		self.colorImage = None
		self.image = None

	def norm(self, p1, p2):
		"""
		Finds the distance between the two points
		"""
		return np.sqrt(pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2))

	def pushScleraBlob(self, sclera):
		self.scleraBlobs += [sclera]
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

	def getHaarRectangle(self):
		return self.haarRectangle

	def getPupilDistances(self):
		return [self.norm(sclera.getCentroid(), self.pupil.getCentroid()) for \
			sclera in self.scleraBlobs]

	def getPupil(self):
		return self.pupil

	def getScleraBlobs(self):
		return self.scleraBlobs

	def getSclera(self, index):
		return self.scleraBlobs[index]

	def getCentroidImage(self):
		return self.centroidImage

	def getColorImage(self):
		return self.colorImage

	def getImage(self):
		return self.image

	def __str__(self):
		return "Pupil: " + str(self.pupil.getCentroid()) + "\nSclera: " + \
			", ".join(str(i.getCentroid()) for i in self.scleraBlobs)

	def __getitem__(self, key):
		return self.scleraBlobs[key]
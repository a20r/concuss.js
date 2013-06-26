
class TrackingStats(object):

	def __init__(self):
		self.centroidImage = None
		self.image = None
		self.colorImage = None
		self.eyeList = list()

	def pushEye(self, eye):
		self.eyeList += [eye]
		return self

	def setColorImage(self, cImage):
		self.colorImage = cImage
		return self

	def setCentroidImage(self, cImage):
		self.centroidImage = cImage
		return self

	def setImage(self, image):
		self.image = image
		return self

	def getColorImage(self):
		return self.colorImage

	def getCentroidImage(self):
		return self.centroidImage

	def getImage(self):
		return self.image

	def getEye(self, index):
		return self.eyeList[index]

	def getEyeList(self):
		return eyeList

	def __str__(self):
		retString = str()
		for eye in self.eyeList:
			retString += str(eye) + "\n"
		return retString

	def __getitem__(self, key):
		return self.eyeList[key]
		
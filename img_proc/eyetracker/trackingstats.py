
import uuid

class TrackingStats(object):

	def __init__(self):
		self.centroidImage = None
		self.image = None
		self.colorImage = None
		self.trackingImage = None
		self.eyeList = list()
		self.idMap = dict()

	def assignIds(self, prevEyes):
		if len(prevEyes) == 0:
			for eye in self.eyeList:
				eyeId = str(uuid.uuid4())
				self.idMap[eyeId] = eye
				eye.setId(eyeId)
		else:
			distList = [enumerate([eye.norm(eye.getPupil().getCentroid(), pEye.getPupil().getCentroid()) 
				for eye in self.eyeList]) for pEye in prevEyes]

			distList = map(lambda ds: sorted(ds, key = lambda val: val[1]), distList)
			#print distList
			for i, ds in enumerate(distList):
				try:
					j, _ = ds[0]
				except IndexError:
					self.eyeList = list()
					break

				self.eyeList[j].setId(prevEyes[i].getId())
				self.idMap[prevEyes[i].getId()] = self.eyeList[j]

		return self

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

	def setTrackingImage(self, image):
		self.trackingImage = image
		return self

	def getTrackingImage(self):
		return self.trackingImage

	def getColorImage(self):
		return self.colorImage

	def getCentroidImage(self):
		return self.centroidImage

	def getImage(self):
		return self.image

	def getEye(self, index):
		return self.eyeList[index]

	def getEyeList(self):
		return self.eyeList

	def __str__(self):
		retString = str()
		for eye in self.eyeList:
			retString += str(eye) + " "
		return retString

	def __getitem__(self, key):
		if type(key) == int:
			return self.eyeList[key]
		elif type(key) == str:
			return self.idMap[key]
		else:
			raise TypeError("Cannot index the class using type: " + type(key))



import uuid

class TrackingStats(object):

	def __init__(self):
		self.centroidImage = None
		self.image = None
		self.colorImage = None
		self.trackingImage = None
		self.eyeList = list()
		self.idMap = dict()

	# assigns unique identifiers to pupils
	def assignIds(self, prevEyes):
		if len(self.eyeList) == 0:
			return list()

		if len(prevEyes) == 0:
			for eye in self.eyeList:
				eyeId = str(uuid.uuid4())
				self.idMap[eyeId] = eye
				eye.setId(eyeId)
			return list()
		else:
			distList = [enumerate([eye.norm(eye.getPupil().getCentroid(), pEye.getPupil().getCentroid()) 
				for eye in self.eyeList]) for pEye in prevEyes]

			minDistList = map(lambda ds: reduce(lambda a, b: a if a[1] < b[1] else b, ds), distList)
			usedPrevEyes = list()
			for i, (j, minDist) in enumerate(minDistList):
				if self.eyeList[j].getId() == None and not i in usedPrevEyes:
					self.eyeList[j].setId(prevEyes[i].getId())
					self.idMap[prevEyes[i].getId()] = self.eyeList[j]
					usedPrevEyes += [i]

			for j, minDist in minDistList:
				if self.eyeList[j].getId() == None:
					eyeId = str(uuid.uuid4())
					self.eyeList[j].setId(eyeId)
					self.idMap[eyeId] = self.eyeList[j]

			return list(set(prevEyes) ^ set(prevEyes[i] for i in usedPrevEyes))

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



from collections import namedtuple

class MovingAverageList(object):

	def __init__(self, startingValue, length):
		self.movAvgList = [startingValue for _ in xrange(length)]
		self.lastMean = None

	def getLength(self):
		return len(self.movAvgList)

	def put(self, value):
		del self.movAvgList[0]
		self.movAvgList += [value]
		return self

	def compound(self, value):
		self.put(value)
		self.lastMean = self.getMean()
		return self.lastMean

	def setLength(self, length):
		if length < len(self.movAvgList):
			self.movAvgList = self.movAvgList[length - 1 : -1]
		elif length > len(self.movAvgList):
			lPoint = self.movAvgList[-1]
			self.movAvgList.extend(
				[
					lPoint for _ in xrange(
						length - len(self.movAvgList)
					)
				]
			)
		return self

	def getLastCompoundedResult(self):
		return self.lastMean

	def __getitem__(self, key):
		return self.movAvgList[key]

	def __str__(self):
		return str(self.movAvgList)

class MovingAveragePoints(MovingAverageList):
	def __init__(self, startingValue, length):
		self.Point = namedtuple("Point", "x y")
		super(
			MovingAveragePoints, 
			self
		).__init__(startingValue, length)
		self.lastMean = self.Point(0, 0)

	def getMean(self):
		divList = map(
			lambda val: self.Point(
				float(val.x) / float(len(self.movAvgList)), 
				float(val.y) / float(len(self.movAvgList))
			), 
			self.movAvgList
		)
		retVal = reduce(
			lambda b1, b2: self.Point(
				b1.x + b2.x, b1.y + b2.y
			), 
			divList
		)
		return self.Point(int(retVal.x), int(retVal.y))


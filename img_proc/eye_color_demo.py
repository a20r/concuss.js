
import cv2
import sys
import numpy as np
import blob

def norm(p1, p2):
	"""
	Finds the distance between the two points
	"""
	return np.sqrt(pow(p1[0] - p2[0], 2) + pow(p1[1] - p2[1], 2))

def toggleView(thresh):
	"""
	Toggles the picture being shown
	"""
	global img_disp_colors, img_disp_centroids
	if thresh == 0:
		cv2.imshow('Color Segmentation', img_disp_colors)
	else:
		cv2.imshow('Color Segmentation', img_disp_centroids)

def main():
	if len(sys.argv) != 2:
	    print "Usage : python display_image.py <image_file>"
	else:
		cv2.namedWindow('Color Segmentation')

		img_orig = cv2.imread(sys.argv[1], cv2.CV_LOAD_IMAGE_COLOR)
		img_orig = cv2.resize(img_orig, (640, 480))

		# detects the eye using haar cascades
		cascade = cv2.CascadeClassifier("haarcascade_mcs_righteye.xml")
		eyeRects = cascade.detectMultiScale(img_orig)

		# sclera color constants
		eyeMin = np.array([0, 0, 0], np.uint8)
		eyeMax = np.array([255, 38, 127], np.uint8)
		eyeThresh = 4000 #14013

		# pupil color constants
		pupilMin = np.array([0, 0, 0], np.uint8)
		pupilMax = np.array([255, 255,  20], np.uint8)
		pupilThresh = 2395

		if img_orig == None:
			return False

		img = np.copy(img_orig)

		# gets the largest haar bounding rectangle for analysis
		areaRects = map(lambda eye: eye[2] * eye[3], eyeRects)
		maxRects = [eyeRects[i] for i, j in enumerate(areaRects) if j == max(areaRects)]

		# changes the ROI of the image
		for x, y, w, h in maxRects:
			img = img[y:y+h, x:x+w]
			img = cv2.resize(img, (640, 480))

		img_centroid = np.copy(img)

		# converts to HSV colorspace 
		img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

		# creates a binary image via color segmentation
		# using the sclera color constants
		eyeBW = cv2.inRange(img_hsv, eyeMin, eyeMax)
		eyeBList = blob.getBlobs(eyeBW, eyeThresh, 10000000)

		# creates a binary image via color segmentation
		# using the pupil color constants
		pupilBW = cv2.inRange(img_hsv, pupilMin, pupilMax)
		pupilBList = blob.getBlobs(pupilBW, pupilThresh, 10000000)

		# draws the pupil onto the image
		cv2.drawContours(img, map(lambda b: b.getContour(), pupilBList), -1, (0, 255, 255), -1)

		# gets the distances from the pupil to all of 
		# color classified sclera parts
		distList = np.array([norm(eye.getCentroid(), pupil.getCentroid()) for eye in eyeBList for pupil in pupilBList])
		distStd = np.std(distList)
		distMean = np.mean(distList) 

		print distList, distStd

		# iterates through the pupils and scleras classified
		# and only draws scleras that are one standard deviation
		# away in distance from the pupil
		for b in eyeBList:
			for pb in pupilBList:
				if norm(pb.getCentroid(), b.getCentroid()) < distMean + distStd:
					cv2.circle(img_centroid, b.getCentroid(), 20, (255, 100, 0), 10)
					cv2.drawContours(img, [b.getContour()], -1, (255, 0, 0), -1)
					cv2.line(img_centroid, pb.getCentroid(), b.getCentroid(), (255, 255, 255), 8)

		# draws a circle for the pupils found
		for b in pupilBList:
			cv2.circle(img_centroid, b.getCentroid(), 10, (0, 255, 255), 10)

		cv2.createTrackbar('Toggle View', 'Color Segmentation', 0, 1, toggleView)

		global img_disp_colors, img_disp_centroids
		for x, y, w, h in maxRects:
			img = cv2.resize(img, (w, h))
			img_centroid = cv2.resize(img_centroid, (w, h))
			img_disp_colors = np.copy(img_orig)
			img_disp_centroids = np.copy(img_orig)
			img_disp_colors[y:y+h, x:x+w] = img
			img_disp_centroids[y:y+h, x:x+w] = img_centroid

		cv2.imshow('Color Segmentation', img_disp_colors)

		cv2.waitKey(0)
		cv2.destroyAllWindows()
		return True

if __name__ == "__main__":
	main()

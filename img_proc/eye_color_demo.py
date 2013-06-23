
import cv2
import sys
import numpy as np
import blob

# Iris constants
irisMin = np.array([0, 0, 0], np.uint8)
irisMax = np.array([129, 86, 116], np.uint8)
irisThresh = 4628

# Eye-lid and lashes
lidRange = 129
lidMin = np.array([0, 255 - lidRange, 133 - lidRange], np.uint8)
lidMax = np.array([62, 255, 133], np.uint8)
lidThresh = 11414

# Full eye-ball
eyeMin = np.array([0, 0, 0], np.uint8)
eyeMax = np.array([255, 61, 168], np.uint8)
eyeThresh = 6013

def main():
	if len(sys.argv) != 2:
	    print "Usage : python display_image.py <image_file>"
	else:
		cv2.namedWindow('Color Segmentation')
		cv2.namedWindow('Centroid Alignment')
		cv2.namedWindow
		img_orig = cv2.imread(sys.argv[1], cv2.CV_LOAD_IMAGE_COLOR)
		img = np.copy(img_orig)
		img_centroid = np.copy(img_orig)

		if img == None:
			return False

		img_hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

		irisBW = cv2.inRange(img_hsv, irisMin, irisMax)
		irisBList = blob.getBlobs(irisBW, irisThresh, 10000000)

		lidBW = cv2.inRange(img_hsv, lidMin, lidMax)
		lidBList = blob.getBlobs(lidBW, lidThresh, 10000000)

		eyeBW = cv2.inRange(img_hsv, eyeMin, eyeMax)
		eyeBList = blob.getBlobs(eyeBW, eyeThresh, 10000000)

		cv2.drawContours(img, map(lambda b: b.getContour(), eyeBList), -1, (255, 0, 0), -1)
		cv2.drawContours(img, map(lambda b: b.getContour(), lidBList), -1, (0, 255, 0), -1)
		cv2.drawContours(img, map(lambda b: b.getContour(), irisBList), -1, (0, 0, 255), -1)

		for b in eyeBList:
			cv2.circle(img_centroid, b.getCentroid(), 20, (255, 0, 0), 2)

		for b in irisBList:
			cv2.circle(img_centroid, b.getCentroid(), 10, (0, 0, 255), 2)

		for b in lidBList:
			cv2.circle(img_centroid, b.getCentroid(), 10, (0, 255, 0), 2)

		cv2.imshow('Color Segmentation', img)
		cv2.imshow('Centroid Alignment', img_centroid)

		cv2.waitKey(0)
		cv2.destroyAllWindows()
		return True

if __name__ == "__main__":
	main()

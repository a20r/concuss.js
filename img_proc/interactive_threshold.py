import cv2
import sys
import numpy as np

cv2.namedWindow('Display Window')
COLOR_MIN = np.array([0, 0, 0], np.uint8)
COLOR_MAX = np.array([150, 50, 200], np.uint8)
padding = 30

def printStats():
	print "Range:", padding
	print "HSV:", COLOR_MAX

def changedRange(nRange):
	global padding
	padding = nRange
	changedH(COLOR_MAX[0])
	changedS(COLOR_MAX[1])
	changedV(COLOR_MAX[2])
	printStats()

def changed(channel):
	def changedChannel(thresh):
		COLOR_MAX[channel] = thresh
		COLOR_MIN[channel] = thresh - padding if thresh - padding > 0 else 0
		global img
		img_thresh = cv2.inRange(img, COLOR_MIN, COLOR_MAX)
		cv2.imshow('Display Window',img_thresh)
		printStats()
	return changedChannel

def main():
	if len(sys.argv) != 2:
	    print "Usage : python display_image.py <image_file>"

	else:
		global img
		img = cv2.imread(sys.argv[1], cv2.CV_LOAD_IMAGE_COLOR)

		if (img == None):
			print "Could not open or find the image"
		else:
			img = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
			img_thresh = cv2.inRange(img, COLOR_MIN, COLOR_MAX)

			cv2.createTrackbar('H:','Display Window', 30, 255, changed(0))
			cv2.createTrackbar('S:','Display Window', 30, 255, changed(1))
			cv2.createTrackbar('V:','Display Window', 30, 255, changed(2))
			cv2.createTrackbar('Range:', 'Display Window', 0, 255, changedRange)

			cv2.imshow('Display Window',img)

			print "size of image: ", img.shape
			cv2.waitKey(0)
			cv2.destroyAllWindows()

if __name__ == "__main__":
	main()


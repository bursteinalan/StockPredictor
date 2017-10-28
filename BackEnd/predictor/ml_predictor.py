import json
import numpy as np
from sklearn.svm import SVR
import matplotlib.pyplot as plt

# dates for stock prices
dates = []

# prices for corresponding to date
prices = []

def pull_data(file):
	with open(file, 'r') as data_file:
		data = json.load(data_file)
		for n in data:
			dates.append(data[n][0])
			prices.append(data[n][1])

	print(dp)

pull_data('sample.json')




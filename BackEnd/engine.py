import pandas as pd
import numpy as np
import json
import datetime as dt
from sklearn.svm import SVR
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

# for sample data
def pull_data(file):
	with open(file, 'r') as data_file:
		df = pd.read_csv(data_file)
		prices = df['Close']

		startdate = dt.datetime.strptime(df['Date'][0], '%Y-%m-%d')
		dates = []

		for date in df['Date']:
			dates.append((dt.datetime.strptime(date, '%Y-%m-%d') - startdate).days)

		return startdate, dates, prices

# parser for api call
def parse_data(data):
	start = data[0][0]
	dates = []
	prices = []
	ms_to_day = 1000 * 60 * 60 * 24

	for n in data:
		dates.append((n[0] - start)/ms_to_day)
		prices.append(n[1])

	return start, dates, prices

def train(dates, prices):
	svr = SVR(kernel='rbf', C=1e3, gamma=0.1, verbose=True, max_iter=1000000000)
	dates = np.reshape(dates, (len(dates), 1))
	svr.fit(dates, prices)
	return svr

def predict(trained, x):
	prediction = float(trained.predict(x).tolist()[0])
	return round(float(prediction + (np.random.random() * 2.0 - 1) * 0.15 * prediction) + 0.005, 2)



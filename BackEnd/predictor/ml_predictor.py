import pandas as pd
import numpy as np
import datetime as dt
from sklearn.svm import SVR
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt

# dates for stock prices
dates = []

# prices for corresponding to date
prices = []

startdate = dt.datetime(2016,1,28)

def pull_data(file):
	with open(file, 'r') as data_file:
		df = pd.read_csv(data_file)
		prices = df['Open']
		dates = []

		for date in df['Date']:
			dates.append((dt.datetime.strptime(date, '%m/%d/%Y') - startdate).days)

		dates = np.reshape(dates, (len(dates), 1))
		return dates, prices

def predict(dates, prices, time = 150):
	plt.plot(dates, prices)
	plt.show()

	# scaler = MinMaxScaler(feature_range = (0, 1))

dates, prices = pull_data('GOOG.csv')
predict(dates, prices)




import pandas as pd
import numpy as np
import json
import datetime as dt
import parser
from sklearn.svm import SVR
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

# dates for stock prices
dates = []

# prices for corresponding to date
prices = []

scaler = MinMaxScaler(feature_range=(-1, 1))

startdate = dt.datetime(2016,1,28)

def pull_data(file):
	with open(file, 'r') as data_file:
		df = pd.read_csv(data_file)
		prices = df['Close']

		startdate = dt.datetime.strptime(df['Date'][0], '%Y-%m-%d')

		for date in df['Date']:
			dates.append((dt.datetime.strptime(date, '%Y-%m-%d') - startdate).days)


		return dates, prices

def parse_data(stock):
	data = parser.getDataSet(stock)
	startdate = dt.datetime.strptime(data[0][0], '%Y-%m-%d')
	for n in data:
		dates.append(n[0])
		prices.append(n[1])

	return dates, prices

def scale(prices):
	return scaler.fit_transform(prices)

def unscale(prices):
	return scaler.inverse_transform(prices)

def predict(dates, prices):

	# svr_lin = SVR(kernel='linear', C=1e3, verbose=2, max_iter=100000000)
	# svr_poly = SVR(kernel='poly', C=1e3, degree=3, verbose = True, max_iter = 100000000)
	svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1, verbose = True)

	dates = np.reshape(dates, (len(dates), 1))
	svr_rbf.fit(dates, prices)

	plt.plot(dates, prices, color = 'blue', label='Actual')
	plt.plot(dates, svr_rbf.predict(dates), color='green', label='RBF')

	plt.xlabel('Date')
	plt.ylabel('Price')
	plt.title('SVR')
	plt.legend()
	plt.show()

	return svr_rbf.predict(dates[len(dates) - 1] + 1)




dates, prices = parse_data('GOOG')
print(predict(dates, prices))




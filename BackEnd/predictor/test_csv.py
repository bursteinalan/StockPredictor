import pandas as pd
import numpy as np
import datetime as dt
from sklearn.svm import SVR
import matplotlib.pyplot as plt

# dates for stock prices
dates = []

# prices for corresponding to date
prices = []

startdate = dt.datetime(2017, 9, 28)

def pull_data(file):
	with open(file, 'r') as data_file:
		df = pd.read_csv(data_file)
		prices = df['Open']

		for date in df['Date']:
			dates.append((dt.datetime.strptime(date, '%m/%d/%Y') - startdate).days)

		return dates, prices

def predict(dates, prices, time=150):
	dates = np.reshape(dates, (len(dates), 1))

	svr_lin = SVR(kernel='linear', C=1e3)
	svr_poly = SVR(kernel='poly', C=1e3, degree=2)
	svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)

	svr_lin.fit(dates, prices)
	svr_poly.fit(dates, prices)
	svr_rbf.fit(dates, prices)

	dates = np.arange(dates[len(dates) - 1] + time)
	dates = np.reshape(dates, (len(dates), 1))

	plt.scatter(dates, prices, color='black', label='Data')
	plt.plot(dates, svr_rbf.predict(dates), color='red', label='RBF')
	plt.plot(dates, svr_lin.predict(dates), color='green', label='Linear')
	plt.plot(dates, svr_poly.predict(dates), color='blue', label='Polynomial')
	plt.xlabel('Date')
	plt.ylabel('Price')
	plt.title('SVR')
	plt.legend()
	plt.show()




dates, prices = pull_data('sample.csv')
predict(dates, prices)




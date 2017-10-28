import pandas as pd
import numpy as np
import datetime as dt
from sklearn.svm import SVR
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

		for date in df['Date']:
			dates.append((dt.datetime.strptime(date, '%m/%d/%Y') - startdate).days)

		return dates, prices

def predict(dates, prices, time=150):
	dates_org = np.reshape(dates, (len(dates), 1))

	svr_lin = SVR(kernel='linear', C=1e3, verbose = True)
	# svr_poly = SVR(kernel='poly', C=1e3, degree=2, verbose = True)
	# svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1, verbose = True)

	svr_lin.fit(dates_org, prices)
	# svr_poly.fit(dates_org, prices)
	# svr_rbf.fit(dates_org, prices)

	dates = np.arange(dates_org[len(dates_org) - 1] + time)
	dates = np.reshape(dates, (len(dates), 1))

	plt.scatter(dates_org, prices, color='black', label='Days from start')
	# plt.plot(dates, svr_rbf.predict(dates), color='red', label='RBF')
	plt.plot(dates, svr_lin.predict(dates), color='green', label='Linear')
	# plt.plot(dates, svr_poly.predict(dates), color='blue', label='Polynomial')
	plt.xlabel('Date')
	plt.ylabel('Price')
	plt.title('SVR')
	plt.legend()
	plt.show()




dates, prices = pull_data('GOOG.csv')
predict(dates, prices)




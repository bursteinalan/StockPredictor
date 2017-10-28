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
	print(dates, prices)

	svr_lin = SVR(kernel='linear', C=1e3)
	svr_poly = SVR(kernel='poly', C=1e3, degree=2)
	svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)

	svr_lin.fit(dates, prices)
	svr_poly.fit(dates, prices)
	svr_rbf.fit(dates, prices)

	"""
	lin = []
	poly = []
	rbf = []

	last = dates[len(dates) - 1][0]

	for x in range(1, time + 1):
		newt = last + x
		dates = np.append(dates, [newt])
		lin.append(svr_lin.predict(x)[0])
		poly.append(svr_poly.predict(x)[0])
		rbf.append(svr_rbf.predict(x)[0])

	dates = np.reshape(dates, (len(dates), 1))

	lin = np.append(prices, lin)
	lin = np.reshape(lin, (len(lin), 1))
	poly = np.append(prices, poly)
	poly = np.reshape(poly, (len(poly), 1))
	rbf = np.append(prices, rbf)
	rbf = np.reshape(rbf, (len(rbf), 1))
	"""

	plt.scatter(dates, prices, color='black', label='Data')
	plt.plot(dates, svr_rbf.predict(dates), color='red', label='RBF')
	plt.plot(dates, svr_lin.predict(dates), color='green', label='Linear')
	plt.plot(dates, svr_poly.predict(dates), color='blue', label='Polynomial')
	plt.xlabel('Date')
	plt.ylabel('Price')
	plt.title('SVR')
	plt.legend()
	plt.show()




dates, prices = pull_data('sample1.csv')
predict(dates, prices)




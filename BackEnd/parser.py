from flask import Flask
from yahoo_finance import Share
import json


yahoo = Share('GOOG')

print yahoo.get_price()

# app = Flask(__name__)
#
# @app.route('/getDataSet')
# def getDataSet(stockTicker):
#

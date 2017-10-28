#! /usr/bin/env python3

from yahoo_historical import Fetcher
from datetime import datetime

def parseTime(timeString):
    '''
    Converts date to total milliseconds
    Input: Y-m-d
    '''
    InputDate = datetime.strptime(timeString, '%Y-%m-%d').timestamp()
    return int(InputDate*1000)

def getDataSet(stockTicker):
    startYear = 1980
    while(startYear < 2017):
        # Change the fixed value here
        try:
            currentDate = [int(strNum) for strNum in datetime.now().strftime("%Y-%m-%d").split('-')]
            data = Fetcher(stockTicker, [startYear,1,1], currentDate)
            break;
        except ValueError:
            startYear += 5

    parsedDataX = list()
    parsedDataY = list()
    for _, row in data.getHistorical().iterrows():
        try:
            parsedDataX.append(parseTime(row['Date']))
            parsedDataY.append(float(row['Close']))
        except ValueError:
            continue;
    return [parsedDataX, parsedDataY]

# print(getDataSet("AAPL"))

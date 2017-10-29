from yahoo_historical import Fetcher
from datetime import datetime
from yahoo_finance import Share

def parseTime(timeString):
    '''
    Converts date to total milliseconds
    Input: Y-m-d
    '''
    InputDate = datetime.strptime(timeString, '%Y-%m-%d').timestamp()
    return int(InputDate*1000)

def getDataSet(stockTicker):
    startYear = 1980
    currentDate = [int(strNum) for strNum in datetime.now().strftime("%Y-%m-%d").split('-')]
    while(startYear < int(datetime.now().year)):
        try:
            data = Fetcher(stockTicker, [startYear,1,1], currentDate)
            break;
        except ValueError:
            startYear += 5

    parsedData = list()
    dataFrame = data.getHistorical()
    for _, row in dataFrame.iterrows():
        try:
            parsedData.append([parseTime(row['Date']), round(float(row['Close']) + 0.005 , 2)])
        except ValueError:
            continue;
    return parsedData

def getStat(stockTicker):
    ticker = Share(stockTicker)
    stats = {"Market cap": ticker.get_market_cap(), "EBITDA" : ticker.get_ebitda(),"Price Earning Ratio":ticker.get_price_earnings_ratio(), "EPS": ticker.get_earnings_share(), "Dividend Yield": ticker.get_dividend_yield()}
    return stats


# print(getDataSet("^GSPC"))
# print(getStat("AAPL"))
# print(getDataSet("^DJI"))

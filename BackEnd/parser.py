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
    StatDict = dict()
    ticker = Share(stockTicker)

    mktCap = ticker.get_market_cap()
    if(mktCap != None and mktCap != 0):
        StatDict["Market cap"] = mktCap
    ebitda = ticker.get_ebitda()
    if(ebitda != None and ebitda != 0):
        StatDict["EBITDA"] = ebitda
    peR = ticker.get_price_earnings_ratio()
    if (peR != None and peR != 0):
        StatDict["Price Earning Ratio"] = peR
    EPS = ticker.get_earnings_share()
    if (EPS != None and EPS != 0):
        StatDict["EPS"] = EPS
    divYield = ticker.get_dividend_yield()
    if (divYield != None and divYield != 0):
        StatDict["Dividend Yield"] = divYield
    return StatDict


# print(getDataSet("^GSPC"))
# print(getStat("AAPL"))
# print(getDataSet("^DJI"))

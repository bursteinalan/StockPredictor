import urllib.request
from re import findall
    
def nameToTicker(name):
    ''' Read the webpage '''
    response = urllib.request.urlopen('http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=' + name + '&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback')
    html = response.read()
    text = html.decode()    
    symbol = findall('"symbol":"[A-Z]*', text)
    return symbol[0][10:]


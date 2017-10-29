import urllib.request
from re import findall

#Read the webpage:
    
def main(code):
    response = urllib.request.urlopen('http://d.yimg.com/autoc.finance.yahoo.com/autoc?query=' + code + '&region=1&lang=en&callback=YAHOO.Finance.SymbolSuggest.ssCallback')
    html = response.read()
    text = html.decode()    
    print(text)
    symbol = findall('"symbol":"[A-Z]*', text)
    
    return symbol[0][10:]
        
main('alphabet')
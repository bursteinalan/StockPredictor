from flask import Flask, render_template, request
from BackEnd import parser
import json
import os


template_dir = os.path.abspath('static')
cachedDir = "cachedData"
if (not os.path.isdir(cachedDir)):
    os.makedirs(cachedDir)
app = Flask(__name__, template_folder=template_dir)

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/getDataSet', methods=["POST"])
def getDataSetWrapper():
    ticker = request.form['stockTicker']
    fname = cachedDir+"/DataSet-" + ticker + ".txt"
    if os.path.isfile(fname):
        with open(fname, 'r') as json_file:  
            return json_file.read()
    with open(fname, 'w') as outfile: 
        data = parser.getDataSet(ticker)
        json.dump(data, outfile)
        return json.dumps(data)

@app.route("/marketData", methods=["POST"])
def getMarketData():
    fname =  cachedDir+"/marketData.txt"
    if os.path.isfile(fname):
        with open(fname, 'r') as json_file:  
            return json_file.read()
    with open(fname, 'w') as outfile: 
        data = [parser.getDataSet("^GSPC"), parser.getDataSet("^IXIC"), parser.getDataSet("^DJI")]
        json.dump(data, outfile)
        return json.dumps(data)

@app.route('/getStat', methods=["POST"])
def getStatWrapper():
    ticker = request.form['stockTicker']
    fname =  cachedDir+"/Stat-" + ticker + ".txt"
    if os.path.isfile(fname):
        with open(fname, 'r') as json_file:  
            return json_file.read()
    with open(fname, 'w') as outfile: 
        data = parser.getStat(ticker)
        json.dump(data, outfile)
        return json.dumps(data)
    return json.dumps()

if __name__ == "__main__":
    app.run()

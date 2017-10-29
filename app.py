from flask import Flask, render_template, request
from BackEnd import parser
import json
import os


template_dir = os.path.abspath('static')
app = Flask(__name__, template_folder=template_dir)

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/getDataSet', methods=["POST"])
def getDataSetWrapper():
    ticker = request.form['stockTicker']
    return json.dumps(parser.getDataSet(ticker))

@app.route("/marketData", methods=["POST"])
def getMarketData():
    return json.dumps([parser.getDataSet("^INX"), parser.getDataSet("^IXIC") ])
    
@app.route('/getStat', methods=["POST"])
def getStatWrapper():
    ticker = request.form['stockTicker']
    return json.dumps(parser.getStat(ticker))

if __name__ == "__main__":
    app.run()

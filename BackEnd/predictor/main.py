import pandas as pd
import numpy as np
import datetime as dt
from sklearn.preprocessing import MinMaxScaler

import torch 
import torch.nn as nn
import torchvision.datasets as dsets
import torchvision.transforms as transforms
from torch.autograd import Variable

# dates for stock prices
dates = []

# prices for corresponding to date
prices = []

startdate = dt.datetime(2016,1,28)

def pull_data(file):
    with open(file, 'r') as data_file:
        df = pd.read_csv(data_file)
        prices = df['Open']
        dates = []

        for date in df['Date']:
            dates.append((dt.datetime.strptime(date, '%m/%d/%Y') - startdate).days)

        dates = np.reshape(dates, (len(dates), 1))
        return [dates, prices]

complete_set = pull_data('GOOG.csv')

train_size = int(len(complete_set[0]) * 0.9)
test_size = len(complete_set[0]) - train_size
test, train = complete_set[:train_size], complete_set[train_size:]

def create_dataset(dataset, lb = 1):
    dX, dY = [], []
    for i in range(len(dataset) - lb - 1):
        a = dataset[i:(i+look_back), 0]
        dX.append(a)
        dY.append(dataset[i + lb, 0])
    return np.array(dX), np.array(dY)

# Hyper Parameters
hidden_size = 128
num_layers = 2
input_size = 444
num_classes = 50
batch_size = 100
num_epochs = 3
learning_rate = 0.01

# Data Loader (Input Pipeline)
train_loader = torch.utils.data.DataLoader(dataset=train,
                                           batch_size=batch_size, 
                                           shuffle=True)

test_loader = torch.utils.data.DataLoader(dataset=test,
                                          batch_size=batch_size, 
                                          shuffle=False)

# RNN Model (Many-to-One)
class RNN(nn.Module):
    def __init__(self, input_size, hidden_size, num_layers, num_classes):
        super(RNN, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, num_classes)
    
    def forward(self, x):
        # Set initial states 
        h0 = Variable(torch.zeros(self.num_layers, x.size(0), self.hidden_size)) 
        c0 = Variable(torch.zeros(self.num_layers, x.size(0), self.hidden_size))
        
        # Forward propagate RNN
        out, _ = self.lstm(x, (h0, c0))  
        
        # Decode hidden state of last time step
        out = self.fc(out[:, -1, :])  
        return out

rnn = RNN(input_size, hidden_size, num_layers, num_classes)


# Loss and Optimizer
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(rnn.parameters(), lr=learning_rate)
    
# Train the Model
for epoch in range(num_epochs):
    for i, (images, labels) in enumerate(train_loader):
        images = Variable(images.view(-1, sequence_length, input_size))
        labels = Variable(labels)
        
        # Forward + Backward + Optimize
        optimizer.zero_grad()
        outputs = rnn(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        if (i+1) % 100 == 0:
            print ('Epoch [%d/%d], Step [%d/%d], Loss: %.4f' 
                   %(epoch+1, num_epochs, i+1, len(train_dataset)//batch_size, loss.data[0]))

# Test the Model
correct = 0
total = 0
for images, labels in test_loader:
    images = Variable(images.view(-1, sequence_length, input_size))
    outputs = rnn(images)
    _, predicted = torch.max(outputs.data, 1)
    total += labels.size(0)
    correct += (predicted == labels).sum()

print('Test Accuracy of the model on the 10000 test images: %d %%' % (100 * correct / total)) 

# Save the Model
torch.save(rnn.state_dict(), 'rnn.pkl')

# coding: utf-8

# In[109]:


import pandas as pd
import os
import csv
import re 
import datetime as dt
from dateutil.parser import parse

file = open(r"G:\Shalini assignments\Trimester 2 2018\Project Delivery\human activity tracking\Test 2.dat") 
lines = file.readlines()

arrValue=[]
startTime="";
epochPeriod="";
startDate="";

i=0;
for line in lines:
    if i>=10:
        arrValue.extend(line.split())
    else:
        if(i==2):
            startTime=line;
        if(i==3):
            startDate=line;
        if(i==4):
            epochPeriod=line;
    i=i+1

startDateMatch=re.search('\d{1}/\d{2}/\d{4}', startDate)
startDate=startDateMatch.group(0)

startTimeMatch=re.search('\d{2}:\d{2}:\d{2}', startTime)
startTime=startTimeMatch.group(0)

epochPeriodMatch=re.search('\d{2}:\d{2}:\d{2}', epochPeriod)
epochPeriod=epochPeriodMatch.group(0)

# Concate date and time string
startDateTimeString=startDate+' '+startTime
format_str = '%d/%m/%Y %H:%M:%S'
datetime_obj = dt.datetime.strptime(startDateTimeString, format_str)
startDateTimeObj=datetime_obj

format_str = '%H:%M:%S'
datetime_obj1 = dt.datetime.strptime(epochPeriod, format_str)
epochPeriodObj=datetime_obj1

with open(r'G:\Shalini assignments\Trimester 2 2018\Project Delivery\human activity tracking\output.csv','w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    filewriter.writerow(['Activity', '2nd Axis','3rd Axis','Steps','Heart Rate','Lux','Incline','Date Time Stamp'])
    
    for i in range(0, len(arrValue), 6):
        activity=arrValue[i];
        secondAxis=arrValue[i+1]
        thirdAxis=arrValue[i+2]
        steps=arrValue[i+3]
        heartRate=''
        lux=arrValue[i+4]
        incline=arrValue[i+5]
        timeStamp=startDateTimeObj
        filewriter.writerow([activity,secondAxis,thirdAxis,steps,heartRate,lux,incline,timeStamp])
#         Increase the startDateTime object by 15 seconds
        startDateTimeObj=timeStamp+dt.timedelta(seconds=epochPeriodObj.second,minutes=epochPeriodObj.minute,hours=epochPeriodObj.hour)
      


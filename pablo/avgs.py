import pandas as pd
import datetime
from dateutil.relativedelta import relativedelta

spread1 = "Detect4_1-anon.csv"
spread2 = "Detect4_2-anon.csv"

#collect base dates
data = pd.read_csv(spread1)["MONTH"]
valids = []
for i in range(0, len(data) - 1):
    if data[i] == 0:
        valids.append(i)
data.iloc[0:0]

def age():
    data = pd.read_csv(spread1)["DOB"]
    years = 0
    number = 0
    date_pub = datetime.datetime(2020, 1, 21)
    for i in data:
        date_list = i.split("/")
        dob = datetime.datetime(int(date_list[2]), int(date_list[0]), int(date_list[1]))
        time_difference = relativedelta(date_pub, dob)
        years += time_difference.years
        number += 1
    return (years/number)

def base_avg(col_name):
    data = pd.read_csv(spread1)[col_name]
    avgs = 0
    number = 0
    for i in valids:
        avgs += data[i]
        number += 1
    return (avgs/number)

def avg(col_name):
    data = pd.read_csv(spread1)[col_name]
    avgs = 0
    number = 0
    for i in data:
        print(i)
        avgs += i
        number += 1
    return (avgs/number)

def count():
    data = pd.read_csv(spread1)["ID"]
    ids = set()
    for i in data:
        ids.add(i)
    return len(ids)

def count_trait(trait, code_1, code_2):
    data = pd.read_csv(spread1)
    ids = []
    one = 0
    two = 0
    for i in range(0, len(data) - 1):
        if data["ID"][i] not in ids:
            ids.append(data["ID"][i])
            if data[trait][i] == code_1:
                one += 1
            elif data[trait][i] == code_2:
                two += 1
    return([one, two])

def add(col_name):
    data = pd.read_csv(spread1)[col_name]
    total = 0
    for i in valids:
        total += data[i]
    return total

def add_2_3(col_name):
    data = pd.read_csv(spread1)[col_name]
    total = 0
    for i in range(0, len(data) - 1):
        if i not in valids:
            total += data[i]
    return total


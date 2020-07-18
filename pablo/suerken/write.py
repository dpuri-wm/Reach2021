import pandas as pd
import avgs

age = avgs.age()
height = avgs.base_avg("HEIGHT_IN") * 0.0254 # convert to m
weight = avgs.base_avg("WEIGHT_LB") * 0.4536 # convert to kg
total_people = avgs.count()
genders = avgs.count_trait("gender", 1, 2)
male = genders[0]
female = genders[1]
races = avgs.count_trait("RACE", 3, 5)
black = races[0]
white = races[1]
anthra = avgs.add("ANTHRACYCLINE")
trast = avgs.add("TRASTUZUMAB")
taxane = avgs.add("TAXANE")
cyclo = avgs.add("CYCLO")
other = avgs.add("OTHERCHEMO")

data = pd.DataFrame({"Variable Name" : ["Age", "Height", "Weight", "Total People", "Male", "Female", "White", "Black", "Anthracycline", "Trastuzumab", "Taxane", "Cyclo", "Other Chemo"],
                     "Value" : [age, height, weight, total_people, male, female, white, black, anthra, trast, taxane, cyclo, other]})

data.to_csv("table_1.csv", index = False)
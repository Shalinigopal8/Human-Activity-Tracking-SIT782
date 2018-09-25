import pandas as pd
import os
df = pd.read_csv("G:\Shalini assignments\Trimester 2 2018\Project Delivery\human activity tracking\output.csv")

g = df.groupby(["Activity","Date Time Stamp"])
for grouped_data, grouped_data_df in g:
    
    
    grp = grouped_data_df
    
    if not os.path.isfile("grouped_data.csv"):
        grp.to_csv("grouped_data.csv", index=False, header = "column_names")
    else:
        grp.to_csv("grouped_data.csv", index=False, mode = 'a', header = False)




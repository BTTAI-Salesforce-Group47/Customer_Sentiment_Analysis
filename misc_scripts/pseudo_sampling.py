import pandas as pd
import numpy as np

"""_summary_

    This is a mini script to create a sample of 1000 records from the feedback data 
    for pseudolabeling.

"""

df = pd.read_csv('./clean-data/feedback_data_cleaned.csv')

# Randomly sample 1000 records
# Setting random_state for reproducibility
sample_df = df.sample(n=1000, random_state=42)

# Get the remaining records (all records not in the sample)
unlabeled_df = df[~df.index.isin(sample_df.index)]

sample_df.to_csv('./clean-data/sample_feedback_data.csv', index=False)

unlabeled_df.to_csv('./clean-data/feedback_unlabeled.csv', index=False)

print(f"Created sample with {len(sample_df)} records")
print(f"Created unlabeled set with {len(unlabeled_df)} records")

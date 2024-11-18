import pandas as pd
import numpy as np

"""_summary_

    This script adds a label column initialized to 0 for all records in the feedback data.

"""

df = pd.read_csv('./clean-data/feedback_data_cleaned.csv')

# Add new column for labels, initialized to 0
df['p_sentiment'] = None

# Save the data
df.to_csv('./clean-data/labeled_feedback.csv', index=False)

print(
    f"Created labeled dataset with {len(df)} records, all initialized to null")

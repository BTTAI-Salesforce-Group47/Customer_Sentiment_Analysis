import pandas as pd

# Read the data
df = pd.read_csv('clean-data/labeled_feedback.csv')

# Add sentiment classification
'''
0-4: negative
5: neutral
6-10: positive
'''
df['sentiment_class'] = df['p_sentiment'].apply(
    lambda x: 'negative' if x <= 4 else ('neutral' if x == 5 else 'positive'))


df.to_csv('clean-data/labeled_feedback.csv', index=False)

print("Sentiment classification complete. Data saved to: clean-data/labeled_feedback.csv")

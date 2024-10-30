import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Using VADER
analyzer = SentimentIntensityAnalyzer()


def get_sentiment_score(text):
    score = analyzer.polarity_scores(text)
    return score['compound']  # VADER's compound score (overall sentiment)


def analyze_sentiment(input_file, output_file):
    # Loading preprocessed feedback data
    data = pd.read_csv(input_file)
    # Apply sentiment score calculation
    data['sentiment_score'] = data['feedback_prepped'].apply(
        get_sentiment_score)

    # classify  
    data['sentiment_label'] = data['sentiment_score'].apply(
        lambda x: 'positive' if x > 0.05 else ('negative' if x < -0.05 else 'neutral'))

    data.to_csv(output_file, index=False)
    print("Sentiment analysis complete. Data saved to:", output_file)

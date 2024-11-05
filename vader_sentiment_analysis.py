# %% impoorts
import pandas as pd
import os
import matplotlib.pyplot as plt
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# %% Initialize VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()
## note: this is simply rule-based, not machine learning

# %%  function to calculate sentiment score
def get_sentiment_score(text):
    if isinstance(text, str):
        score = analyzer.polarity_scores(text)
        return score['compound'] 
    else:
        return 0  

# %%  main sentiment analysis function
def analyze_sentiment(input_file, output_file):
    data = pd.read_csv(input_file)
    # Apply sentiment score calculation
    data['sentiment_score'] = data['feedback_prepped'].apply(get_sentiment_score)
    # Classify sentiment 
    data['sentiment_label'] = data['sentiment_score'].apply(
        lambda x: 'positive' if x > 0.05 else ('negative' if x < -0.05 else 'neutral'))
    # Save the processed data with sentiment scores and labels
    data.to_csv(output_file, index=False)
    print("Sentiment analysis complete. Data saved to:", output_file)
    return data 
# %%  function to visualize sentiment results
def visualize_sentiment(data, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    sentiment_counts = data['sentiment_label'].value_counts()
    
    # Plot sentiment distribution
    plt.figure(figsize=(8, 6))
    sentiment_counts.plot(kind='bar', color=['green', 'red', 'grey'])
    plt.title("Sentiment Distribution")
    plt.xlabel("Sentiment")
    plt.ylabel("Count")
    plt.xticks(rotation=0)
    
    # Save the visualization
    plot_path = os.path.join(output_dir, "sentiment_distribution.png")
    plt.savefig(plot_path)
    plt.close()
    print("Sentiment distribution visualization saved to:", plot_path)

# %% 
def main(input_file, output_file, visual_output_dir="visuals/vader"):

    data = analyze_sentiment(input_file, output_file)
    
    visualize_sentiment(data, visual_output_dir)

# %%
input_file = "clean-data/feedback_data_cleaned.csv"
output_file = "clean-data/feedback_vader_pip install vadersentiment.csv"
main(input_file, output_file)

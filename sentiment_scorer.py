import pandas as pd
import numpy as np
import joblib
from pathlib import Path
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

def load_models():
    """Load the trained modelswe saved in models/"""
    model = joblib.load('models/random_forest_model.joblib')
    vectorizer = joblib.load('models/tfidf_vectorizer.joblib')
    label_encoder = joblib.load('models/label_encoder.joblib')
    return model, vectorizer, label_encoder

def get_text_sentiment(text, model, vectorizer, label_encoder):
    """Calculate sentiment score based on text only"""
    # Transform text using TF-IDF
    text_features = vectorizer.transform([text])
    
    # Get probability scores for each class
    probabilities = model.predict_proba(text_features)[0]
    
    # Calculate weighted score (0-10 scale)
    # Assuming classes are ordered: Negative, Neutral, Positive
    score = (probabilities[0] * 0 + probabilities[1] * 5 + probabilities[2] * 10)
    return score

def combine_scores(text_score, rating, weight_text=0.7):
    """Combine text-based sentiment score with numerical rating with default weight of 0.7*text + 0.3*rating"""
    # Convert rating to 0-10 scale
    rating_normalized = (rating / 5) * 10
    
    # Weighted average of text score and rating
    combined_score = (text_score * weight_text) + (rating_normalized * (1 - weight_text))
    return combined_score

def score_to_sentiment(score):
    """Convert numerical score to sentiment category using the same mapping as TF_IDF_model.py"""
    if score < 4.5:
        return 'Negative'
    elif score < 6:
        return 'Neutral'
    else:
        return 'Positive'

def main():
    # Load the trained models
    print("Loading models...")
    model, vectorizer, label_encoder = load_models()
    
    # Load the feedback data
    print("Loading feedback data...")
    feedback_df = pd.read_csv('clean-data/feedback_data_with_company.csv')
    
    # Handle NaN values in Feedback column
    print("Handling missing values...")
    feedback_df['Feedback'] = feedback_df['Feedback'].fillna('')
    
    # Calculate text-only sentiment scores
    print("Calculating text-only sentiment scores...")
    feedback_df['text_sentiment'] = feedback_df['Feedback'].apply(
        lambda x: get_text_sentiment(x, model, vectorizer, label_encoder)
    )
    
    # Calculate combined scores (text + rating)
    print("Calculating combined sentiment scores...")
    feedback_df['combined_sentiment'] = feedback_df.apply(
        lambda row: combine_scores(row['text_sentiment'], row['Rating']),
        axis=1
    )
    
    # Convert scores to sentiment categories
    feedback_df['text_sentiment_class'] = feedback_df['text_sentiment'].apply(score_to_sentiment)
    feedback_df['combined_sentiment_class'] = feedback_df['combined_sentiment'].apply(score_to_sentiment)
    
    # Save the results
    output_path = 'clean-data/feedback_data_with_sentiment.csv'
    print(f"Saving results to {output_path}...")
    feedback_df.to_csv(output_path, index=False)
    print("Done!")
    
    # Save examples where text and combined sentiments differ
    print("\nFinding examples of sentiment differences...")
    different_sentiments = feedback_df[feedback_df['text_sentiment_class'] != feedback_df['combined_sentiment_class']]
    if len(different_sentiments) > 0:
        examples = different_sentiments.sample(min(10, len(different_sentiments)))
        examples = examples[['Feedback', 'Rating', 'text_sentiment', 'text_sentiment_class', 
                           'combined_sentiment', 'combined_sentiment_class']]
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        examples_file = f"visuals/sentiment_differences_{timestamp}.txt"
        with open(examples_file, 'w', encoding='utf-8') as f:
            f.write("Examples where Text Sentiment differs from Combined Sentiment\n")
            f.write("=====================================================\n\n")
            for idx, row in examples.iterrows():
                f.write(f"Example {idx + 1}:\n")
                f.write(f"Feedback: {row['Feedback']}\n")
                f.write(f"Rating: {row['Rating']}\n")
                f.write(f"Text-only sentiment: {row['text_sentiment_class']} (score: {row['text_sentiment']:.2f})\n")
                f.write(f"Combined sentiment: {row['combined_sentiment_class']} (score: {row['combined_sentiment']:.2f})\n")
                f.write("-" * 80 + "\n\n")
        print(f"Saved {len(examples)} example differences to {examples_file}")
    
    # Print some statistics
    print("\nSentiment Class Distribution:")
    print("\nText-only sentiment classes:")
    print(feedback_df['text_sentiment_class'].value_counts())
    print("\nCombined sentiment classes:")
    print(feedback_df['combined_sentiment_class'].value_counts())
    
    # Save statistics to file
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    stats_file = f"visuals/sentiment_stats_{timestamp}.txt"
    with open(stats_file, 'w') as f:
        f.write("Sentiment Class Distribution\n")
        f.write("==========================\n\n")
        f.write("Text-only Sentiment Classes:\n")
        f.write(feedback_df['text_sentiment_class'].value_counts().to_string())
        f.write("\n\nCombined Sentiment Classes:\n")
        f.write(feedback_df['combined_sentiment_class'].value_counts().to_string())
    
    # Create visualizations
    plt.style.use('seaborn')
    
    # Bar plot of text sentiment classes
    plt.figure(figsize=(10, 6))
    sns.countplot(data=feedback_df, x='text_sentiment_class', order=['Negative', 'Neutral', 'Positive'])
    plt.title('Distribution of Text-only Sentiment Classes')
    plt.xlabel('Sentiment Class')
    plt.ylabel('Count')
    plt.tight_layout()
    plt.savefig(f'visuals/text_sentiment_dist_{timestamp}.png')
    plt.close()
    
    # Bar plot of combined sentiment classes
    plt.figure(figsize=(10, 6))
    sns.countplot(data=feedback_df, x='combined_sentiment_class', order=['Negative', 'Neutral', 'Positive'])
    plt.title('Distribution of Combined Sentiment Classes')
    plt.xlabel('Sentiment Class')
    plt.ylabel('Count')
    plt.tight_layout()
    plt.savefig(f'visuals/combined_sentiment_dist_{timestamp}.png')
    plt.close()
    
    # Comparison plot
    plt.figure(figsize=(12, 6))
    sentiment_counts = pd.DataFrame({
        'Text-only': feedback_df['text_sentiment_class'].value_counts(),
        'Combined': feedback_df['combined_sentiment_class'].value_counts()
    }).reindex(['Negative', 'Neutral', 'Positive'])
    sentiment_counts.plot(kind='bar', width=0.8)
    plt.title('Comparison of Sentiment Distributions')
    plt.xlabel('Sentiment Class')
    plt.ylabel('Count')
    plt.legend(title='Score Type')
    plt.tight_layout()
    plt.savefig(f'visuals/sentiment_comparison_{timestamp}.png')
    plt.close()

if __name__ == "__main__":
    main()
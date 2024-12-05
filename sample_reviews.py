import pandas as pd
import numpy as np
from pathlib import Path

# Set up paths
current_dir = Path(__file__).parent
input_file = current_dir / 'clean-data' / 'feedback_data_with_sentiment.csv'
output_dir = current_dir / 'visuals'
output_file = output_dir / 'sample_reviews.csv'

# Ensure output directory exists
output_dir.mkdir(parents=True, exist_ok=True)

try:
    # Read the feedback data
    print(f"Reading data from {input_file}")
    df = pd.read_csv(input_file)
    
    print("\nInitial data shape:", df.shape)
    print("\nColumns in the DataFrame:")
    print(df.columns.tolist())
    
    # Print unique values in sentiment columns to verify
    for col in df.columns:
        if 'sentiment' in col.lower():
            print(f"\nUnique values in {col}:")
            print(df[col].value_counts())
    
    # Sample reviews from each sentiment class using text_sentiment_class
    sampled_reviews = []
    for sentiment in ['Positive', 'Neutral', 'Negative']:  # Note: Changed to capitalize first letter
        sentiment_df = df[df['text_sentiment_class'] == sentiment]  # Changed to text_sentiment_class
        n_available = len(sentiment_df)
        n_sample = min(5, n_available)
        
        if n_available == 0:
            print(f"\nWarning: No reviews found for {sentiment} sentiment")
            continue
            
        print(f"\nSampling {n_sample} out of {n_available} {sentiment} reviews")
        sentiment_reviews = sentiment_df.sample(n=n_sample, random_state=42)
        sampled_reviews.append(sentiment_reviews)

    if not sampled_reviews:
        raise ValueError("No reviews were sampled for any sentiment class")

    # Combine all sampled reviews
    final_sample = pd.concat(sampled_reviews)
    
    # Sort by sentiment class for better readability
    final_sample = final_sample.sort_values('text_sentiment_class')
    
    # Select relevant columns
    columns_to_keep = [
        'Feedback',
        'Rating',
        'text_sentiment',
        'combined_sentiment',
        'text_sentiment_class',
        'combined_sentiment_class'
    ]
    
    final_sample = final_sample[columns_to_keep]
    
    # Save to CSV
    print(f"\nSaving {len(final_sample)} reviews to {output_file}")
    final_sample.to_csv(output_file, index=False)
    
    print("\nFinal sample distribution:")
    print(final_sample['text_sentiment_class'].value_counts())
    
except FileNotFoundError:
    print(f"Error: Could not find input file at {input_file}")
    print("Make sure you're running the script from the correct directory")
except Exception as e:
    print(f"Error: {str(e)}")
    print("Please check the data format and try again")

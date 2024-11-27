import pandas as pd


reviews_df = pd.read_csv('../External_Datasets/reviews.csv')

# Total number of reviews
print(f"Original number of reviews: {len(reviews_df)}")
 
reviews_clean = reviews_df.drop_duplicates(subset=['Review'])

# Check changes
print(f"Number of reviews after removing duplicates: {len(reviews_clean)}")
print(f"Number of duplicates removed: {len(reviews_df) - len(reviews_clean)}")

# Save  clean reviews
reviews_clean.to_csv('../External_Datasets/reviews-clean.csv', index=False)
print("Clean dataset saved to: External_Datasets/reviews-clean.csv")

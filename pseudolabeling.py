import pandas as pd
import os

# TODO: Create and load  the sample feedback data
csv_file = 'clean-data/sample_feedback_data.csv'

# Check if the file exists
if os.path.exists(csv_file):
    df = pd.read_csv(csv_file)
else:
    print(f"File '{csv_file}' not found.")
    exit()

# make sure 'p_sentiment' column exists
if 'p_sentiment' not in df.columns:
    df['p_sentiment'] = None  # Create an empty p_sentiment column for first run

# Define allowed labels (integer  range 1-10)
allowed_labels = range(1, 11)

# Iterate over unlabeled reviews for labeling
unlabeled_df = df[df['p_sentiment'].isnull()]

total_reviews = len(df)
labeled_reviews = total_reviews - len(unlabeled_df)
start_index = labeled_reviews

for index, row in unlabeled_df.iterrows():
    current_review_number = index + 1
    print(f"\nReview {current_review_number}/{total_reviews}:")
    print(row['lem_feedback'])  # Lemmatized feedback column in clean data

    # Input validation loop
    while True:
        label = input(
            f"Enter sentiment score (1-10), 'skip' to skip, or 'exit' to quit: ").strip()

        if label.lower() in ['exit', 'quit']:
            print("Exiting labeling process.")
            # Save progress before exiting
            df.to_csv(csv_file, index=False)
            print("Progress saved.")
            exit()
        elif label.lower() == 'skip':
            print("Review skipped.")
            break

        try:
            label_num = int(label)
            if label_num in allowed_labels:
                df.at[index, 'p_sentiment'] = label_num
                print(f"Sentiment '{label_num}' saved.")
                labeled_reviews += 1
                print(
                    f"Progress: {labeled_reviews} out of {total_reviews} reviews labeled.")
                break
            else:
                print("Invalid input. Please enter a number between 1 and 10.")
        except ValueError:
            print(
                "Invalid input. Please enter a number between 1 and 10, 'skip', or 'exit'.")

    # Save the updated DataFrame after each label
    df.to_csv(csv_file, index=False)

# Notify when labeling is complete (only if all reviews have been labeled)
print("Pseudo-labeling process completed successfully!")

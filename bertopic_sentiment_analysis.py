# %% Import necessary libraries
import pandas as pd
from bertopic import BERTopic
from sklearn.feature_extraction.text import CountVectorizer
import os

# %% Load the dataset
def load_data(filepath):
    data = pd.read_csv(filepath)
    # Display the first few rows for verification
    print(data.head())
    return data

# Specify the input file path
input_file = "clean-data/feedback_data_cleaned.csv"
data = load_data(input_file)

# %% Preprocess the text data (if needed)
# Assuming that the column of interest is 'feedback_prepped' and contains clean feedback text
# If not, replace 'feedback_prepped' with the appropriate column name
feedback_texts = data['feedback_prepped'].fillna('')  # Replace NaNs with empty strings

# %% Initialize BERTopic model with a custom CountVectorizer for better topic modeling
vectorizer_model = CountVectorizer(ngram_range=(1, 2), stop_words="english")
topic_model = BERTopic(vectorizer_model=vectorizer_model, language="english")

# %% Fit the BERTopic model on the feedback text
topics, probabilities = topic_model.fit_transform(feedback_texts)

# %% Add topics to the original dataframe for further analysis
data['topic'] = topics
data['topic_probability'] = probabilities

# Save the results with topics to a new CSV
output_file = "clean-data/feedback_data_with_topics.csv"
data.to_csv(output_file, index=False)
print("Topic modeling complete. Data with topics saved to:", output_file)

# %% Visualize the topics and save the visualization
def save_visualizations(model, output_dir="visuals/bertopic"):
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # Topic frequency bar chart
    fig1 = model.visualize_barchart(top_n_topics=10)
    fig1.write_html(os.path.join(output_dir, "topic_frequency_barchart.html"))
    
    # Topic similarity heatmap
    fig2 = model.visualize_heatmap()
    fig2.write_html(os.path.join(output_dir, "topic_similarity_heatmap.html"))

    # Topic word clouds for each topic
    fig3 = model.visualize_topics()
    fig3.write_html(os.path.join(output_dir, "topic_word_clouds.html"))

    print("Visualizations saved to:", output_dir)

# %% Run and save visualizations
save_visualizations(topic_model)

# %% Example usage (Run the whole script by executing this block)
if __name__ == "__main__":
    data = load_data(input_file)
    feedback_texts = data['feedback_prepped'].fillna('')
    topics, probabilities = topic_model.fit_transform(feedback_texts)
    data['topic'] = topics
    data['topic_probability'] = probabilities
    data.to_csv(output_file, index=False)
    save_visualizations(topic_model)

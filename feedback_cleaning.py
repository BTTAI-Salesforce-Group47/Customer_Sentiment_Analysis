# %%
import pandas as pd
import nltk
from nltk.corpus import words
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('words')  # list of common english words
nltk.download('wordnet')  # large thesaurus with word relationships
nltk.download('punkt')  # required for tokenization
nltk.download('stopwords')  # list of words like "the" and "a"

# %%
feedback_data = pd.read_csv("Datasets/feedbackData.csv", sep="\t")

print(feedback_data.head())


# %%
# Remove rows with missing reviews or ratings
feedback_data = feedback_data.dropna(subset=['Feedback', 'Rating'])

# %%
print(feedback_data['Feedback'].dtype)

feedback_data['Feedback'] = feedback_data['Feedback'].astype(str)

print(feedback_data['Feedback'].dtype)


# %%
# remove rows with gibberish feedback
english_words = set(words.words())


def contains_english_word(text):
    text_words = set(text.lower().split())
    return bool(english_words.intersection(text_words))


filtered_data = feedback_data[feedback_data['Feedback'].apply(
    contains_english_word)]

print(filtered_data.head())

# %%
# Lemmatizing to get words base form in new column

lemmatizer = WordNetLemmatizer()


def lemmatize_text(text):
    tokens = nltk.word_tokenize(text)  # tokenizing
    lemmas = [lemmatizer.lemmatize(token).lower() for token in tokens]
    return " ".join(lemmas)


filtered_data['lem_feedback'] = filtered_data['Feedback'].apply(lemmatize_text)

print(filtered_data.head())


# %%
filtered_data.to_csv('clean-data/feedback_data_cleaned.csv', index=False)
print('Cleaning successful')

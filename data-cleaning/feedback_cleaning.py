# %%
import pandas as pd
import nltk
from nltk.corpus import words
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('words')  # list of common english words
nltk.download('wordnet')  # large thesaurus with word relationships
nltk.download('punkt')  # required for tokenization
nltk.download('punkt_tab')
nltk.download('stopwords')  # list of words like "the" and "a"

# %%
# Load initial data
feedback_data = pd.read_csv(
    "C:/Users/LAWSON_l/Documents/GitHub/Customer_Sentiment_Analysis/Datasets/feedbackData.csv", sep="\t")
initial_count = len(feedback_data)
print(f"\nInitial number of records: {initial_count}")

# Track missing values
missing_feedback = feedback_data['Feedback'].isna().sum()
string_nan = (feedback_data['Feedback'].str.lower() == 'nan').sum()
missing_ratings = feedback_data['Rating'].isna().sum()

print("\nMissing values removed:")
print(f"- Feedback NaN values: {missing_feedback}")
print(f"- Feedback 'nan' strings: {string_nan}")
print(f"- Missing ratings: {missing_ratings}")

# Remove missing values
feedback_data = feedback_data[~feedback_data['Feedback'].isna()]
feedback_data = feedback_data[~(
    feedback_data['Feedback'].str.lower() == 'nan')]
feedback_data = feedback_data[~feedback_data['Rating'].isna()]

# Track duplicates
duplicate_count = feedback_data.duplicated(subset=['Feedback']).sum()
print(f"\nDuplicate feedback entries removed: {duplicate_count}")

# Remove duplicates
feedback_data = feedback_data.drop_duplicates(subset=['Feedback'])

print(f"\nRecords after initial cleaning: {len(feedback_data)}")

# %%
print(feedback_data['Feedback'].dtype)
feedback_data['Feedback'] = feedback_data['Feedback'].astype(str).str.strip()
print(feedback_data['Feedback'].dtype)

# %%
# Track non-English or gibberish entries
english_words = set(words.words())


def contains_english_word(text):
    text_words = set(text.lower().split())
    return bool(english_words.intersection(text_words))


non_english_count = sum(
    ~feedback_data['Feedback'].apply(contains_english_word))
print(f"\nNon-English entries removed: {non_english_count}")

filtered_data = feedback_data[feedback_data['Feedback'].apply(
    contains_english_word)]

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
# Removing stopwords to only have core words

filtered_data['feedback_prepped'] = filtered_data['lem_feedback']

# %%
# Final cleaning checks
final_nan_count = filtered_data.isna().sum().sum()
final_empty_strings = sum(
    filtered_data['lem_feedback'].str.strip().str.len() == 0)

print("\nFinal cleaning removed:")
print(f"- NaN values: {final_nan_count}")
print(f"- Empty strings after preprocessing: {final_empty_strings}")

# Remove final problematic entries
filtered_data = filtered_data.dropna()
filtered_data = filtered_data[~(
    filtered_data['lem_feedback'].str.lower() == 'nan')]

print(f"\nFinal number of clean records: {len(filtered_data)}")
print(f"Total records removed: {initial_count - len(filtered_data)}")
print(
    f"Percentage of data retained: {(len(filtered_data)/initial_count)*100:.2f}%")

filtered_data.to_csv('clean-data/feedback_data_cleaned.csv', index=False)
print('\nCleaning successful')

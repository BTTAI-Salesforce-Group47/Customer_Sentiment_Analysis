# Customer_Sentiment_Analysis

This project analyzes customer feedback and company data to achieve three main goals:

1.
2.
3.

## Our Process

## Key Files

### Pseudolabeling
- `pseudolabeling.py`: CLI interface to allow for manual labeling of sample feedback data
- `pseudo_smapling.py` (misc_scripts): Generates sample of feedback data.


### Data Cleaning and Prep

- `feedback_cleaning.ipynb` / `feedback_cleaning.py`: Takes raw feedback data and:
  - Filters out non-English text
  - Lemmatizes words (converts to base form)
  - Removes stopwords
  - Creates clean dataset for analysis

### Sentiment Analysis

- `vader_sentiment_analysis.py`: Uses VADER (lexicon-based system trained on social media text) to:
  - Calculate basic sentiment scores for each feedback
  - Generate visualizations of sentiment distribution
  - Save results to CSV file

### Topic Modeling

- `BERTopic_Model.ipynb`: Applies BERTopic to:
  - Find main topics in the feedback
  - Group similar feedbacks together
  - Create topic visualisations
  - Show most common words per topic

### Company Details

- `companydetails.ipynb`: Handles company information like:
  - Employee count
  - Regions served
  - Other company specific data

## Key Insights and decisions

## Required Packages

- pandas
- nltk
- vadersentiment
- bertopic
- numpy

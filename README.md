# Customer_Sentiment_Analysis

This project analyzes Company B's customer feedback and Company A's lead data to identify high-value conversion opportunities and optimize outreach timing. The analysis combines sentiment analysis, topic modeling, and predictive analytics to provide actionable insights for Company A's marketing and sales teams.

## Project Goals

1. Analyze Company B's customer sentiment to identify potential conversion opportunities
2. Predict lead conversion probability using integrated feedback and CRM data
3. Determine optimal outreach timing based on product availability metrics
4. Provide actionable insights for Company A's marketing and sales teams

## Data Integration and Processing

### Database Setup and Management
- `POSTGRES DB-LeadPrediction_outreach.sql`: Core database setup and queries
  - Integrates Company B's customer reviews
  - Stores Company B's product availability metrics
  - Contains Company A's CRM lead data
  - Implements SQL-based data streaming for analysis

### Data Preparation
- `data-cleaning/`: Scripts for data preprocessing and integration
- `clean-data/`: Processed datasets ready for analysis
- `MergeFeedbackLeads.ipynb`: Combines and aligns Company B's feedback with Company A's lead data

## Analysis Components

### Sentiment Analysis Pipeline
- `vader_sentiment_analysis.py`: Initial sentiment scoring using VADER
- `TF_IDF_classification_model.py`: ML-based sentiment classification
- `TF_IDF_regression_model.py`: Numerical sentiment prediction
- `BERT_model_fine_tuned.py`: Advanced sentiment analysis using BERT
  - Focuses on customers present in both feedback and leads data
  - Generates sentiment scores for lead prioritization

### Lead Conversion Analysis
- `leadConversion.ipynb`: 
  - Analyzes patterns in successful lead conversions
  - Integrates sentiment data with lead information
  - Identifies high-probability conversion opportunities

### Outreach Timing Optimization
- `timeseries.ipynb`: Time series analysis for optimal outreach timing
  - Downtime Variability: The availability data shows significant fluctuations in service downtime
  - The Prophet model allows for predicting future downtime patterns by considering historical data, customer impact, and downtime severity, enabling proactive planning for customer outreach.
  - Considers customer sentiment trends

### Topic Analysis
- `BERTopic_Model.ipynb`: Advanced topic modeling
  - Identifies key themes in customer feedback
  - Groups similar feedback for targeted outreach
  - Provides insights for marketing strategy

## Technical Implementation

### Database Integration
All analysis components fetch data directly from PostgreSQL using SQL queries, ensuring:
- Real-time data access
- Consistent data state
- Efficient data processing
- Secure data handling

### Required Packages
- Database: `psycopg2`, `sqlalchemy`
- Data Processing: `pandas`, `numpy`
- NLP: `nltk`, `scikit-learn`, `transformers`
- Sentiment Analysis: `vaderSentiment`, `bertopic`
- Visualization: `matplotlib`, `seaborn`
- Machine Learning: `scikit-learn`, `torch`
- Time Series: `prophet`

## Results and Deliverables

### Analysis Outputs
Located in `results/` and `visuals/` directories:
- Sentiment distribution analysis
- Lead conversion probability scores
- Optimal outreach timing recommendations
- Topic modeling insights
- Model performance metrics

### Documentation
- Detailed methodology in notebooks
- Model documentation in `logs/`
- SQL query documentation in database files
 

## Key Insights

The analysis pipeline provides:
- Prioritized lead lists based on sentiment and conversion probability
- Optimal outreach timing recommendations
- Topic-based customer segmentation
- Actionable insights for marketing and sales strategies

For detailed findings and recommendations, see the full report in `results/final_report.pdf`.


## appendix

### Sources
`reviews.csv` - product reviews from kaggle dataset -  https://www.kaggle.com/datasets/prishasawhney/product-reviews/data
`rotten-tomatoes_reviews.csv` - movie reviews from rotten tomatoes - https://www.kaggle.com/datasets/stefanoleone992/rotten-tomatoes-movies-and-critic-reviews-dataset

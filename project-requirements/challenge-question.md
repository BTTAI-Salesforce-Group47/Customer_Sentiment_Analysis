Product Availability Metric: AvailabilityData.txt
○ Columns:
■ Date: The date and time of the recorded metric.
■ Availability DownTime Duration in hours: The total duration
of downtime (in hours).
■ Count of Customers Affected: Number of customers affected by
the downtime.
■ Regions Affected: Name of regions affected by the downtime.
3. Company A Leads Data from CRM: LeadsData.txt, CompanyDetails.txt
○ This dataset is assumed to include lead information that may overlap with
customers who have left feedback for Company B. The LeadsData has
information of lead status and company name with email Id.
○ Also the CompanyDetails has the information on regions where this company is
serving and the employee base who are using this product.

Objectives:
1. Sentiment Analysis and Lead Prioritization:
○ Perform sentiment analysis on the textual feedback from Company B’s data.
There are two objectives:
i. to assess the sentiment of customers who are also present in Company
A's leads data.
ii. Overall sentiment of the customer for this type of product so that it will
help in future investment.

○ Based on the sentiment analysis and rating, determine the likelihood of
conversion for each lead in Company A's CRM Leads Data. Identify leads with a
high probability of conversion.
2. Predictive Analytics on Outreach Timing:
○ Use the availability metric data to build a predictive model that suggests the
optimal timing for Company A to reach out to high-probability leads. The model

should consider product availability, downtime, and the impact on customers to
predict the best time for outreach, maximizing the likelihood of engagement and
conversion.
Guidance for Approach:
● Data Preparation:
Ensure data from all sources is clean and appropriately formatted. Handle missing
values, and consider time alignment between datasets. Create a schema to find out
relationships. The data is present in a SQLite DB, stream the data using SQL to analyze
the data.
● Sentiment Analysis:
Use natural language processing (NLP) techniques to extract sentiment from textual
feedback. This can involve pre-trained models or custom-built classifiers.
● Lead Conversion Prediction:
Explore machine learning techniques like logistic regression, decision trees, or more
advanced methods to predict conversion likelihood based on sentiment scores and other
features derived from the datasets.
● Outreach Timing Prediction:
Analyze the availability metric data to identify patterns in downtime and customer impact.
Use time series analysis or other predictive modeling techniques to suggest optimal
outreach times.
Data should always reside in the DB and the model should fetch the data using SQLs.. It should
not be extracted from the DB to csv files.
Deliverables:
1. A detailed report outlining the methodology, data analysis, model development, and
findings.
2. A presentation summarizing key insights and recommendations for Company A’s
marketing and sales teams.
3. Source code and documentation for the developed models and analysis.

Regarding the Dataset:
The datasets are in a postgres format. In order to use it please import it into your local or hosted
postgresql DB using the following command
```psql <DB Name> LeadPrediction_outreach.sql```
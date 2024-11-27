## Checklist for Challenge Question

### Context Understanding
- Review the context of Company A and Company B's competitive landscape.
- Understand the datasets provided:
  - Company B Customer Reviews and Feedback
  - Company B Product Availability Metric
  - Company A Leads Data from CRM

### Data Preparation
- Import datasets into a PostgreSQL database using the command:
  - `psql <DB Name> LeadPrediction_outreach.sql`
- Clean and format data from all sources.
- Handle missing values and ensure time alignment between datasets.
- Create a schema to identify relationships between datasets.
- Stream data using SQL for analysis.

### Sentiment Analysis and Lead Prioritization
- Perform sentiment analysis on Company B’s textual feedback.
  - Assess sentiment for customers also present in Company A's leads data.
  - Determine overall sentiment for future investment insights.
- Analyze sentiment and ratings to predict lead conversion likelihood.
- Identify high-probability conversion leads in Company A's CRM.

### Predictive Analytics on Outreach Timing
- Analyze availability metric data for patterns in downtime and customer impact.
- Build a predictive model to suggest optimal outreach timing.
  - Consider product availability, downtime, and customer impact.
- Use time series analysis or other predictive modeling techniques.

### Model Development
- Use NLP techniques for sentiment extraction.
  - Consider pre-trained models or custom-built classifiers.
- Explore machine learning techniques for lead conversion prediction.
  - Consider logistic regression, decision trees, or advanced methods.
- Ensure models fetch data using SQL without extracting to CSV files.*** KEY

### Deliverables
- Prepare a detailed report on methodology, data analysis, model development, and findings.
- Create a presentation summarizing key insights and recommendations for Company A’s marketing and sales teams.
- Provide source code and documentation for developed models and analysis.

### Additional Considerations
- Ensure data resides in the database and is accessed via SQL.
- Maintain documentation for all processes and methodologies used.

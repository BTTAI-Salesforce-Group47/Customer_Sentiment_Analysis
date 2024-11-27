## Checklist

### 2. Complete the Classification Models
- **Prepare the Data:**
  - Convert Riddhi’s numeric sentiment scores into sentiment classes:
    - Scores ≤ 4 → Negative
    - Score = 5 → Neutral
    - Scores ≥ 6 → Positive
- **Build Models:**
  - Implement the tf-idf + RandomForest classifier
  - Implement the BERT-based classification model
- **Evaluation and Tweaks:**
  - Compare the performance of the models using the classification metrics provided
  - Focus on correctly classifying neutral sentiments
- **Train and Save Models:**
  - Train both models
  - Generate visualizations of the results

### 3. Time Series Model Planning
- Upload the project requirements docs to GitHub for team access
- Refer to Swathi and Subrata’s recommendations
- Determine what is needed for time series modeling:
  - Identify the two metrics to predict
  - Plan the implementation approach

### 4. Build the Web App  
- Develop a frontend UI to present:
  - Sentiment classification results
  - Time series predictions
- **Decisions:**
  - Create a separate repository for the web app
  - Include a "Coming Up" section for potential interactive features
  - Download the web app prototype for team review

### 5. Prepare Presentation Slides
- Use Canva to redesign draft slides
- Include all components of the machine learning process:
  - Business understanding
  - Data handling
  - Model building
  - Testing
  - Iteration
- Ensure the slides are visually appealing and polished
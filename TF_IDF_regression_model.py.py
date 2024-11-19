# %%
 
# !pip install scikit-learn bertopic imbalanced-learn pandas numpy

# %%
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import (mean_squared_error, r2_score, mean_absolute_error, 
                           accuracy_score, f1_score, roc_auc_score)
from scipy.sparse import hstack
from scipy import sparse
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from sklearn.metrics import confusion_matrix

# %%
# Load data
data = pd.read_csv('clean-data/labeled_feedback.csv')

# %%
# turn text into numbers using tf-idf  
tfidf_vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
tfidf_features = tfidf_vectorizer.fit_transform(data['feedback_prepped'])

# %%
# Scaling Ratings (i.e. normalize them)
scaler = StandardScaler()
ratings = data['Rating'].values.reshape(-1, 1)
scaled_ratings = scaler.fit_transform(ratings)
scaled_ratings_df = pd.DataFrame(scaled_ratings, columns=['scaled_rating'])

# %%
# concatenate Features
scaled_ratings_sparse = sparse.csr_matrix(scaled_ratings_df.values)
features = hstack([tfidf_features, scaled_ratings_sparse])

# %%
# use p_sentiment directly as the target variable
labels = data['p_sentiment'].values

# %%
# save the text and ratings before splitting
text_data = data['feedback_prepped'].values
rating_data = data['Rating'].values

# %%
# Text-only Model
print("\n=== Text-only Model ===")

# split data for text-only model
X_train_text, X_test_text, y_train, y_test, text_train, text_test = train_test_split(
    tfidf_features, labels, text_data, test_size=0.2, random_state=42
)

# train text-only model
text_only_model = RandomForestRegressor(n_estimators=100, random_state=42)
text_only_model.fit(X_train_text, y_train)

# predict using only text
y_pred_text = text_only_model.predict(X_test_text)

# evaluate text-only model
print("\nText-only Model Metrics:")
print(f'MSE: {mean_squared_error(y_test, y_pred_text):.4f}')
print(f'RMSE: {np.sqrt(mean_squared_error(y_test, y_pred_text)):.4f}')
print(f'MAE: {mean_absolute_error(y_test, y_pred_text):.4f}')
print(f'R²: {r2_score(y_test, y_pred_text):.4f}')

#  Combined Model (Text + Rating)
print("\n=== Combined Model (Text + Rating) ===")

# prepare combined features
scaled_ratings_sparse = sparse.csr_matrix(scaled_ratings_df.values)
combined_features = hstack([tfidf_features, scaled_ratings_sparse])

# split data for combined model
X_train_combined, X_test_combined, y_train, y_test, text_train, text_test, rating_train, rating_test = train_test_split(
    combined_features, labels, text_data, rating_data, test_size=0.2, random_state=42
)

# train combined model
combined_model = RandomForestRegressor(n_estimators=100, random_state=42)
combined_model.fit(X_train_combined, y_train)

# predict using combined features
y_pred_combined = combined_model.predict(X_test_combined)

# evaluate combined model
print("\nCombined Model Metrics:")
print(f'MSE: {mean_squared_error(y_test, y_pred_combined):.4f}')
print(f'RMSE: {np.sqrt(mean_squared_error(y_test, y_pred_combined)):.4f}')
print(f'MAE: {mean_absolute_error(y_test, y_pred_combined):.4f}')
print(f'R²: {r2_score(y_test, y_pred_combined):.4f}')

# %%
#  TODO: take a peek at feature importance

# Create visuals directory if it doesn't exist
Path("visuals/models/tf-idf_reg").mkdir(parents=True, exist_ok=True)

# 1. Distribution Plot - Compare both models
plt.figure(figsize=(12, 6))
plt.hist(y_test, bins=20, alpha=0.5, label='Actual', color='blue')
plt.hist(y_pred_text, bins=20, alpha=0.5, label='Text-Only Predictions', color='red')
plt.hist(y_pred_combined, bins=20, alpha=0.5, label='Combined Predictions', color='green')
plt.title('Distribution of Sentiment Scores')
plt.xlabel('Sentiment Score')
plt.ylabel('Frequency')
plt.legend()
plt.savefig('visuals/models/tf-idf_reg/tf-idf_reg_distribution_comparison.png')
plt.close()

# 2. Scatter Plots - Side by side comparison
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

# Text-only scatter
ax1.scatter(y_test, y_pred_text, alpha=0.5)
ax1.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], 'r--')
ax1.set_title('Text-Only Predictions')
ax1.set_xlabel('Actual Score')
ax1.set_ylabel('Predicted Score')

# Combined scatter
ax2.scatter(y_test, y_pred_combined, alpha=0.5)
ax2.plot([min(y_test), max(y_test)], [min(y_test), max(y_test)], 'r--')
ax2.set_title('Combined Predictions')
ax2.set_xlabel('Actual Score')
ax2.set_ylabel('Predicted Score')

plt.tight_layout()
plt.savefig('visuals/models/tf-idf_reg/tf-idf_reg_scatter_comparison.png')
plt.close()

# 3. Residuals Comparison
residuals_text = y_pred_text - y_test
residuals_combined = y_pred_combined - y_test

plt.figure(figsize=(12, 6))
plt.hist(residuals_text, bins=30, alpha=0.5, label='Text-Only', color='red')
plt.hist(residuals_combined, bins=30, alpha=0.5, label='Combined', color='green')
plt.title('Distribution of Prediction Errors')
plt.xlabel('Prediction Error')
plt.ylabel('Frequency')
plt.legend()
plt.savefig('visuals/models/tf-idf_reg/tf-idf_reg_error_comparison.png')
plt.close()

# 4. Metrics Comparison Plot
metrics_comparison = {
    'Text-Only RMSE': np.sqrt(mean_squared_error(y_test, y_pred_text)),
    'Combined RMSE': np.sqrt(mean_squared_error(y_test, y_pred_combined)),
    'Text-Only MAE': mean_absolute_error(y_test, y_pred_text),
    'Combined MAE': mean_absolute_error(y_test, y_pred_combined),
    'Text-Only R²': r2_score(y_test, y_pred_text),
    'Combined R²': r2_score(y_test, y_pred_combined)
}

plt.figure(figsize=(12, 6))
bars = plt.bar(metrics_comparison.keys(), metrics_comparison.values())
plt.title('Model Performance Comparison')
plt.xticks(rotation=45)
plt.ylim(0, max(metrics_comparison.values()) * 1.1)  # Give 10% headroom

#   value labels on top of bars
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height:.3f}',
             ha='center', va='bottom')

plt.tight_layout()
plt.savefig('visuals/models/tf-idf_reg/tf-idf_reg_metrics_comparison.png')
plt.close()

# Save metrics to text file
with open('visuals/models/tf-idf_reg/tf-idf_reg_metrics_comparison.txt', 'w') as f:
    f.write("Model Performance Comparison:\n\n")
    f.write("Text-Only Model:\n")
    f.write(f"Mean Squared Error: {mean_squared_error(y_test, y_pred_text):.4f}\n")
    f.write(f"Root Mean Squared Error: {np.sqrt(mean_squared_error(y_test, y_pred_text)):.4f}\n")
    f.write(f"Mean Absolute Error: {mean_absolute_error(y_test, y_pred_text):.4f}\n")
    f.write(f"R² Score: {r2_score(y_test, y_pred_text):.4f}\n\n")
    
    f.write("Combined Model (Text + Rating):\n")
    f.write(f"Mean Squared Error: {mean_squared_error(y_test, y_pred_combined):.4f}\n")
    f.write(f"Root Mean Squared Error: {np.sqrt(mean_squared_error(y_test, y_pred_combined)):.4f}\n")
    f.write(f"Mean Absolute Error: {mean_absolute_error(y_test, y_pred_combined):.4f}\n")
    f.write(f"R² Score: {r2_score(y_test, y_pred_combined):.4f}\n")

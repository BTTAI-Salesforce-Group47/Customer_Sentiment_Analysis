# %%
## TODO: review why model has such limited predictions for both numerical and classification 

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, f1_score, roc_auc_score,
    classification_report, confusion_matrix
)
from scipy.sparse import hstack, csr_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path

# %%
# Load data
data = pd.read_csv('clean-data/labeled_feedback.csv')

# %%
# Map numerical sentiment to categories


def map_sentiment(score):
    if score <= 4:
        return 'Negative'
    elif 5 <= score <= 7:
        return 'Neutral'
    else:
        return 'Positive'


data['sentiment'] = data['p_sentiment'].apply(map_sentiment)
print("\nClass distribution:")
print(data['sentiment'].value_counts())

# %%
# convert text to tf-idf features
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
tfidf_features = tfidf.fit_transform(data['feedback_prepped'])
print(f'TF-IDF shape: {tfidf_features.shape}')

# %%
# scale ratings
scaler = StandardScaler()
scaled_ratings = scaler.fit_transform(data['Rating'].values.reshape(-1, 1))
scaled_ratings_sparse = csr_matrix(scaled_ratings)

# combine features for the combined model
combined_features = hstack([tfidf_features, scaled_ratings_sparse])

# %%
# encode labels
le = LabelEncoder()
labels = le.fit_transform(data['sentiment'])
print("\nEncoded classes:", le.classes_)

# %%
# split data for text-only model
X_train_text, X_test_text, y_train_text, y_test_text = train_test_split(
    tfidf_features, labels, test_size=0.2, random_state=42, stratify=labels
)

# split data for combined model
X_train_combined, X_test_combined, y_train_combined, y_test_combined = train_test_split(
    combined_features, labels, test_size=0.2, random_state=42, stratify=labels
)

# %%
# Train text-only model
print("\n=== Text-Only Model ===")
rf_text = RandomForestClassifier(n_estimators=100, random_state=42)
rf_text.fit(X_train_text, y_train_text)

# predict and evaluate text-only model
y_pred_text = rf_text.predict(X_test_text)
y_pred_proba_text = rf_text.predict_proba(X_test_text)
print("\nText-only Model Metrics:")
print(f'Accuracy: {accuracy_score(y_test_text, y_pred_text):.4f}')
print(f'F1 Score: {f1_score(y_test_text, y_pred_text, average="macro"):.4f}')
print(
    f'ROC-AUC: {roc_auc_score(y_test_text, y_pred_proba_text, multi_class="ovr"):.4f}')

# %%
# train combined model
print("\n=== Combined Model (Text + Rating) ===")
rf_combined = RandomForestClassifier(n_estimators=100, random_state=42)
rf_combined.fit(X_train_combined, y_train_combined)

# predict and evaluate combined model
y_pred_combined = rf_combined.predict(X_test_combined)
y_pred_proba_combined = rf_combined.predict_proba(X_test_combined)
print("\nCombined Model Metrics:")
print(f'Accuracy: {accuracy_score(y_test_combined, y_pred_combined):.4f}')
print(
    f'F1 Score: {f1_score(y_test_combined, y_pred_combined, average="macro"):.4f}')
print(
    f'ROC-AUC: {roc_auc_score(y_test_combined, y_pred_proba_combined, multi_class="ovr"):.4f}')

# %%
# Create visuals
Path("visuals/models/tf-idf_class").mkdir(parents=True, exist_ok=True)

# %%
# classification reports
print("\n--- Text-Only Classification Report ---")
print(classification_report(y_test_text, y_pred_text, target_names=le.classes_))

print("\n--- Combined Classification Report ---")
print(classification_report(y_test_combined,
      y_pred_combined, target_names=le.classes_))

# %%
# confusion matrices
cm_text = confusion_matrix(y_test_text, y_pred_text)
plt.figure(figsize=(6, 4))
sns.heatmap(cm_text, annot=True, fmt='d', cmap='Blues',
            xticklabels=le.classes_, yticklabels=le.classes_)
plt.title('Text-Only Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.savefig('visuals/models/tf-idf_class/confusion_text_only.png')
plt.close()

cm_combined = confusion_matrix(y_test_combined, y_pred_combined)
plt.figure(figsize=(6, 4))
sns.heatmap(cm_combined, annot=True, fmt='d', cmap='Greens',
            xticklabels=le.classes_, yticklabels=le.classes_)
plt.title('Combined Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.savefig('visuals/models/tf-idf_class/confusion_combined.png')
plt.close()

# %%
# distribution comparison
plt.figure(figsize=(10, 6))
# map numeric labels back to sentiment labels
y_test_labels = pd.Series(y_test_text).map(
    {i: label for i, label in enumerate(le.classes_)})
y_pred_text_labels = pd.Series(y_pred_text).map(
    {i: label for i, label in enumerate(le.classes_)})
y_pred_combined_labels = pd.Series(y_pred_combined).map(
    {i: label for i, label in enumerate(le.classes_)})

sns.countplot(x=y_test_labels, order=le.classes_, color='blue', label='Actual')
sns.countplot(x=y_pred_text_labels, order=le.classes_,
              color='red', alpha=0.6, label='Text-Only')
sns.countplot(x=y_pred_combined_labels, order=le.classes_,
              color='green', alpha=0.6, label='Combined')
plt.title('Sentiment Distribution: Actual vs Predictions')
plt.xlabel('Sentiment')
plt.ylabel('Count')
plt.legend()
plt.savefig('visuals/models/tf-idf_class/distribution_comparison.png')
plt.close()

# %%
# metrics comparison
metrics = {
    'Text-Only': {
        'Accuracy': accuracy_score(y_test_text, y_pred_text),
        'F1 Score': f1_score(y_test_text, y_pred_text, average='macro'),
        'ROC-AUC': roc_auc_score(y_test_text, y_pred_proba_text, multi_class='ovr')
    },
    'Combined': {
        'Accuracy': accuracy_score(y_test_combined, y_pred_combined),
        'F1 Score': f1_score(y_test_combined, y_pred_combined, average='macro'),
        'ROC-AUC': roc_auc_score(y_test_combined, y_pred_proba_combined, multi_class='ovr')
    }
}

metrics_df = pd.DataFrame(metrics).T.reset_index().rename(
    columns={'index': 'Model'})
metrics_melted = metrics_df.melt(
    id_vars='Model', var_name='Metric', value_name='Score')

plt.figure(figsize=(10, 6))
sns.barplot(x='Metric', y='Score', hue='Model', data=metrics_melted)
plt.title('Model Performance Comparison')
plt.ylim(0, 1)
plt.legend(title='Model')
plt.savefig('visuals/models/tf-idf_class/metrics_comparison.png')
plt.close()

# %%
# save metrics to a text file
with open('visuals/models/tf-idf_class/metrics_comparison.txt', 'w') as f:
    f.write("=== Text-Only Model Metrics ===\n")
    f.write(f"Accuracy: {metrics['Text-Only']['Accuracy']:.4f}\n")
    f.write(f"F1 Score: {metrics['Text-Only']['F1 Score']:.4f}\n")
    f.write(f"ROC-AUC: {metrics['Text-Only']['ROC-AUC']:.4f}\n\n")

    f.write("=== Combined Model Metrics ===\n")
    f.write(f"Accuracy: {metrics['Combined']['Accuracy']:.4f}\n")
    f.write(f"F1 Score: {metrics['Combined']['F1 Score']:.4f}\n")
    f.write(f"ROC-AUC: {metrics['Combined']['ROC-AUC']:.4f}\n")

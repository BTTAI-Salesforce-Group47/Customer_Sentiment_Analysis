# %%

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, GridSearchCV, ParameterGrid, StratifiedShuffleSplit
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
from imblearn.over_sampling import SMOTE
from tqdm import tqdm

# %%
# Load and preprocess external datasets
def load_and_preprocess_external_data():
    print("Loading external reviews data...")
    reviews_df = pd.read_csv('External_Datasets/reviews.csv')
    reviews_df = reviews_df.rename(columns={'Review': 'Feedback'})
    print("External data loaded successfully!")
    return reviews_df

# Map numerical sentiment to categories
def map_sentiment(score):
    if score <= 4:
        return 'Negative'
    elif score == 5:
        return 'Neutral'
    else:
        return 'Positive'

# %%
# Train models with GridSearch
def train_model(X, y):
    print("\n=== Training Model ===")
    rf = RandomForestClassifier(random_state=42)
    
    # Calculate total iterations
    param_grid = list(ParameterGrid(rf_params))
    n_iter = len(param_grid) * 5  # 5 for 5-fold CV
    print(f"Starting Grid Search with {n_iter} total iterations...")
    print("This may take several minutes. Progress will be shown below:")
    
    # Setting verbose to show progress
    grid_search = GridSearchCV(
        rf, rf_params, cv=5, scoring='f1_macro', n_jobs=-1,
        verbose=7
    )
    
    # Fit the model
    grid_search.fit(X, y)
    print("\n=== Training Complete ===")
    print(f"Best parameters found: {grid_search.best_params_}")
    return grid_search.best_estimator_

# %%
# Evaluate models
def evaluate_model(model, X_test, y_test, model_name):
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, average="macro")
    roc_auc = roc_auc_score(y_test, y_pred_proba, multi_class="ovr")
    class_report = classification_report(y_test, y_pred)
    
    # Print metrics
    print(f"\n=== {model_name} Model Metrics ===")
    print(f'Accuracy: {accuracy:.4f}')
    print(f'F1 Score: {f1:.4f}')
    print(f'ROC-AUC: {roc_auc:.4f}')
    print("\nClassification Report:")
    print(class_report)
    
    # Save metrics 
    metrics_dir = Path('visuals/tf-idf_class')
    metrics_dir.mkdir(parents=True, exist_ok=True)
    
    with open(metrics_dir / 'metrics_comparison.txt', 'w') as f:
        f.write(f"=== {model_name} Model Metrics ===\n")
        f.write(f'Accuracy: {accuracy:.4f}\n')
        f.write(f'F1 Score: {f1:.4f}\n')
        f.write(f'ROC-AUC: {roc_auc:.4f}\n\n')
        f.write("Classification Report:\n")
        f.write(class_report)
        
    return y_pred, y_pred_proba

# %%
# Visualization Functions
def plot_confusion_matrix(y_test, y_pred, title, filename, label_encoder):
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(6, 4))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=label_encoder.classes_, 
                yticklabels=label_encoder.classes_)
    plt.title(title)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.text(0.5, -0.1, f'Accuracy: {accuracy_score(y_test, y_pred):.2f}',
             ha='center', va='center', transform=plt.gca().transAxes)
    plt.savefig(f'visuals/tf-idf_class/{filename}.png')
    plt.close()

def plot_feature_importance(model, feature_names, title, output_path):
    importances = model.feature_importances_
    indices = np.argsort(importances)[-20:]  # Top 20 features
    plt.figure(figsize=(10, 6))
    plt.title(f'Top 20 Most Important Features ({title})')
    plt.barh(range(20), importances[indices], color='skyblue')
    plt.yticks(range(20), [feature_names[i] for i in indices])
    plt.xlabel('Importance Score')
    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

# %%
# Predict new data
def predict_new_data(model, vectorizer, label_encoder, data_path, text_column='Feedback'):
    """
    Predict sentiment for new data using the trained model
    
    Args:
        model: Trained RandomForestClassifier
        vectorizer: Fitted TfidfVectorizer
        label_encoder: Fitted LabelEncoder
        data_path: Path to CSV file containing new data
        text_column: Name of the column containing text to analyze
    
    Returns:
        DataFrame with original data plus predictions
    """
    print(f"Loading data from {data_path}...")
    new_data = pd.read_csv(data_path)
    
    if text_column not in new_data.columns:
        raise ValueError(f"Column '{text_column}' not found in the data. Available columns: {new_data.columns.tolist()}")
    
    print("Transforming text data...")
    # Transform text using the fitted TF-IDF vectorizer
    tfidf_features = vectorizer.transform(new_data[text_column])
    
    print("Making predictions...")

    predictions = model.predict(tfidf_features)
    probabilities = model.predict_proba(tfidf_features)
    
    # Add predictions to the original dataframe
    new_data['predicted_sentiment'] = label_encoder.inverse_transform(predictions)
    
    # Add probability columns for each sentiment class
    for i, class_name in enumerate(label_encoder.classes_):
        new_data[f'{class_name}_probability'] = probabilities[:, i]

    output_path = 'predictions/sentiment_predictions.csv'
    Path('predictions').mkdir(parents=True, exist_ok=True)
    new_data.to_csv(output_path, index=False)
    print(f"\nPredictions saved to {output_path}")
    
    print("\nSample predictions:")
    sample_cols = [text_column, 'predicted_sentiment'] + [col for col in new_data.columns if 'probability' in col]
    print(new_data[sample_cols].head())
    
    return new_data

# %%
# Load data
print("\n=== Loading Data ===")
print("Loading labeled feedback data...")
data = pd.read_csv('clean-data/labeled_feedback.csv')
external_data = load_and_preprocess_external_data()

# %%
# Map numerical sentiment to categories
print("\n=== Preprocessing Data ===")
print("Mapping sentiment scores to categories...")
data['sentiment'] = data['p_sentiment'].apply(map_sentiment)
external_data['sentiment_source'] = 'external'
data['sentiment_source'] = 'original'

# %%
# Combine datasets
combined_data = pd.concat([
    data[['Feedback', 'sentiment', 'sentiment_source']],
    external_data[['Feedback', 'Sentiment', 'sentiment_source']].rename(
        columns={'Sentiment': 'sentiment'})
], ignore_index=True)

# %%
# Convert text to TF-IDF features
print("\n=== Creating TF-IDF Features ===")
print("Converting text to TF-IDF features (this may take a few minutes)...")
tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
tfidf_features = tfidf.fit_transform(combined_data['Feedback'])
print(f"Created {tfidf_features.shape[1]} TF-IDF features")

# %%
# Encode labels
print("\n=== Encoding Labels ===")
le = LabelEncoder()
labels = le.fit_transform(combined_data['sentiment'])
print("Labels encoded successfully")

# %%
# Split data with a dynamic random state
print("\n=== Splitting Data ===")
random_seed = np.random.randint(1, 10000)  # Generate a random seed
sss = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=random_seed)
train_index, test_index = next(sss.split(tfidf_features, labels))

X_train_text = tfidf_features[train_index]
X_test_text = tfidf_features[test_index]
y_train_text = labels[train_index]
y_test_text = labels[test_index]
source_train = combined_data['sentiment_source'].iloc[train_index]
source_test = combined_data['sentiment_source'].iloc[test_index].reset_index(drop=True)

print("Data split completed")

# %%
# Handle class imbalance using SMOTE with dynamic random state
print("\n=== Handling Class Imbalance ===")
print("Applying SMOTE to balance classes...")
smote = SMOTE(random_state=random_seed)
X_text_resampled, y_resampled = smote.fit_resample(X_train_text, y_train_text)
print("Class balancing completed")

# %%
# Hyperparameter tuning for Random Forest with more variation

rf_params = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'class_weight': ['balanced', 'balanced_subsample'],
    'max_features': ['sqrt', 'log2', None]
}

# %%
# Train the model ONCE
print("\n=== Training Model ===")
best_model = train_model(X_text_resampled, y_resampled)
print("Model training completed!")

# %%
# Get predictions and reuse them
print("\n=== Evaluating Model ===")
y_pred, y_pred_proba = evaluate_model(best_model, X_test_text, y_test_text, 'Text-Only')

# %%
# Create visualizations
print("\n=== Creating Visualizations ===")
# Confusion matrix
plot_confusion_matrix(y_test_text, y_pred, 'Text-Only Confusion Matrix', 'confusion_text_only', le)

# Distribution comparison
plt.figure(figsize=(10, 6))
sns.countplot(x=pd.Series(y_test_text).map({i: label for i, label in enumerate(le.classes_)}), order=le.classes_, color='blue', label='Actual')
sns.countplot(x=pd.Series(y_pred).map({i: label for i, label in enumerate(le.classes_)}), 
              order=le.classes_, color='red', alpha=0.6, label='Predicted')
plt.title('Sentiment Distribution: Actual vs Predictions')
plt.xlabel('Sentiment')
plt.ylabel('Count')
plt.legend(title='Legend')
plt.savefig('visuals/tf-idf_class/distribution_comparison.png')
plt.close()

# Metrics comparison
metrics = {
    'Text-Only': {
        'Accuracy': accuracy_score(y_test_text, y_pred),
        'F1 Score': f1_score(y_test_text, y_pred, average='macro'),
        'ROC-AUC': roc_auc_score(y_test_text, y_pred_proba, multi_class='ovr')
    }
}

metrics_df = pd.DataFrame(metrics).T.reset_index().rename(columns={'index': 'Model'})
metrics_melted = metrics_df.melt(id_vars='Model', var_name='Metric', value_name='Score')

plt.figure(figsize=(10, 6))
sns.barplot(x='Metric', y='Score', hue='Model', data=metrics_melted)
plt.title('Model Performance Comparison')
plt.ylim(0, 1)
plt.xlabel('Performance Metric')
plt.ylabel('Score')
plt.legend(title='Model')
for index, row in metrics_melted.iterrows():
    plt.text(index, row['Score'] + 0.02, f"{row['Score']:.2f}",
             ha='center', va='bottom')
plt.savefig('visuals/tf-idf_class/metrics_comparison.png')
plt.close()

# Feature importance
feature_names = tfidf.get_feature_names_out()
plot_feature_importance(best_model, feature_names, 'Text-Only Model',
                        'visuals/tf-idf_class/feature_importance_text.png')

print("\n=== All Done! ===")
print("Model is trained and ready to use. We will use predict_new_data() to score new records.")

# %%
# Save example predictions
print("\n=== Saving Example Predictions ===")
print(f"Length of y_test_text: {len(y_test_text)}")
print(f"Length of y_pred: {len(y_pred)}")

if len(y_test_text) == len(y_pred):
    # Create a DataFrame with the actual and predicted labels, and the review text
    df_reviews = pd.DataFrame({
        'Review_Text': combined_data['Feedback'].iloc[test_index].reset_index(drop=True),  
        'Actual': y_test_text,
        'Predicted': y_pred
    })

    # Map numerical labels to sentiment categories
    label_map = {i: label for i, label in enumerate(le.classes_)}
    df_reviews['Actual_Sentiment'] = df_reviews['Actual'].map(label_map)
    df_reviews['Predicted_Sentiment'] = df_reviews['Predicted'].map(label_map)

    # Sample 5 reviews for each sentiment category
    sampled_reviews = df_reviews.groupby('Predicted_Sentiment', group_keys=False).apply(
        lambda x: x.sample(min(len(x), 5))).reset_index(drop=True)

    sampled_reviews.to_csv('visuals/tf-idf_class/sample_reviews.csv', index=False)
else:
    print("Arrays are not   the same length")

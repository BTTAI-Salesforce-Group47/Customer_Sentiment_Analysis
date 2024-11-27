# %%
import pandas as pd
import numpy as np
from transformers import BertTokenizerFast, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
from sklearn.metrics import accuracy_score, f1_score, roc_auc_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import matplotlib.pyplot as plt
import seaborn as sns
from pathlib import Path
import torch
from torch import nn

# %%
# Load and preprocess external datasets
def load_and_preprocess_external_data():
    reviews_df = pd.read_csv('External_Datasets/reviews.csv')
    reviews_df = reviews_df.rename(columns={'Review': 'text'})
    return reviews_df

# %%
# Load data
data = pd.read_csv('clean-data/labeled_feedback.csv')
external_data = load_and_preprocess_external_data()

# %%
# Map numerical sentiment to categories
def map_sentiment(score):
    if score <= 4:
        return 'Negative'
    elif score == 5:
        return 'Neutral'
    else:
        return 'Positive'

# Prepare datasets
data['sentiment'] = data['p_sentiment'].apply(map_sentiment)
data = data.rename(columns={'feedback_prepped': 'text'})
external_data['sentiment_source'] = 'external'
data['sentiment_source'] = 'original'

# %%
# Combine datasets
combined_data = pd.concat([
    data[['text', 'sentiment', 'sentiment_source']],
    external_data[['text', 'Sentiment', 'sentiment_source']].rename(
        columns={'Sentiment': 'sentiment'})
], ignore_index=True)

# %%
# Encode labels
le = LabelEncoder()
combined_data['label'] = le.fit_transform(combined_data['sentiment'])

# %%
# Initialize tokenizer
tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')

# %%
# Tokenize function
def tokenize_function(examples):
    return tokenizer(
        examples['text'],
        padding='max_length',
        truncation=True,
        max_length=128,
        return_tensors='pt'
    )

# %%
# Create dataset
dataset = Dataset.from_pandas(combined_data)
tokenized_dataset = dataset.map(tokenize_function, batched=True)

# %%
# Split data
train_indices, test_indices = train_test_split(
    range(len(tokenized_dataset)),
    test_size=0.2,
    stratify=combined_data['label'],
    random_state=42
)
train_dataset = tokenized_dataset.select(train_indices)
test_dataset = tokenized_dataset.select(test_indices)

# %%
# Model initialization
model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased',
    num_labels=len(le.classes_),
    hidden_dropout_prob=0.2,
    attention_probs_dropout_prob=0.2
)

# %%
# Training arguments
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=5,
    per_device_train_batch_size=16,
    per_device_eval_batch_size=16,
    evaluation_strategy="steps",
    eval_steps=100,
    save_strategy="steps",
    save_steps=100,
    save_total_limit=2,
    learning_rate=2e-5,
    weight_decay=0.01,
    warmup_steps=500,
    load_best_model_at_end=True,
    metric_for_best_model='f1',
    greater_is_better=True,
)

# %%
# Evaluation metrics
def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    probs = torch.nn.functional.softmax(torch.tensor(pred.predictions), dim=-1).numpy()
    
    return {
        'accuracy': accuracy_score(labels, preds),
        'f1': f1_score(labels, preds, average='macro'),
        'roc_auc': roc_auc_score(labels, probs, multi_class='ovr')
    }

# %%
# Initialize trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics,
)

# %%
# Train model
trainer.train()

# %%
# Create directory for visuals
Path("visuals/bert_class").mkdir(parents=True, exist_ok=True)

# %%
# Get predictions
predictions = trainer.predict(test_dataset)
probs = torch.nn.functional.softmax(torch.tensor(predictions.predictions), dim=-1).numpy()
y_pred = predictions.predictions.argmax(-1)
y_true = test_dataset['label']

# %%
# Plot confusion matrix
def plot_confusion_matrix(y_test, y_pred, title, filename):
    cm = confusion_matrix(y_test, y_pred)
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
                xticklabels=le.classes_, yticklabels=le.classes_)
    plt.title(title)
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.text(0.5, -0.1, f'Accuracy: {accuracy_score(y_test, y_pred):.2f}', 
             ha='center', va='center', transform=plt.gca().transAxes)
    plt.savefig(f'visuals/bert_class/{filename}.png')
    plt.close()

plot_confusion_matrix(y_true, y_pred, 'BERT Confusion Matrix', 'confusion_matrix')

# %%
# Distribution comparison
plt.figure(figsize=(10, 6))
sns.countplot(x=pd.Series(y_true).map({i: label for i, label in enumerate(
    le.classes_)}), order=le.classes_, color='blue', label='Actual')
sns.countplot(x=pd.Series(y_pred).map({i: label for i, label in enumerate(
    le.classes_)}), order=le.classes_, color='red', alpha=0.6, label='Predicted')
plt.title('Sentiment Distribution: Actual vs Predictions')
plt.xlabel('Sentiment')
plt.ylabel('Count')
plt.legend(title='Legend')
plt.text(0.5, -0.1, 'Blue: Actual, Red: Predicted', 
         ha='center', va='center', transform=plt.gca().transAxes)
plt.savefig('visuals/bert_class/distribution_comparison.png')
plt.close()

# %%
# Metrics comparison
metrics = {
    'BERT': {
        'Accuracy': accuracy_score(y_true, y_pred),
        'F1 Score': f1_score(y_true, y_pred, average='macro'),
        'ROC-AUC': roc_auc_score(y_true, probs, multi_class='ovr')
    }
}

metrics_df = pd.DataFrame(metrics).T.reset_index().rename(
    columns={'index': 'Model'})
metrics_melted = metrics_df.melt(
    id_vars='Model', var_name='Metric', value_name='Score')

plt.figure(figsize=(10, 6))
sns.barplot(x='Metric', y='Score', hue='Model', data=metrics_melted)
plt.title('Model Performance')
plt.ylim(0, 1)
plt.xlabel('Performance Metric')
plt.ylabel('Score')
plt.legend(title='Model')
for index, row in metrics_melted.iterrows():
    plt.text(index, row['Score'] + 0.02, f"{row['Score']:.2f}", 
             ha='center', va='bottom')
plt.savefig('visuals/bert_class/metrics_comparison.png')
plt.close()

# %%
# Save metrics to text file
with open('visuals/bert_class/metrics.txt', 'w') as f:
    f.write("=== BERT Model Metrics ===\n")
    f.write(f"Accuracy: {metrics['BERT']['Accuracy']:.4f}\n")
    f.write(f"F1 Score: {metrics['BERT']['F1 Score']:.4f}\n")
    f.write(f"ROC-AUC: {metrics['BERT']['ROC-AUC']:.4f}\n")

# %%
# Save evaluation results
eval_results = trainer.evaluate()
with open('visuals/bert_class/eval_results.txt', 'w') as f:
    f.write("=== Evaluation Results ===\n")
    for metric, value in eval_results.items():
        f.write(f"{metric}: {value:.4f}\n")

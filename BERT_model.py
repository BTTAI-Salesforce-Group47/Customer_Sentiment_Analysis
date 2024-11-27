# %%
# !pip install transformers
# !pip install datasets

# %%
from transformers import BertTokenizerFast, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import pandas as pd
from pathlib import Path
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score, roc_auc_score
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
data = pd.read_csv('clean-data/labeled_feedback.csv')

# Prepare the dataset for Hugging Face Trainer
df = data[['feedback_prepped', 'p_sentiment']].rename(
    columns={'feedback_prepped': 'text', 'p_sentiment': 'label'})
df['label'] = df['label'].astype(int)
dataset = Dataset.from_pandas(df)

# %%
# Tokenization (using BERT Fast Tokenizer)
tokenizer = BertTokenizerFast.from_pretrained('bert-base-uncased')


def tokenize(batch):
    return tokenizer(batch['text'], padding=True, truncation=True)


dataset = dataset.map(tokenize, batched=True)
dataset = dataset.train_test_split(test_size=0.2)

# %%
# Model Initialization
model = BertForSequenceClassification.from_pretrained(
    'bert-base-uncased', num_labels=11)  # 11 classes for 0 to 10

# %%
# Training Arguments
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=8,
    evaluation_strategy="epoch",
    save_steps=500,
    save_total_limit=2,
    logging_dir='./logs',
    logging_steps=10,
)

# %%
# Trainer Initialization
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset['train'],
    eval_dataset=dataset['test'],
    tokenizer=tokenizer,
)

# %%
# Train the model
trainer.train()

# %%
# Create directory for saving visuals
Path("visuals/bert_class").mkdir(parents=True, exist_ok=True)

# Evaluate the model and generate predictions
predictions = trainer.predict(dataset['test'])
y_pred = predictions.predictions.argmax(axis=1)
y_true = dataset['test']['label']

# Classification report
print("\n--- BERT Classification Report ---")
print(classification_report(y_true, y_pred))

# Confusion matrix
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(6, 4))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=range(11), yticklabels=range(11))
plt.title('BERT Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.savefig('visuals/bert_class/confusion_matrix.png')
plt.close()

# Save metrics to a text file
with open('visuals/bert_class/metrics.txt', 'w') as f:
    f.write("=== BERT Model Metrics ===\n")
    f.write(f"Accuracy: {accuracy_score(y_true, y_pred):.4f}\n")
    f.write(f"F1 Score: {f1_score(y_true, y_pred, average='macro'):.4f}\n")
    f.write(
        f"ROC-AUC: {roc_auc_score(y_true, predictions.predictions, multi_class='ovr'):.4f}\n")

# %%
# !pip install transformers
# !pip install datasets

# %%
from transformers import BertTokenizerFast, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset
import pandas as pd

# Load data
data = pd.read_csv('clean-data/labeled_feedback.csv')

# Prepare the dataset for Hugging Face Trainer
df = data[['feedback_prepped', 'p_sentiment']].rename(columns={'feedback_prepped': 'text', 'p_sentiment': 'label'})
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
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=11) # 11 classes for 0 to 10

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
# Evaluate the model
trainer.evaluate()

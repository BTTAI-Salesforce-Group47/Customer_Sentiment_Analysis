# %%
import pandas as pd
import sys
print(sys.version)
# %%
data = pd.read_csv("clean-data/feedback_data_cleaned.csv")

# %%
data.head()

# %%
docs = data['feedback_prepped'].tolist()  # Use the preprocessed feedback column

# %%
from bertopic import BERTopic

topic_model = BERTopic(language="english", calculate_probabilities=True)

# %%
docs = data['feedback_prepped'].astype(str).tolist()


# %%
topics, probs = topic_model.fit_transform(docs)


# %%
topic_model.get_topic_info()


# %%
topic_model.get_topic(0)

# %%
topic_model.get_document_info(docs)
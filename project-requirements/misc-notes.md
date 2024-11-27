FeedbackData needs to be considered in totality (text +rating) and the primary key is the email id (along with date). Every row is unique.
The real world usecase is a user can register a feedback today as negative and then after a few days the user can update the feedback to  positive/neutral which will result in a new row in the dataset.

Feedback data can have several feedbacks from the same user, but it will never be the same feedback by the same user on the same date. Every row in totality is unique. 
I would suggest getting the sentiment per row  in the feedbackData and then group by user email and take an average. Use this in the leads data.
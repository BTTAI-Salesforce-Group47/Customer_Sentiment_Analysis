const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Create SQLite database connection
const db = new sqlite3.Database('./feedback.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Initialize database tables
const initializeDatabase = () => {
  db.serialize(() => {
    // Create feedback table with all required columns
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      company_name TEXT,
      feedback_text TEXT,
      rating INTEGER,
      text_sentiment REAL,
      combined_score REAL,
      sentiment_score REAL,
      category TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err);
        return;
      }
      console.log('Feedback table created or already exists');
    });

    // Check if data already exists
    db.get("SELECT COUNT(*) as count FROM feedback", [], (err, row) => {
      if (err) {
        console.error('Error checking data:', err);
        return;
      }

      // Only import CSV if table is empty
      if (row.count === 0) {
        console.log('Importing CSV data...');
        const csvPath = path.join(__dirname, '..', '..', 'clean-data', 'feedback_data_with_company.csv');
        
        if (!fs.existsSync(csvPath)) {
          console.error('CSV file not found:', csvPath);
          return;
        }

        console.log('Reading from:', csvPath);
        
        let isFirstRow = true;
        
        fs.createReadStream(csvPath)
          .pipe(csv())
          .on('data', (row) => {
            if (isFirstRow) {
              console.log('First row structure:', row);
              isFirstRow = false;
            }

            // Simplified data insertion for debugging
            db.run(
              `INSERT INTO feedback (
                date, 
                company_name, 
                feedback_text, 
                sentiment_score,
                category
              ) VALUES (?, ?, ?, ?, ?)`,
              [
                row.date || new Date().toISOString(),
                row.company_name || 'Unknown',
                row.feedback_text || '',
                parseFloat(row.sentiment_score) || 0,
                row.category || 'Uncategorized'
              ],
              (err) => {
                if (err) {
                  console.error('Error inserting row:', err);
                  console.error('Row data:', row);
                }
              }
            );
          })
          .on('end', () => {
            console.log('CSV data successfully imported');
          })
          .on('error', (error) => {
            console.error('Error reading CSV:', error);
          });
      } else {
        console.log(`Database already contains ${row.count} records`);
      }
    });
  });
};

// Add some sample data if CSV is not available
const addSampleData = () => {
  const sampleData = [
    { date: '2023-01-01', company_name: 'Company A', feedback_text: 'Great service', sentiment_score: 0.8, category: 'Service' },
    { date: '2023-01-02', company_name: 'Company B', feedback_text: 'Poor quality', sentiment_score: -0.6, category: 'Quality' },
    { date: '2023-02-01', company_name: 'Company C', feedback_text: 'Excellent product', sentiment_score: 0.9, category: 'Product' },
    { date: '2023-02-15', company_name: 'Company D', feedback_text: 'Needs improvement', sentiment_score: -0.3, category: 'Product' },
  ];

  db.get("SELECT COUNT(*) as count FROM feedback", [], (err, row) => {
    if (err || row.count > 0) return;

    sampleData.forEach(data => {
      db.run(
        `INSERT INTO feedback (date, company_name, feedback_text, sentiment_score, category) 
         VALUES (?, ?, ?, ?, ?)`,
        [data.date, data.company_name, data.feedback_text, data.sentiment_score, data.category]
      );
    });
    console.log('Sample data added');
  });
};

initializeDatabase();
// Add sample data if CSV import fails
setTimeout(addSampleData, 1000);

// Update the API endpoints to handle empty results
app.get('/api/sentiment/trends', (req, res) => {
  console.log('Fetching sentiment trends...');
  db.all(
    `SELECT 
      strftime('%Y-%m', date) as month,
      ROUND(AVG(CASE WHEN sentiment_score > 0 THEN sentiment_score ELSE 0 END), 2) as positive,
      ROUND(AVG(CASE WHEN sentiment_score < 0 THEN ABS(sentiment_score) ELSE 0 END), 2) as negative
     FROM feedback 
     GROUP BY month 
     ORDER BY month`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      console.log('Sentiment trends results:', rows);
      if (!rows || rows.length === 0) {
        res.json([{ month: new Date().toISOString().slice(0,7), positive: 0, negative: 0 }]);
        return;
      }
      res.json(rows);
    }
  );
});

app.get('/api/sentiment/by-category', (req, res) => {
  db.all(
    `SELECT 
      category,
      ROUND(COUNT(CASE WHEN sentiment_score > 0 THEN 1 END) * 100.0 / COUNT(*), 2) as positive,
      ROUND(COUNT(CASE WHEN sentiment_score < 0 THEN 1 END) * 100.0 / COUNT(*), 2) as negative
     FROM feedback 
     GROUP BY category`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      if (!rows || rows.length === 0) {
        res.json([{ category: 'No Data', positive: 0, negative: 0 }]);
        return;
      }
      res.json(rows);
    }
  );
});

// Add new endpoints for detailed sentiment analysis
app.get('/api/sentiment/comparison', (req, res) => {
  db.all(
    `SELECT 
      COUNT(CASE WHEN text_sentiment > 0 THEN 1 END) * 100.0 / COUNT(*) as text_positive,
      COUNT(CASE WHEN text_sentiment < 0 THEN 1 END) * 100.0 / COUNT(*) as text_negative,
      COUNT(CASE WHEN text_sentiment = 0 THEN 1 END) * 100.0 / COUNT(*) as text_neutral,
      COUNT(CASE WHEN combined_score > 0 THEN 1 END) * 100.0 / COUNT(*) as combined_positive,
      COUNT(CASE WHEN combined_score < 0 THEN 1 END) * 100.0 / COUNT(*) as combined_negative,
      COUNT(CASE WHEN combined_score = 0 THEN 1 END) * 100.0 / COUNT(*) as combined_neutral
     FROM feedback`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      res.json(rows[0]);
    }
  );
});

app.get('/api/sentiment/examples', (req, res) => {
  db.all(
    `WITH RankedExamples AS (
      SELECT 
        feedback_text,
        rating,
        COALESCE(text_sentiment, 0) as text_sentiment,
        COALESCE(combined_score, sentiment_score) as combined_score,
        CASE 
          WHEN COALESCE(combined_score, sentiment_score) > 0 THEN 'positive'
          WHEN COALESCE(combined_score, sentiment_score) < 0 THEN 'negative'
          ELSE 'neutral'
        END as classification,
        ROW_NUMBER() OVER (
          PARTITION BY 
            CASE 
              WHEN COALESCE(combined_score, sentiment_score) > 0 THEN 'positive'
              WHEN COALESCE(combined_score, sentiment_score) < 0 THEN 'negative'
              ELSE 'neutral'
            END 
          ORDER BY RANDOM()
        ) as rn
      FROM feedback
      WHERE feedback_text IS NOT NULL
    )
    SELECT *
    FROM RankedExamples
    WHERE rn <= 3
    ORDER BY classification, rn`,
    [],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      res.json(rows || []);
    }
  );
});

// Add this endpoint for debugging
app.get('/api/debug/data', (req, res) => {
  db.all('SELECT COUNT(*) as count FROM feedback', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ 
      recordCount: rows[0].count,
      databasePath: path.resolve('./feedback.db'),
      timestamp: new Date().toISOString()
    });
  });
});

const startServer = async () => {
  const PORT = process.env.PORT || 5001; // Changed to 5001
  
  try {
    await new Promise((resolve, reject) => {
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        resolve();
      });

      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.log(`Port ${PORT} is busy, trying ${PORT + 1}...`);
          server.close();
          app.listen(PORT + 1, () => {
            console.log(`Server running on port ${PORT + 1}`);
            resolve();
          });
        } else {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit(0);
  });
});
  
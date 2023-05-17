import express from 'express';
import 'dotenv/config';
import stripe from './routes/stripe.js';

const app = express();

const port = process.env.PORT || 8000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE'
  );

  next();
});

app.use('/api/stripe', stripe);

// If we get till these middlewares (which access req, res), it means the previous routes gave some error

app.listen(port, () => console.log(`Server running on port ${port}`));

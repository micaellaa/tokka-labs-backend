// server.test.js
import request from 'supertest';
import express from 'express';
import transactionRoutes from '../routes/transactionRoutes';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const corsOptions = {
  origin: "http://localhost:5234",
  methods: ["GET", "POST"],
  credentials: true, 
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
  res.send("test-message");
});
app.use("/transaction", transactionRoutes);

describe('Test Server Endpoints', () => {
  it('should return a test message from the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('test-message');
  });

  it('should return a testing message from /transaction endpoint', async () => {
    const response = await request(app).get('/transaction/');
    expect(response.status).toBe(200);
    expect(response.body).toBe('Testing default');
  });
});

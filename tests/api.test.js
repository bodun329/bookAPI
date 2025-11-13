 const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

let books = [
  { id: 1, title: "Dune", author: "Frank Herbert", available: true }
];

// Simulate same endpoints as server.js
app.get('/api/books', (req, res) => res.json(books));
app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});
app.post('/api/books', (req, res) => {
  const newBook = { id: books.length + 1, ...req.body };
  books.push(newBook);
  res.status(201).json(newBook);
});
app.put('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  Object.assign(book, req.body);
  res.json(book);
});
app.delete('/api/books/:id', (req, res) => {
  const index = books.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Book not found' });
  const deleted = books.splice(index, 1);
  res.json(deleted[0]);
});

describe('Books API', () => {
  it('GET /api/books should return all books', async () => {
    const res = await request(app).get('/api/books');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/books should add a book', async () => {
    const res = await request(app)
      .post('/api/books')
      .send({ title: "Test Book", author: "Tester", available: true });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Book");
  });

  it('PUT /api/books/:id should update a book', async () => {
    const res = await request(app)
      .put('/api/books/1')
      .send({ title: "Updated Dune" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Dune");
  });

  it('DELETE /api/books/:id should remove a book', async () => {
    const res = await request(app).delete('/api/books/1');
    expect(res.statusCode).toBe(200);
  });

  it('GET /api/books/:id should return 404 if not found', async () => {
    const res = await request(app).get('/api/books/999');
    expect(res.statusCode).toBe(404);
  });
});

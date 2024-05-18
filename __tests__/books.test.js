require("dotenv").config();
process.env.NODE_ENV === "test"

const request = require('supertest')

const app = require('../app')
const db = require("../db");

let book_isbn;

beforeEach(async () => {
    let result = await db.query(`
    INSERT INTO books
    (isbn, amazon_url, author, language, pages, publisher, title, year)
    VALUES(
        '8976568',
        'https://amazon.com/not-real',
        'me',
        'English',
        330,
        'Not real publishers',
        'This is a book :D',
        2024)
        RETURNING isbn`)

    book_isbn = result.rows[0].isbn;
});

describe("POST /books", () => {
    test('creates new book', async () => {
        const response = await request(app)
            .post(`/books`)
            .send({
                isbn: '89765gtyvb68',
                amazon_url: 'https://amazon.com/not-real',
                author: 'me',
                language: 'English',
                pages: 330,
                publisher: 'Not real publishers',
                title: 'This is a book :D',
                year: 2024
            });
        // expect(response.status).toBe(201);
        expect(response.body.book).toHaveProperty("isbn");
    })

    test('invalid entry', async () => {
        const response = await request(app)
            .post(`/books`)
            .send({
                year: 2024
            });
        expect(response.status).toBe(400);
    })
})

describe("PUT /books", () => {
    test('updates book', async () => {
        //adds a book
        await request(app)
        .post(`/books`)
        .send({
            isbn: '8976568',
            amazon_url: 'https://amazon.com/not-real',
            author: 'me',
            language: 'English',
            pages: 330,
            publisher: 'Not real publishers',
            title: 'This is a book :D',
            year: 2024
        });

        // tests PUT
        const response = await request(app)
            .post(`/books/8976568`)
            .send({
                amazon_url: 'https://amazon.com/definitely-not-real',
                author: 'not me :(',
                language: 'Spanish',
                pages: 33000,
                publisher: 'Not real publishers',
                title: 'This is a book :D',
                year: 2027
            });
        expect(response.status).toBe(201);
        expect(response.body.book).toHaveProperty("isbn");
    })

    test('invalid entry', async () => {
        const response = await request(app)
            .post(`/books/8976568`)
            .send({
                year: 2024
            });
        expect(response.status).toBe(400);
    })
})

afterEach(async () => {
    await db.query("DELETE FROM BOOKS");
});

afterAll(async () => {
    await db.end();
});

import supertest from 'supertest';
import { app } from '../..';

// const URI = `http://localhost:${process.env.PORT}`;
const URI = 'http://localhost:3000';

describe('', () => {
  it('should return 200 and receive empty array', async () => {
    const response = await supertest(app).get('/aluno').expect(200);

    expect(response.body).toEqual([]);
  });
});

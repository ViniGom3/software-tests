import { Router } from 'express';
import prisma from '../prisma';
import argon2 from 'argon2';
import { Exception } from '../error';

export const hashing = async function (value: string) {
  return await argon2.hash(value);
};

export const verify = async function (hash: string, plaintext: string) {
  return await argon2.verify(hash, plaintext);
};

const router = Router();

router.get('/users', async (req, res, next) => {
  try {
    const allAlunos = await prisma.aluno.findMany({
      select: {
        matricula: true,
      },
    });

    throw new Exception(400, 'fodfe');

    res.json(allAlunos);
  } catch (error) {
    next(error);
  }
});

export default router;

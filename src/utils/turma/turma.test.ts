import { calcularMediaTurma, TurmaUtil } from '.';

describe('Turma Util', () => {
  test('should return turma mean', () => {
    const turmas1: TurmaUtil[] = [
      {
        grauFinal: 10,
      },
      {
        grauFinal: 5,
      },
      {
        grauFinal: 7,
      },
    ];

    const turmas2: TurmaUtil[] = [
      {
        grauFinal: 3,
      },
      {
        grauFinal: 1,
      },
      {
        grauFinal: 4,
      },
    ];

    const oracle1 = (10 + 5 + 7) / 3;
    expect(calcularMediaTurma(turmas1)).toBe(oracle1);

    const oracle2 = (3 + 1 + 4) / 3;
    expect(calcularMediaTurma(turmas2)).toBe(oracle2);
  });

  test('should return zero if turma is empty', () => {
    const turmas: TurmaUtil[] = [];

    expect(calcularMediaTurma(turmas)).toBe(0);
  });
});

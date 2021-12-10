import { Situacao } from '@prisma/client';
import { calcularIra, AvaliacaoUtil } from '.';

describe('Aluno Util', () => {
  test('should be equal to 8', async () => {
    const avaliacoes: AvaliacaoUtil[] = [
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 8,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 10,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 9,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 6,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 7,
        situacao: Situacao.APROVADO,
      },
    ];

    const oracle = (60 * (8 + 10 + 9 + 6 + 7)) / (5 * 60);

    const resultado = calcularIra(avaliacoes);
    expect(resultado).toBe(oracle);
  });
  test('should turn 0 on REPROVADO_FALTA', () => {
    const avaliacoes: AvaliacaoUtil[] = [
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 8,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 10,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 9,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 6,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 7,
        situacao: Situacao.REPROVADO_FALTAS,
      },
    ];

    const oracle = (60 * (8 + 10 + 9 + 6 + 0)) / (5 * 60);

    const resultado = calcularIra(avaliacoes);
    expect(resultado).toBe(oracle);
  });

  test('should count REPROVADO_NOTA', () => {
    const avaliacoes: AvaliacaoUtil[] = [
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 8,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 10,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 9,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 4,
        situacao: Situacao.REPROVADO_NOTA,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 7,
        situacao: Situacao.REPROVADO_FALTAS,
      },
    ];

    const oracle = (60 * (8 + 10 + 9 + 4 + 0)) / (5 * 60);

    const resultado = calcularIra(avaliacoes);
    expect(resultado).toBe(oracle);
  });

  test('should count REPROVADO_NOTA', () => {
    const avaliacoes: AvaliacaoUtil[] = [
      {
        turma: {
          Disciplina: {
            cargaHoraria: 90,
          },
        },
        grauFinal: 8,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 10,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 30,
          },
        },
        grauFinal: 9,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 4,
        situacao: Situacao.REPROVADO_NOTA,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 7,
        situacao: Situacao.REPROVADO_FALTAS,
      },
    ];

    const oracle =
      (8 * 90 + 10 * 60 + 9 * 30 + 4 * 60 + 0 * 60) / (90 + 60 + 30 + 60 + 60);

    const resultado = calcularIra(avaliacoes);
    expect(resultado).toBe(oracle);
  });

  test('should return 0 if grauFinal is 0', () => {
    const avaliacoes: AvaliacaoUtil[] = [
      {
        turma: {
          Disciplina: {
            cargaHoraria: 90,
          },
        },
        grauFinal: 0,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 0,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 30,
          },
        },
        grauFinal: 0,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 0,
        situacao: Situacao.REPROVADO_NOTA,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 60,
          },
        },
        grauFinal: 0,
        situacao: Situacao.REPROVADO_FALTAS,
      },
    ];

    const resultado = calcularIra(avaliacoes);
    expect(resultado).toBe(0);
  });

  test('should return 0 if cargaHoraria is 0', () => {
    const avaliacoes: AvaliacaoUtil[] = [
      {
        turma: {
          Disciplina: {
            cargaHoraria: 0,
          },
        },
        grauFinal: 8,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 0,
          },
        },
        grauFinal: 10,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 0,
          },
        },
        grauFinal: 9,
        situacao: Situacao.APROVADO,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 0,
          },
        },
        grauFinal: 4,
        situacao: Situacao.REPROVADO_NOTA,
      },
      {
        turma: {
          Disciplina: {
            cargaHoraria: 0,
          },
        },
        grauFinal: 7,
        situacao: Situacao.REPROVADO_FALTAS,
      },
    ];

    const resultado = calcularIra(avaliacoes);
    expect(resultado).toBe(0);
  });
});

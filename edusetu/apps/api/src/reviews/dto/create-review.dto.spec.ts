import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ReviewPerspective } from '@prisma/client';
import { CreateReviewDto } from './create-review.dto';

describe('CreateReviewDto', () => {
  const validDto = (): CreateReviewDto => plainToInstance(CreateReviewDto, {
    perspective: ReviewPerspective.PARENT_GUARDIAN,
    overallRating: 4,
    title: 'A thoughtful review',
    body: 'This is a sufficiently detailed review for validation.',
    experienceYear: 2026,
    categoryScores: [{ categoryKey: 'teaching_learning', score: 4 }],
  });

  it('accepts a valid review payload', async () => {
    const errors = await validate(validDto());
    expect(errors).toHaveLength(0);
  });

  it('rejects an overall rating outside the 1–5 range', async () => {
    const dto = validDto();
    dto.overallRating = 6;
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'overallRating')).toBe(true);
  });

  it('rejects review text shorter than the minimum length', async () => {
    const dto = validDto();
    dto.body = 'Too short';
    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'body')).toBe(true);
  });
});

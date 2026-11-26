import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReportReviewDto } from './dto/report-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
import { ReviewsService } from './reviews.service';

class ReviewPaginationQuery {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 20;
}

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get('institutions/:institutionId/reviews')
  @Public()
  @ApiOperation({ summary: 'List published reviews for an institution' })
  list(
    @Param('institutionId') institutionId: string,
    @Query() query: ReviewPaginationQuery,
  ) {
    return this.reviews.listPublished(institutionId, query.page, query.limit);
  }

  @Post('institutions/:institutionId/reviews')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review for independent moderation' })
  create(
    @Param('institutionId') institutionId: string,
    @CurrentUser() principal: AuthPrincipal,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviews.create(institutionId, principal, body);
  }

  @Post('reviews/:reviewId/reports')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Report a published review for policy review' })
  report(
    @Param('reviewId') reviewId: string,
    @CurrentUser() principal: AuthPrincipal,
    @Body() body: ReportReviewDto,
  ) {
    return this.reviews.report(reviewId, principal, body.reason, body.details);
  }

  @Post('institutions/:institutionId/reviews/:reviewId/response')
  @ApiBearerAuth()
  @RequirePermission('reviews:respond')
  @ApiOperation({ summary: 'Publish or update an institution response to a review' })
  respond(
    @Param('institutionId') institutionId: string,
    @Param('reviewId') reviewId: string,
    @CurrentUser() principal: AuthPrincipal,
    @Body() body: RespondReviewDto,
  ) {
    return this.reviews.respond(institutionId, reviewId, principal, body.body);
  }
}

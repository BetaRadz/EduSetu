import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { ModerationDecisionDto } from './dto/moderation-decision.dto';
import { ModerationQueueDto } from './dto/moderation-queue.dto';
import { ModerationService } from './moderation.service';

@ApiTags('moderation')
@ApiBearerAuth()
@Controller('moderation')
@RequirePermission('moderation:review')
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  @Get('reviews')
  @ApiOperation({ summary: 'List reviews in a moderation state' })
  listReviews(@Query() query: ModerationQueueDto) {
    return this.moderation.listReviewQueue(query.status);
  }

  @Get('cases')
  @ApiOperation({ summary: 'List open moderation and report cases' })
  listCases() {
    return this.moderation.listOpenCases();
  }

  @Patch('reviews/:reviewId/decision')
  @ApiOperation({ summary: 'Publish, reject, hide, or restore a review with an audit record' })
  decide(
    @Param('reviewId') reviewId: string,
    @CurrentUser() principal: AuthPrincipal,
    @Body() body: ModerationDecisionDto,
  ) {
    return this.moderation.decideReview(reviewId, principal, body.decision, body.reason);
  }
}

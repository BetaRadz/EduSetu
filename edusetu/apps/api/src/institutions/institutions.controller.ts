import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { CreateClaimDto } from './dto/create-claim.dto';
import { SearchInstitutionsDto } from './dto/search-institutions.dto';
import { InstitutionsService } from './institutions.service';

@ApiTags('institutions')
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly institutions: InstitutionsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search verified public institutions' })
  search(@Query() query: SearchInstitutionsDto) {
    return this.institutions.search(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a verified public institution profile' })
  getProfile(@Param('slug') slug: string) {
    return this.institutions.findPublicProfile(slug);
  }

  @Post(':institutionId/claims')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a claim to manage an institution profile' })
  createClaim(
    @Param('institutionId') institutionId: string,
    @CurrentUser() principal: AuthPrincipal,
    @Body() body: CreateClaimDto,
  ) {
    return this.institutions.submitClaim(institutionId, principal, body.businessReason);
  }
}

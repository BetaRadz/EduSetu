import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RequirePermission } from '../common/decorators/require-permission.decorator';
import { AuthPrincipal } from '../common/interfaces/auth-principal.interface';
import { ClaimDecisionDto } from './dto/claim-decision.dto';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { InstitutionStatusDto } from './dto/institution-status.dto';
import { VerificationService } from './verification.service';

@ApiTags('verification')
@ApiBearerAuth()
@Controller('verification')
@RequirePermission('verification:manage')
export class VerificationController {
  constructor(private readonly verification: VerificationService) {}

  @Post('institutions')
  @ApiOperation({ summary: 'Create an institution record pending verification' })
  createInstitution(@CurrentUser() principal: AuthPrincipal, @Body() body: CreateInstitutionDto) {
    return this.verification.createInstitution(principal, body);
  }

  @Patch('institutions/:id/status')
  @ApiOperation({ summary: 'Verify, suspend, or archive an institution with an audit record' })
  updateInstitutionStatus(
    @Param('id') id: string,
    @CurrentUser() principal: AuthPrincipal,
    @Body() body: InstitutionStatusDto,
  ) {
    return this.verification.updateInstitutionStatus(id, principal, body);
  }

  @Get('claims')
  @ApiOperation({ summary: 'List institution claims awaiting verification review' })
  listClaims() {
    return this.verification.listClaims();
  }

  @Patch('claims/:claimId/decision')
  @ApiOperation({ summary: 'Approve or reject an institution claim; approval grants an owner membership' })
  decideClaim(
    @Param('claimId') claimId: string,
    @CurrentUser() principal: AuthPrincipal,
    @Body() body: ClaimDecisionDto,
  ) {
    return this.verification.decideClaim(claimId, principal, body.decision, body.reason);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GenerateQRRequestDto } from './dtos/requests/generate-qr.request.dto';
import { QRTokensService } from './qr-tokens.service';
import {
  GenerateQRResponseDto,
  VerifyQRResponseDto,
} from './dtos/responses/qr-token.response.dto';

@ApiTags('QR Tokens')
@Controller('qr-tokens')
export class QRTokensController {
  constructor(private readonly qrTokensService: QRTokensService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Create QR token' })
  @ApiResponse({ status: 201, description: 'QR token created successfully' })
  @ApiBearerAuth()
  async generateQR(
    @Body() generateQRRequestDto: GenerateQRRequestDto,
  ): Promise<GenerateQRResponseDto> {
    const qrToken = await this.qrTokensService.generateToken(
      generateQRRequestDto.action,
      generateQRRequestDto.sessionId,
    );

    return {
      id: qrToken.id,
      token: qrToken.token,
      qrCodeBase64: `data:image/png;base64,generated_qr_code`,
      expiresAt: qrToken.expiresAt,
      expiresInSeconds: 300,
    };
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify QR token' })
  @ApiResponse({ status: 200, description: 'QR verification result' })
  async verifyQR(@Body('token') token: string): Promise<VerifyQRResponseDto> {
    const result = await this.qrTokensService.verifyToken(token);

    return {
      valid: result.valid,
      userId: result.userId,
      action: result.action,
      sessionId: result.sessionId,
    };
  }
}

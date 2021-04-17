import FitBitTokenDetailsV1 from './models/fitbit/FitbitTokenDetailsV1';
import TokenClient from './clients/TokenClient';

export default class TokenService {
  private client: TokenClient;

  constructor(private clientId: string, private clientSecret: string) {
    this.client = new TokenClient();
  }

  hasTokenExpired = (tokenDetails: FitBitTokenDetailsV1): boolean => {
    const now = new Date();

    const tokenExpiry = new Date(
      tokenDetails.created_at + (tokenDetails.expires_in * 1000),
    );

    if (now < tokenExpiry) {
      return false;
    }

    return true;
  };

  refreshTokenAsync = async (
    existingTokenDetails: FitBitTokenDetailsV1,
  ): Promise<FitBitTokenDetailsV1> => {
    if (!this.hasTokenExpired(existingTokenDetails)) {
      return existingTokenDetails;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const result = await this.client.refreshTokenAsync(
      this.clientId,
      this.clientSecret,
      existingTokenDetails.refresh_token,
    );

    result.created_at = new Date().valueOf();

    return result;
  };
}

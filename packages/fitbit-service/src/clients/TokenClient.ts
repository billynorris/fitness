import axios, { AxiosInstance } from 'axios';
import FitbitTokenDetailsV1 from '../models/fitbit/FitbitTokenDetailsV1';

export default class TokenClient {
  private client: AxiosInstance;

  TokenClient() {
    this.client = axios.create({
      baseURL: 'https://api.fitbit.com',
    });
  }

  refreshTokenAsync = async (
    clientId: string,
    clientSecret: string,
    refreshToken: string,
  ): Promise<FitbitTokenDetailsV1> => {
    const request: { [key: string]: string } = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const data = Object.entries(request).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    const response = await this.client
      .post('/oauth2/token', data,
        {
          headers: {
            Authorization: `Basic ${Buffer.from([clientId, clientSecret].join(':')).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

    return response.data;
  };
}

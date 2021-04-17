import axios, { AxiosInstance } from 'axios';
import log from '@dazn/lambda-powertools-logger';
import FitbitResultV1 from '../models/fitbit/FitbitResultV1';
import FitbitListWeightEntriesResponseV1 from '../models/fitbit/weight/FitBitListWeightEntriesResponseV1';
import { getRateLimitData } from './helpers';

export default class WeightClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.fitbit.com',
    });
  }

  getWeightEntriesAsync = async (
    access_token: string,
    dateFrom: string,
    dateTo: string,
  ): Promise<FitbitResultV1<FitbitListWeightEntriesResponseV1>> => {
    try {
      const response = await this.client.get(`/1/user/-/body/log/weight/date/${dateFrom}/${dateTo}.json`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en_GB',
        },
        validateStatus: (status) => status === 200,
      });

      return {
        rateLimit: getRateLimitData(response.headers),
        data: response.data,
      };
    } catch (err) {
      log.error('An error has occurred', err);
      throw err;
    }
  };

  addWeightEntryAsync = async (
    access_token: string,
    weight: number,
    date: string,
  ): Promise<any> => {
    const request: { [key: string]: string } = {
      weight: weight.toString(),
      date,
    };

    const data = Object.entries(request).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');

    const response = await this.client.post('/1/user/-/body/log/weight', data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'Accept-Language': 'en_GB',
      },
    });

    return response;
  };
}

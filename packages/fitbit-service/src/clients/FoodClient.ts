import axios, { AxiosInstance } from 'axios';
import FitBitFoodEntryV1 from '../models/fitbit/FitbitFoodEntryV1';
import FitBitListFoodsResponseV1 from '../models/fitbit/FitbitListFoodsResponseV1';

export default class FoodClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://api.fitbit.com',
    });
  }

  getFoodLogAsync = async (
    access_token: string,
    date: string,
  ): Promise<FitBitListFoodsResponseV1> => {
    const response = await this.client.get<FitBitListFoodsResponseV1>(`/1/user/-/foods/log/date/${date}.json`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
          'Accept-Language': 'en_GB',
        },
      });
    return response.data;
  };

  addFoodItemAsync = async (access_token: string, request: FitBitFoodEntryV1) => {
    const data = Object.entries(request).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
    const response = await this.client.post<FitBitFoodEntryV1>('/1/user/-/foods/log.json', data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Accept-Language': 'en_GB',
      },
    });

    return response;
  };

  deletefoodLogAsync = async (
    access_token: string,
    foodLogId: string,
  ): Promise<boolean> => {
    // https://api.fitbit.com/1/user/[user-id]/foods/log/[food-log-id].json
    const response = await this.client.delete(`/1/user/-/foods/log/${foodLogId}.json`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Accept-Language': 'en_GB',
      },
    });

    return response.status === 204;
  };
}

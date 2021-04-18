import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import log from '@dazn/lambda-powertools-logger';
// import MyFitnessPalDataExporter from './lib/my-fitness-pal';
// import ListFoodEntriesResponseV1 from './models/ListFoodEntriesResponseV1';

// let exporter: MyFitnessPalDataExporter;

export default async (
  event: APIGatewayProxyEvent,
  // eslint-disable-next-line arrow-body-style
): Promise<APIGatewayProxyResult> => {
  // if (!exporter) {
  //   exporter = new MyFitnessPalDataExporter();
  // }

  const from = event.queryStringParameters?.from ?? new Date((new Date().setDate(new Date().getDate() - 7))).toISOString().split('T')[0];
  const to = event.queryStringParameters?.to ?? new Date().toISOString().split('T')[0];
  const { userId } = event.pathParameters;

  log.debug('Fetching MyFitnessPal food data for user', {
    userId,
    fromDate: from,
    toDate: to,
  });

  // const foodEntries = await exporter.getDataAsync(userId, from, to);

  // const result: ListFoodEntriesResponseV1 = {
  //   entries: foodEntries,
  // };

  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
};

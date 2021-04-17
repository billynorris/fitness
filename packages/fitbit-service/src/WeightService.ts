import log from '@dazn/lambda-powertools-logger';
import WeightClient from './clients/WeightClient';

export default class {
  private client: WeightClient;

  constructor() {
    this.client = new WeightClient();
  }

  private buildWeightkey = (date: string, weight: number) => [
    date,
    weight].join('|');

  syncWeightEntriesAsync = async (
    access_token: string,
    weights: { [key: string]: number },
  ): Promise<boolean> => {
    const orderedWeightDates = Object.keys(weights).sort();
    const earliest = orderedWeightDates[0];
    const latest = orderedWeightDates[orderedWeightDates.length - 1];

    const existingWeightEntries = await this.client
      .getWeightEntriesAsync(access_token, earliest, latest);

    const existingWeightEntriesMap = existingWeightEntries
      .data.weight.reduce((reducer, weightEntry) => {
        if (reducer[weightEntry.date]) {
          reducer[weightEntry.date].push(this.buildWeightkey(weightEntry.date, weightEntry.weight));
        } else {
          // eslint-disable-next-line no-param-reassign
          reducer[weightEntry.date] = [this.buildWeightkey(weightEntry.date, weightEntry.weight)];
        }
        return reducer;
      }, {} as { [key: string]: Array<string> });

    log.debug('Existing weight entries', existingWeightEntriesMap);

    const weightEntriesToAdd: Array<Promise<any>> = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const [date, weight] of Object.entries(weights)) {
      if (!existingWeightEntriesMap[date]
        || !existingWeightEntriesMap[date]
          .includes(this.buildWeightkey(date, weight))) {
        weightEntriesToAdd.push(
          this.client.addWeightEntryAsync(access_token, weight, date),
        );
      }
    }

    const result = await Promise.all(weightEntriesToAdd);

    log.debug('foo', result);
    return true;
  };
}

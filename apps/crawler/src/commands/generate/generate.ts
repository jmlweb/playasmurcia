import sourceData from '../../../source-data/beaches.json' assert { type: 'json' };
import { normalize } from './normalize';

export const generate = async () => {
  console.log(sourceData.map(normalize));
  console.log(process.env.MAPS_API_KEY);
};

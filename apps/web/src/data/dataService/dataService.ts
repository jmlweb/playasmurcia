import { findBeaches } from './findBeaches';
import { getDetail } from './getDetail';
import { getFeaturedBeaches } from './getFeaturedBeaches';
import { getFeatures } from './getFeatures';
import { getMunicipalities } from './getMunicipalities';

const DataService = () => {
  return {
    detail: getDetail,
    featuredBeaches: getFeaturedBeaches,
    features: getFeatures,
    findBeaches,
    municipalities: getMunicipalities,
  };
};

export const dataService = DataService();

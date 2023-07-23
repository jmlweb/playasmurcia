export type DataBeach = {
  name: string;
  slug: string;
  municipality: string;
  district?: string;
  position: number[];
  blueFlag: boolean;
  features: string[];
  pictures: string[];
  sea: number;
  phone?: string;
  email?: string;
  url?: string;
  address?: string;
  postalCode?: string;
};
export type DataBeaches = DataBeach[];
export type Beach = DataBeach & {
  temperature: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
};
export type Beaches = Beach[];

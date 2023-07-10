import beaches from '@/data/beaches.json';

export type Beaches = typeof beaches;
export type Beach = Beaches[number];

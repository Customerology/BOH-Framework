import { JsonStreetAddressModel } from './json-street-address.model';

export interface EnterpriseLocationModel {
  assignedPhoneNumber: string;
  businessFaxNumber: string;
  businessPhoneNumber: string;
  category_Ids: number[];
  enabled: boolean;
  enterprise_Id: number;
  guid: string;
  hours: string;
  id: number;
  imageUrl: string;
  jsonStoreHours: string;
  latitude: number;
  longitude: number;
  name: string;
  overall_Rating: number;
  place_Id: string;
  timezone: string;
  website: string;
  jsonStreetAddress: JsonStreetAddressModel[];
}

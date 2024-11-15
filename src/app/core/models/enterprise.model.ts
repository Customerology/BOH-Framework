import { JsonStreetAddressModel } from './json-street-address.model';

export interface EnterpriseModel {
  category_Ids: number[];
  corpBranding: {
    images: EnterpriseImageModel[];
  };
  enabled: boolean;
  guid: string;
  id: number;
  name: string;
  timezone: string;
  jsonPhoneNumbers: JsonPhoneNumbers[];
  jsonstreetaddress: JsonStreetAddressModel[];
  description?: string;
  emails: Email[];
  website: string;
}

export interface EnterpriseImageModel {
  height: number;
  imageType: string;
  imageUrl: string;
  imageUse: string;
  isHero: boolean;
  width: number;
}

interface JsonPhoneNumbers {
  isDefault: boolean;
  phoneNumber: string;
  phoneNumberType: string;
}

interface Email {
  email: string;
  emailType: string;
  isDefault: boolean;
}

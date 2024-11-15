import { LoginDetailModel } from './login-detail.model';

export interface AppUserModel {
  accessLevel: unknown;
  accessRights: number;
  accessRole: number;
  api_key: string;
  api_key_expiresOn: string;
  avatarUrl: string;
  emailAddress: string;
  enabled: boolean;
  firstName: string;
  id: number;
  key_uuid: string;
  lastName: string;
  lastlogOn: string;
  objectId: number;
  passwordHash: string;
  patron_Id: number;
  permittedApplications: string[];
  phoneNumber: string;
  updatedOn: string;
  userName: string;
  login_details?: LoginDetailModel[];
}

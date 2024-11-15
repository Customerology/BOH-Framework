import { AppUserModel, ResponseErrorModel } from './index';

export interface LoginModel {
  appUser: AppUserModel;
  error: ResponseErrorModel;
}

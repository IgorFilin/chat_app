export interface IRegUserPayload {
  name: string;
  email: string;
  password: string;
}
export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface ILoginUserPayloadByDevice extends ILoginUserPayload {
  deviceId: string;
}

export interface ILoginResponse {
  accessToken: string;
}

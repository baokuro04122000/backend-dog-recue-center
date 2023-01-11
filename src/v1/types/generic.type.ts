
export interface INotifyPayload <T>{
  status: number;
  message: string;
  data?: T;
}

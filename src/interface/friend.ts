import { Location } from "./location";

export interface Friend {
  userId: string;
  friendStatus: "pending" | "accept" | "decline";
  requestStatus: "send" | "receive";
  firstName: string;
  lastName: string;
  userName: string;
}

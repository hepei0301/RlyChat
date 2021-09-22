import { TypedEvent } from './utils/typedEvent';

export interface ImProps {
  type: string;
  userId: string | number;
  userName: string;
}

export interface MeetChatProps {
  phone: string | number;
  name: string;
}

export interface MeetProps {
  type: string;
  checkedList: MeetChatProps[];
}

// 打开Im
export const EventOpenIm = new TypedEvent<ImProps>();

// 打开Meet
export const EventOpenMeet = new TypedEvent<MeetProps>();

import { TypedEvent } from './utils/typedEvent';

export interface ImProps {
  type: string;
  chat: {
    id: string | number;
    name: string;
  };
}

export interface MeetProps {
  type: string;
  checkedList: {
    phone: string | number;
    name: string;
  };
}

// 打开Im
export const EventOpenIm = new TypedEvent<ImProps>();

// 打开Meet
export const EventOpenMeet = new TypedEvent<MeetProps>();

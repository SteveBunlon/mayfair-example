/* eslint-disable */
export type Schema = {
  'circle_events': {
    plain: {
      'id': number;
      'circle_id': number;
      'type': string;
      'owner': string;
      'maxNumberOfParticipant': string;
    };
    nested: {
      'circle': Schema['circles']['plain'] & Schema['circles']['nested'];
    };
    flat: {
      'circle:id': number;
      'circle:name': string;
    };
  };
  'circles': {
    plain: {
      'id': number;
      'name': string;
    };
    nested: {};
    flat: {};
  };
  'events': {
    plain: {
      'id': number;
      'type': string;
      'maxNumberOfParticipant': number;
      'owner': string;
    };
    nested: {};
    flat: {};
  };
};

CREATE SEQUENCE events_id_sequence;
CREATE TABLE events (
    id integer DEFAULT nextval('events_id_sequence'::regclass) PRIMARY KEY,
    type text,
    "maxNumberOfParticipant" integer,
    owner text
);

CREATE SEQUENCE circles_id_sequence;
CREATE TABLE circles (
    id integer DEFAULT nextval('circles_id_sequence'::regclass) PRIMARY KEY,
    name text
);

CREATE SEQUENCE circle_events_id_sequence;
CREATE TABLE circle_events (
    id integer DEFAULT nextval('circle_events_id_sequence'::regclass) PRIMARY KEY,
    circle_id integer REFERENCES circles(id),
    type text,
    owner text,
    "maxNumberOfParticipant" text
);
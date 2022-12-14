-- Turn OFF requirement of escaping certain special chars
SET DEFINE OFF;

-- Create tables
DROP SEQUENCE "a_people_seq";
CREATE SEQUENCE  "a_people_seq"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE  GLOBAL ;
/
DROP TABLE "A_PEOPLE" CASCADE CONSTRAINTS PURGE;
CREATE TABLE A_PEOPLE
(
  ID NUMBER(*,0) NOT NULL ENABLE, 
  LASTNAME VARCHAR2(255 BYTE), 
  FIRSTNAME VARCHAR2(255 BYTE),
  CREATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDBY VARCHAR2(255 BYTE) DEFAULT 'NO_ID',
  PRIMARY KEY ("ID")
);
/
CREATE OR REPLACE NONEDITIONABLE TRIGGER "a_people_autoinc_trg"   BEFORE INSERT on "A_PEOPLE"  for each row  declare  checking number := 1;  begin  if (:new."ID" is null) then  while checking >= 1 loop  select "a_people_seq".nextval into :new."ID" from dual;  select count("ID") into checking from "A_PEOPLE"  where "ID" = :new."ID";  end loop;  end if;  end;
/
ALTER TRIGGER "a_people_autoinc_trg" ENABLE;

DROP TABLE A_CATS;
CREATE TABLE A_CATS 
(
  PEOPLE_ID NUMBER NOT NULL, 
  ID NUMBER NOT NULL,   
  NAME VARCHAR2(50), 
  TITLE VARCHAR2(50), 
  AGE NUMBER, 
  SKILL VARCHAR2(50), 
  CREATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDBY VARCHAR2(255 BYTE) DEFAULT 'NO_ID',
  CONSTRAINT A_CATS_PK PRIMARY KEY (PEOPLE_ID,ID) ENABLE 
);

DROP TABLE A_DOGS;
CREATE TABLE A_DOGS 
(
  PEOPLE_ID NUMBER NOT NULL, 
  ID NUMBER NOT NULL, 
  NAME VARCHAR2(50), 
  TITLE VARCHAR2(50), 
  AGE NUMBER, 
  SKILL VARCHAR2(50), 
  CREATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDBY VARCHAR2(255 BYTE) DEFAULT 'NO_ID',
  CONSTRAINT A_DOGS_PK PRIMARY KEY (PEOPLE_ID,ID) ENABLE 
);

DROP TABLE A_BIRDS;
CREATE TABLE A_BIRDS 
(
  PEOPLE_ID NUMBER NOT NULL, 
  ID NUMBER NOT NULL, 
  NAME VARCHAR2(50), 
  TITLE VARCHAR2(50), 
  AGE NUMBER, 
  SKILL VARCHAR2(50), 
  CREATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDAT TIMESTAMP (6) WITH LOCAL TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
  UPDATEDBY VARCHAR2(255 BYTE) DEFAULT 'NO_ID',
  CONSTRAINT A_BIRDS_PK PRIMARY KEY (PEOPLE_ID,ID) ENABLE 
);
COMMIT WORK;

-- If re-running the below inserts, then delete all rows and
-- reset the auto-increment of the ID column.

DELETE from A_PEOPLE;
DELETE from A_BIRDS;
DELETE from A_CATS;
DELETE from A_DOGS;
COMMIT WORK;

-- Seed data into tables
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (1, 'Baroni', 'Kevin & Carrie');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (2, 'Kirkland', 'Mike');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (3, 'Brizzee', 'Nathan & Tisha');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (4, 'Eggers', 'David & Wendy');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (5, 'Aziz', 'Nurthin');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (6, 'Wegsteen', 'Jon');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (7, 'Funk', 'Jeffery');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (8, 'John', 'Smith');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (9, 'Jonathan', 'Smythe');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (10, 'Johnathen', 'Smyth');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (11, 'Johnny', 'Smithy');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (12, 'Smith', 'Jane');


-- Kevin Baroni inserts
-- A_CATS
INSERT INTO A_CATS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 1, 'Tommy', 'Simease Badass', 12, 'Pouncer');
INSERT INTO A_CATS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 2, 'Sammy', 'Sweet Tabby', 10, 'Pouncer');
INSERT INTO A_CATS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 3, 'Sateeva', 'Black Beauty', 8, 'Making babies');
-- A_DOGS
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 1, 'Tia', 'Queen of the House', 16.5, 'Getting what she wants');
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 2, 'Troy', 'The Trojan of Troy', 12, 'Getting noticed');
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 3, 'Cleo', 'Cleopatra the Lover', 12, 'Flipping your hand up');
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 4, 'Luke', 'King', 7, 'Licking your face');
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 5, 'Flaco', 'King', 8, 'Protecting the family');
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 6, 'Shilo', 'Friendly German', 11, 'Making friends with all people & animals');
-- A_BIRDS
INSERT INTO A_BIRDS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 1, 'Cinder', 'Cockataurus', 21.5, 'Whistles while he plays and works');
INSERT INTO A_BIRDS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 2, 'Pepper', 'FlyBoy', 5, 'Getting into odd places');
INSERT INTO A_BIRDS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 3, 'Tweety', 'ParaTrooper', 8, 'Coming when called');
INSERT INTO A_BIRDS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 4, 'Ditto', 'WildMan', 18, 'Flying upside down');
INSERT INTO A_BIRDS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 5, 'Vito', 'FightingMan', 7, 'Biting!!!');
-- Mike Kirkland inserts
-- A_CATS
INSERT INTO A_CATS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 1, 'Clio', 'Head Mouser', 17, 'Hunter');
INSERT INTO A_CATS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 2, 'Meeko', 'Jr Mouser', 1, 'Pouncer');
INSERT INTO A_CATS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 3, 'Koda', 'Jr Mouser', 1, 'Stalker');
-- A_DOGS
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 1, 'Fido', 'Head Bowser', 9, 'Car Chasing');
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 2, 'Fredie', 'Jr Bowser', 2, 'Barking');
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 3, 'Bowser', 'Bowser', 7, 'Ball Chasing');
-- Nathan Brizzee
-- A_CATS
INSERT INTO A_CATS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (3, 1, 'Maizi', 'Tortoiseshell Dilute', 8, 'Chillin up high');
-- A_DOGS
INSERT INTO A_DOGS
  (PEOPLE_ID, ID, NAME, TITLE, AGE, SKILL)
VALUES
  (3, 1, 'Max', 'German Shepherd', 5, 'Whining for Momma');

COMMIT WORK;

-- Turn ON requirement of escaping certain special chars
SET DEFINE ON;

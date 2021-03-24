ABORT WORK;
-- Create tables
DROP TABLE A_PEOPLE;
CREATE TABLE A_PEOPLE 
(
  ID SERIAL, 
  LASTNAME VARCHAR(50), 
  FIRSTNAME VARCHAR(50), 
  CREATEDAT Timestamp(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UPDATEDAT Timestamp(6) WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT A_PEOPLE_PK PRIMARY KEY (ID) 
);

--DROP TABLE A_CATS;
CREATE TABLE A_CATS 
(
  PEOPLE_ID DOUBLE PRECISION NOT NULL, 
  ID DOUBLE PRECISION NOT NULL, 
  NAME VARCHAR(50), 
  TITLE VARCHAR(50), 
  AGE DOUBLE PRECISION, 
  SKILL VARCHAR(50), 
  CONSTRAINT A_CATS_PK PRIMARY KEY (PEOPLE_ID,ID) 
);

--DROP TABLE A_DOGS;
CREATE TABLE A_DOGS 
(
  PEOPLE_ID DOUBLE PRECISION NOT NULL, 
  ID DOUBLE PRECISION NOT NULL, 
  NAME VARCHAR(50), 
  TITLE VARCHAR(50), 
  AGE DOUBLE PRECISION, 
  SKILL VARCHAR(50), 
  CONSTRAINT A_DOGS_PK PRIMARY KEY (PEOPLE_ID,ID) 
);

--DROP TABLE A_BIRDS;
CREATE TABLE A_BIRDS 
(
  PEOPLE_ID DOUBLE PRECISION NOT NULL, 
  ID DOUBLE PRECISION NOT NULL, 
  NAME VARCHAR(50), 
  TITLE VARCHAR(50), 
  AGE DOUBLE PRECISION, 
  SKILL VARCHAR(50), 
  CONSTRAINT A_BIRDS_PK PRIMARY KEY (PEOPLE_ID,ID) 
);

-- If re-running the below inserts, then delete all rows and
-- reset the auto-increment of the ID column.

BEGIN WORK;

DELETE from A_PEOPLE;
DELETE from A_BIRDS;
DELETE from A_CATS;
DELETE from A_DOGS;

-- A_PEOPLE inserts
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (1, 'Baroni', 'Kevin & ' || 'Carrie');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (2, 'Kirkland', 'Mike');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (3, 'Brizzee', 'Nathan & ' || 'Tisha');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (4, 'Eggers', 'David & ' || 'Wendy');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (5, 'Aziz', 'Nurthin');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (6, 'Jon', 'Wegsteen');
INSERT INTO A_PEOPLE
  (ID, LASTNAME, FIRSTNAME)
VALUES
  (7, 'Jeffery', 'Funk');
  
  
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
  (1, 6, 'Shilo', 'Friendly German', 11, 'Making friends with all people & ' || 'animals');
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
-- Nathan Brizzee inserts
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

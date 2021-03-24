BEGIN TRANSACTION;

-- Create tables
DROP TABLE [dbo].[a_people];
CREATE TABLE [dbo].[a_people]
(
  [id] [int] IDENTITY(1,1) NOT NULL,
  [lastname] [nvarchar](50) NOT NULL,
  [firstname] [nvarchar](50) NOT NULL,
  [location] [nvarchar](50) NOT NULL,
  [createdat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  [updatedat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  CONSTRAINT a_people_pk PRIMARY KEY (id) 
);
SET ANSI_PADDING ON;
CREATE NONCLUSTERED INDEX [a_people_lastname_firstname] ON [dbo].[a_people]
(
	[lastname] ASC,
	[firstname] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
;

DROP TABLE [dbo].[a_cats];
CREATE TABLE [dbo].[a_cats] 
(
  [people_id] [int] NOT NULL, 
  [id] [int] IDENTITY(1,1) NOT NULL,
  [name] [nvarchar](50) NOT NULL, 
  [title] [nvarchar](50) NOT NULL, 
  [age] [float] NOT NULL, 
  [skill] [nvarchar](50) NOT NULL, 
  [createdat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  [updatedat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  CONSTRAINT a_cats_pk PRIMARY KEY (people_id,id) 
);

DROP TABLE [dbo].[a_dogs];
CREATE TABLE [dbo].[a_dogs] 
(
  [people_id] [int] NOT NULL, 
  [id] [int] IDENTITY(1,1) NOT NULL,
  [name] [nvarchar](50) NOT NULL, 
  [title] [nvarchar](50) NOT NULL, 
  [age] [float] NOT NULL, 
  [skill] [nvarchar](50) NOT NULL, 
  [createdat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  [updatedat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  CONSTRAINT a_dogs_pk PRIMARY KEY (people_id,id) 
);

DROP TABLE [dbo].[a_birds];
CREATE TABLE [dbo].[a_birds] 
(
  [people_id] [int] NOT NULL, 
  [id] [int] IDENTITY(1,1) NOT NULL,
  [name] [nvarchar](50) NOT NULL, 
  [title] [nvarchar](50) NOT NULL, 
  [age] [float] NOT NULL, 
  [skill] [nvarchar](50) NOT NULL, 
  [createdat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  [updatedat] Datetimeoffset(6) NOT NULL DEFAULT GETDATE(),
  CONSTRAINT a_birds_pk PRIMARY KEY (people_id,id) 
);

COMMIT TRANSACTION;

-- If re-running the below inserts, then delete all rows and
-- reset the auto-increment of the ID column.

BEGIN TRANSACTION;

DELETE from a_people;
DELETE from a_birds;
DELETE from a_cats;
DELETE from a_dogs;

--DBCC CHECKIDENT (a_people, RESEED, 0);
--DBCC CHECKIDENT (a_birds, RESEED, 0);
--DBCC CHECKIDENT (a_cats, RESEED, 0);
--DBCC CHECKIDENT (a_dogs, RESEED, 0);

SET QUOTED_IDENTIFIER ON;

-- Seed data into tables

-- A_PEOPLE
-- ID: 1
INSERT INTO [dbo].[a_people]
  (LASTNAME, FIRSTNAME, LOCATION)
VALUES
  ('Baroni', 'Kevin & Carrie', 'Lincoln, CA');
-- ID: 2
INSERT INTO [dbo].[a_people]
  (LASTNAME, FIRSTNAME, LOCATION)
VALUES
  ('Kirkland', 'Mike', 'Rancho Cordova, CA');
-- ID: 3
INSERT INTO [dbo].[a_people]
  (LASTNAME, FIRSTNAME, LOCATION)
VALUES
  ('Brizzee', 'Nathan & Tisha', 'Folsom, CA');
-- ID: 4
INSERT INTO [dbo].[a_people]
  (LASTNAME, FIRSTNAME, LOCATION)
VALUES
  ('Eggers', 'David & Wendy', 'Folsom, CA');
-- ID: 5
INSERT INTO [dbo].[a_people]
  (LASTNAME, FIRSTNAME, LOCATION)
VALUES
  ('Aziz', 'Nurthin', 'Sacramento, CA');
-- ID: 6
INSERT INTO [dbo].[a_people]
  (LASTNAME, FIRSTNAME, LOCATION)
VALUES
  ('Jon', 'Wegsteen', 'Sacramento, CA');
-- ID: 7
INSERT INTO [dbo].[a_people]
  (LASTNAME, FIRSTNAME, LOCATION)
VALUES
  ('Jeffery', 'Funk', 'Folsom, CA');

-- Kevin Baroni inserts
-- A_CATS
INSERT INTO [dbo].[a_cats]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Tommy', 'Simease Badass', 12, 'Pouncer');
INSERT INTO [dbo].[a_cats]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Sammy', 'Sweet Tabby', 10, 'Pouncer');
INSERT INTO [dbo].[a_cats]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Sateeva', 'Black Beauty', 8, 'Making babies');
-- A_DOGS
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Tia', 'Queen of the House', 16.5, 'Getting what she wants');
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Troy', 'The Trojan of Troy', 12, 'Getting noticed');
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Cleo', 'Cleopatra the Lover', 12, 'Flipping your hand up');
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Luke', 'King', 7, 'Licking your face');
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Flaco', 'King', 8, 'Protecting the family');
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Shilo', 'Friendly German', 11, 'Making friends with all people & animals');
-- A_BIRDS
INSERT INTO [dbo].[a_birds]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Cinder', 'Cockataurus', 21.5, 'Whistles while he plays and works');
INSERT INTO [dbo].[a_birds]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Pepper', 'FlyBoy', 5, 'Getting into odd places');
INSERT INTO [dbo].[a_birds]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Tweety', 'ParaTrooper', 8, 'Coming when called');
INSERT INTO [dbo].[a_birds]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Ditto', 'WildMan', 18, 'Flying upside down');
INSERT INTO [dbo].[a_birds]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (1, 'Vito', 'FightingMan', 7, 'Biting!!!');

-- Mike Kirkland inserts
-- A_CATS
INSERT INTO [dbo].[a_cats]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 'Clio', 'Head Mouser', 17, 'Hunter');
INSERT INTO [dbo].[a_cats]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 'Meeko', 'Jr Mouser', 1, 'Pouncer');
INSERT INTO [dbo].[a_cats]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 'Koda', 'Jr Mouser', 1, 'Stalker');
-- A_DOGS
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 'Fido', 'Head Bowser', 9, 'Car Chasing');
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 'Fredie', 'Jr Bowser', 2, 'Barking');
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (2, 'Bowser', 'Bowser', 7, 'Ball Chasing');

-- Nathan Brizzee inserts
-- A_CATS
INSERT INTO [dbo].[a_cats]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (3, 'Maizi', 'Tortoiseshell Dilute', 8, 'Chillin up high');
-- A_DOGS
INSERT INTO [dbo].[a_dogs]
  (PEOPLE_ID, NAME, TITLE, AGE, SKILL)
VALUES
  (3, 'Max', 'German Shepherd', 5, 'Whining for Momma');

COMMIT TRANSACTION;

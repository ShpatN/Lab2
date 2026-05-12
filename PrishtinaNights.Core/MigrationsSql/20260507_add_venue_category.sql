
-- Adds real DB-backed category support for venues.
IF COL_LENGTH('Venues','Category') IS NULL
BEGIN
    ALTER TABLE Venues
    ADD Category NVARCHAR(100) NOT NULL
        CONSTRAINT DF_Venues_Category DEFAULT('Lounge');
END;

UPDATE v
SET Category =
    CASE
        WHEN v.Name LIKE '%club%' THEN 'Club'
        WHEN v.Name LIKE '%bar%' THEN 'Bar'
        WHEN v.Name LIKE '%roof%' THEN 'Rooftop'
        WHEN v.Name LIKE '%lounge%' THEN 'Lounge'
        WHEN v.Name LIKE '%music%' OR v.Description LIKE '%music%' THEN 'Live Music'
        ELSE CASE (v.Id % 5)
            WHEN 0 THEN 'Club'
            WHEN 1 THEN 'Bar'
            WHEN 2 THEN 'Lounge'
            WHEN 3 THEN 'Rooftop'
            ELSE 'Live Music'
        END
    END
FROM Venues v;

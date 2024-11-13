-- Insert countries
INSERT INTO geolocation_database.countries (iso3, iso2, country_name)
VALUES
  ('aus', 'au', 'australia'),
  ('idn', 'id', 'indonesia');

-- Insert states
INSERT INTO geolocation_database.states (state_name, country)
VALUES
  ('australian capital territory', 'aus'),
  ('western australia', 'aus'),
  ('northern territory', 'aus'),
  ('south australia', 'aus'),
  ('queensland', 'aus'),
  ('new south wales', 'aus'),
  ('victoria', 'aus'),
  ('tasmania', 'aus'),
  ('east java', 'idn');

-- Insert cities
INSERT INTO geolocation_database.cities (city_name, state_id, lat, lon)
VALUES
  ('perth', 2, -31.9558933, 115.8605855),
  ('albany', 2, -35.022778, 117.881386),
  ('canberra', 1, -35.2975906, 149.1012676),
  ('melbourne', 7, NULL, NULL), -- Assuming NULL for lat and lon
  ('surabaya', 9, -7.250445, 112.768845);
INSERT INTO `geolocation_database`.`countries` (`iso3`, `iso2`,`country_name`) VALUES ('aus', 'au', 'australia');
INSERT INTO `geolocation_database`.`countries` (`iso3`, `iso2`,`country_name`) VALUES ('idn', 'id', 'indonesia');

INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('australian capital territory', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('western australia', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('northern territory', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('south australia', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('queensland', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('new south wales', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('victoria', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('tasmania', 'aus');
INSERT INTO `geolocation_database`.`states` (`state_name`, `country`) VALUES ('east java', 'idn');

INSERT INTO `geolocation_database`.`cities` (`city_name`, `state_id`, `lat`, `lon`) VALUES ('perth', '2', '-31.9558933','115.8605855');
INSERT INTO `geolocation_database`.`cities` (`city_name`, `state_id`, `lat`, `lon`) VALUES ('albany', '2', '-35.022778','117.881386');
INSERT INTO `geolocation_database`.`cities` (`city_name`, `state_id`, `lat`, `lon`) VALUES ('canberra', '1', '-35.2975906','149.1012676');
INSERT INTO `geolocation_database`.`cities` (`city_name`, `state_id`) VALUES ('melbourne', '7');
INSERT INTO `geolocation_database`.`cities` (`city_name`, `state_id`, `lat`, `lon`) VALUES ('surabaya', '9', '-7.250445','112.768845');
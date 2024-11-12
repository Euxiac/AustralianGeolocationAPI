SELECT ci.city_name, 
st.state_name, 
co.country_name,
co.iso3, 
ci.lat, 
ci.lon

FROM cities ci

JOIN states st
ON ci.state_id = st.state_id

JOIN countries co
ON st.country = co.iso3

WHERE 
	ci.city_name = "perth"
    AND st.state_name = "western australia"
    AND co.iso3 = "aus"
    AND ci.lat IS NOT NULL
    AND ci.lon IS NOT NULL

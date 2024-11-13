DELETE ci
FROM cities ci

JOIN states st
ON ci.state_id = st.state_id

JOIN countries co
ON st.country = co.iso3

WHERE 
co.iso3 = "aus"
AND st.state_name = "victoria"
AND ci.city_name = "melbourne";
UPDATE cities ci
SET 
ci.lat = "-37.8142454", 
ci.lon = "144.9631732"
WHERE 
ci.city_id = "4"
AND ci.city_name = "melbourne"
;
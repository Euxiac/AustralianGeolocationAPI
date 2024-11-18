function convert(type, query) {
    switch (type) {
        case 'iso':
            return convertToCountryName();

        case 'country_name':
            return convertToISO();
    
        default:
            break;
    }


    const convertToISO = () =>  {
        try {
            const data = await
        } catch (error) {
            throw new Error(`Error fetching coordinates from query: ${error.message}`);
          }
    }

    const convertToCountryName = () => {

    }
}
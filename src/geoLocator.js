import { onUnmounted, onMounted, ref } from "vue";
import { Loader } from '@googlemaps/js-api-loader'


export function getGeoLocation() {
    const coords = ref({latitude: 0, longitude: 0})
    const isSupported = 'navigator' in window && 'geolocation' in navigator

    let check_location = null
    onMounted(() => {
        if (isSupported)
            check_location = navigator.geolocation.watchPosition(
                position => (coords.value = position.coords)
            )
    })
    onUnmounted(() => {
        if (check_location)
            navigator.geolocation.clearWatch(check_location)
    })
    return {coords, isSupported}
}

// export function translateLocation(latlng){
//     const loader = new Loader({apiKey: GOOGLE_MAPS_API_KEY})
//     onMounted(async () => {
//         await loader.load()
//         google.maps.Geocoder().geocode({location: latlng}).then((response) =>{
//             if(response.results[0]){
//                 return response.results[0].formatted_address;
//             } else{
//                 console.long("Error unknown")
//             }
//         })
//     })
// }

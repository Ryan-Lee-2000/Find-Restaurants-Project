import { onUnmounted, onMounted, ref } from "vue";

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

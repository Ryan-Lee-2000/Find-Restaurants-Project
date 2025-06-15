<script>
/* eslint-disable no-undef */
import {computed, ref, onMounted} from 'vue'
import {getGeoLocation} from './geoLocator.js'
import { Loader } from '@googlemaps/js-api-loader'

//https://developers.google.com/maps/documentation/places/web-service/data-fields
export default {
  name: 'App',
  setup() {
    const { coords } = getGeoLocation()
    const currPos = computed(() => ({
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }))
    const g_key = import.meta.env.VITE_G_KEY

    const places = ref()
    const current_address = ref()

    const loader = new Loader({apiKey: g_key})

    const photo_address_pt1 = "https://places.googleapis.com/v1/"

    const photo_address_pt2 = "/media?maxHeightPx=400&maxWidthPx=400&key="
    
    onMounted(async () => {
      await loader.load()
      const {SearchNearbyRankPreference} = await google.maps.importLibrary("places")
      const request = {
      // required parameters
      fields: ["displayName", "formattedAddress", "businessStatus", "rating", 'photos'],
      locationRestriction: {
        center: currPos.value,
        radius: 300,
      },
      // optional parameters
      includedPrimaryTypes: ["restaurant"],
      maxResultCount: 20,
      rankPreference: SearchNearbyRankPreference.POPULARITY,
      language: "en-US",
      region: "us",
      };
      places.value  = await google.maps.places.Place.searchNearby(request)
      for(let i = 0; i < cars.length; i++){
        //I gotta rework the whole data structure...
      }

      const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ coords.value.latitude +','+ coords.value.longitude +'&result_type=street_address&key=' + g_key);
      current_address.value = await response.json(); //extract JSON from the http response
      current_address.value = current_address.value.results[0].formatted_address
    })

    return{ currPos, places, current_address }
  }
}

</script>


<template>
  <div class="d-flex text-center" style="height: 20vh;">
    <div class="m-auto text-center">
      <h2>Your Position</h2>
      Estimated Location: {{ current_address }}
      <div v-for="place_arr in places">
        <DataView :value="place_arr" paginator :rows="5">
          <template #list="slotProps">
              <div v-for="(place, index) in slotProps.items">
                <!-- {{ console.log(place) }} -->
                <div style="display: flex; flex-direction: row;flex-wrap: wrap; margin-top: 10px; border: solid; border-width: 0.5px; border-color: white; padding: 5px;">
                  <div style="display: flex;width: 100px;min-width: 100px; align-items: stretch; min-height: 100px; background-color: aliceblue; margin-right: 10px;">
                    <Image src={{place.photos[0].name}} alt="Image" width="100" preview />
                  </div>
                  <div>
                    <div style="display: flex;font-size: x-large; font-weight: 800;">{{place.displayName}}</div>
                      <div>{{ place.formattedAddress }}</div>
                        <Rating v-model="place.rating" :stars="5" readonly/>
                        <br/>
                      <div>{{ place.businessStatus}}</div>
                    </div>
                  </div>
                  
              </div>
          </template>
        </DataView>
      </div>
      
      
    </div>
  </div>
</template>

<style scoped>

</style>

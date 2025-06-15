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
    const final_list = ref()

    const loader = new Loader({apiKey: g_key})

    const photo_address_pt1 = "https://places.googleapis.com/v1/"

    const photo_address_pt2 = "/media?maxHeightPx=400&maxWidthPx=400&key=" + g_key

    const blank = ""
    
    onMounted(async () => {
      await loader.load()
      const {SearchNearbyRankPreference} = await google.maps.importLibrary("places")
      const request = { //request builder for places api call
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
      places.value  = await google.maps.places.Place.searchNearby(request) //places api call

      //extract data from api call into a usable array
      const list_of_restaurants = [] 
      for(let i = 0; i < Object.keys(places.value.places).length; i++){
        const place_name = places.value.places[i].displayName
        const place_address = places.value.places[i].formattedAddress
        const place_status = places.value.places[i].businessStatus
        const place_rating = places.value.places[i].rating
        const place_photo = photo_address_pt1 + places.value.places[i].photos[0].name + photo_address_pt2

        list_of_restaurants.push([place_name, place_address, place_status, place_rating, place_photo])
      }

      final_list.value = list_of_restaurants //final list of restaurants

      const response = await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+ coords.value.latitude +','+ coords.value.longitude +'&result_type=street_address&key=' + g_key);
      const res_data = await response.json(); //extract JSON from the http response
      current_address.value = res_data.results[0].formatted_address //Retrieve readable address
    })

    return{current_address, final_list }
  }
}

</script>


<template>
  <div class="d-flex text-center" style="height: 20vh;">
    <div class="m-auto text-center">
      <h2>Your Position</h2>
      Estimated Location: {{ current_address }}
      <DataView :value="final_list" paginator :rows="5">
          <template #list="slotProps">
              <div v-for="(place, index) in slotProps.items">
                <div style="display: flex; flex-direction: row;flex-wrap: wrap; margin-top: 10px; border: solid; border-width: 0.5px; border-color: white; padding: 5px;">
                  <div style="display: flex;width: 100px;min-width: 100px; max-height: 100px; min-height: 100px; background-color: aliceblue; margin-right: 10px; object-fit: cover;">
                    <Image v-bind:src="place[4]" alt="Image" width="100" preview  />
                  </div>
                  <div>
                    <div style="display: flex;font-size: x-large; font-weight: 800;">{{place[0]}}</div>
                      <div>{{ place[1] }}</div>
                        <Rating v-model="place[3]" :stars="5" readonly/>
                        <br/>
                      <div>{{ place[2]}}</div>
                    </div>
                  </div>
                  
              </div>
          </template>
        </DataView>
      
      
    </div>
  </div>
</template>

<style scoped>

</style>

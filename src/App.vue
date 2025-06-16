<script>
/* eslint-disable no-undef */
import {computed, ref, onMounted} from 'vue'
import {getGeoLocation} from './geoLocator.js'
import { Loader } from '@googlemaps/js-api-loader'
import { isEmpty } from 'vuetify/lib/util/helpers.js'

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
      console.log(places.value)
      for(let i = 0; i < Object.keys(places.value.places).length; i++){
        const place_name = places.value.places[i].displayName
        const place_address = places.value.places[i].formattedAddress
        const place_status = places.value.places[i].businessStatus
        const place_rating = places.value.places[i].rating
        var place_photo = ""
        if(isEmpty(places.value.places[i].photos[0])){
          place_photo = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png"
        }else{
          place_photo = photo_address_pt1 + places.value.places[i].photos[0].name + photo_address_pt2
        }
        

        list_of_restaurants.push([place_name, place_address, place_status, place_rating, place_photo, false])
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
      <h2>Restaurant Finder</h2>
      Estimated Location: {{ current_address }}
      <DataView :value="final_list" paginator :rows="5">
          <template #list="slotProps">
              <div v-for="(place, index) in slotProps.items">
                <div style="display: flex; flex-direction: row;flex-wrap: wrap; margin-top: 10px; border: solid; border-width: 0.5px; border-color: white; padding: 5px; max-height: 110px;">
                  <div style="display: flex;width: 100px;min-width: 100px; max-height: 100px; min-height: 100px; background-color: aliceblue; margin-right: 10px; object-fit: cover;">
                    <Image v-bind:src="place[4]" alt="Image" width="100" preview  />
                  </div>
                  <div style="display: flex; flex-direction: column; ">
                    <div style="display: flex;font-size: x-large; font-weight: 800;">{{place[0]}}</div>
                      <div>{{ place[1] }}</div>
                      <div style="display: table; margin-right: auto; margin-top: auto;">
                        <div style="display: table-row;">
                          <p style="display: table-cell; text-align: center;vertical-align: middle; font-size: large; font-weight: 300;">{{ place[3] }}</p>
                            <div style="display: table-cell;">
                              <Rating style="margin-left: 10px;" v-model="place[3]" :stars="5" readonly/>
                            </div>
                            <Button label="Show More" @click="place[5] = true" style="width: 120px; height: 30px; margin-left: 10px;"></Button>
                          </div>
                        </div>
                      <!-- <div style="align-self: flex-end;margin-top: auto;margin-right: auto;">{{ place[2]}}</div> -->
                       
                       <Dialog v-model:visible="place[5]" modal header="More Details" :style="{ width: '25rem' }">
                          <template #header>
                              <div style="display: inline-flex; align-items: center; justify-items: center; gap: 2;">
                                  <Avatar v-bind:image="place[4]" shape="circle" style="margin-right: 10px;"/>
                                  <span cstyle="font: bold; margin-left: 10px;white-space: preserve nowrap;">{{place[0]}}</span>
                              </div>
                          </template>
                       </Dialog>
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

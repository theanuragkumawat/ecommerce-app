import { createSlice } from "@reduxjs/toolkit";

const initialState = {
addressList : []
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers : {
        addAddress: function(state, action) {
      // Check if the payload is an array
      if (Array.isArray(action.payload)) {
        // action.payload.forEach(address => {
        //   state.addressList.push(address);
        // });
        state.addressList = action.payload

      } else {
        // If it's a single object, just push it
        state.addressList.push(action.payload);
      }
    }
    }
})

export const {addAddress} = addressSlice.actions
export default addressSlice.reducer
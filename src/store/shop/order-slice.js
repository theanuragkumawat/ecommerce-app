import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    approvalURL:null,
    isLoading:false,
    orders: []
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        addOrdersToState: function (state,action){
             if (Array.isArray(action.payload)) {
                 state.orders = action.payload
             } else{
                state.orders.push(action.payload)
             }
        }
    }
})

export const {addOrdersToState} = orderSlice.actions
export default orderSlice.reducer
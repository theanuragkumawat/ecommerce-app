import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    approvalURL:null,
    isLoading:false,
    order: null
}

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        addOrdersToState: function (state,action){
            state.orderId = action.payload.orderId
            state.approvalURL = action.payload.approvalURL
        }
    }
})

export const {} = orderSlice.actions
export default orderSlice.reducer
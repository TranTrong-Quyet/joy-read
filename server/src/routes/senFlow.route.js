import express from "express";

/**
 * Import route logic
 */
import { addSenFlow, getSenFlow } from "../controllers/senFlow.controller.js";

//
const senFlowRouter = express.Router({ mergeParams: true });
/*
    |--------------------------------------------------------------------------
    | Define route
    |--------------------------------------------------------------------------
    */

senFlowRouter.get("/", getSenFlow);
senFlowRouter.post("/", addSenFlow);

export default senFlowRouter;
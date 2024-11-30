import express from "express";
import { createBook } from "../controllers/book.controller.js";

const router = express.Router();
/*
    |--------------------------------------------------------------------------
    | Controllers
    |--------------------------------------------------------------------------
    */

router.post("/create", createBook);

export default router;

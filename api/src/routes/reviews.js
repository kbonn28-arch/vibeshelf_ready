import express from 'express';
import Joi from 'joi';
import { supabase } from '../lib/supabase.js';
const router = express.Router();
const schema=Joi.object({user_id:Joi.string().uuid().required(),book_id:Joi.string().uuid().required(),star_rating:Joi.number().integer().min(1).max(5).required(),review_text:Joi.string().min(2).required(),is_public:Joi.boolean().default(true)});
router.get('/', async (req,res)=>{ let q=supabase.from('review').select('*').eq('is_public',true).order('review_date',{ascending:false}); if(req.query.book_id) q=q.eq('book_id',req.query.book_id); const {data,error}=await q; if(error) return res.status(400).json({error:error.message}); res.json(data); });
router.post('/', async (req,res)=>{ const {error,value}=schema.validate(req.body,{stripUnknown:true}); if(error) return res.status(400).json({error:error.details[0].message}); const out=await supabase.from('review').insert(value).select().single(); if(out.error) return res.status(400).json({error:out.error.message}); res.status(201).json(out.data); });
export default router;

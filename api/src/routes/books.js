import express from 'express';
import Joi from 'joi';
import { supabase } from '../lib/supabase.js';
const router = express.Router();
const schema = Joi.object({ title:Joi.string().required(), author:Joi.string().required(), isbn:Joi.string().allow('',null), genre:Joi.string().allow('',null), cover_image:Joi.string().allow('',null), description:Joi.string().allow('',null) });
router.get('/', async (req,res)=>{ let q=supabase.from('book_with_rating').select('*').order('title'); if(req.query.search) q=q.or(`title.ilike.%${req.query.search}%,author.ilike.%${req.query.search}%,genre.ilike.%${req.query.search}%`); const {data,error}=await q; if(error) return res.status(400).json({error:error.message}); res.json(data); });
router.get('/:id', async (req,res)=>{ const {data,error}=await supabase.from('book_with_rating').select('*').eq('book_id',req.params.id).single(); if(error) return res.status(404).json({error:'Book not found'}); res.json(data); });
router.post('/', async (req,res)=>{ const {error,value}=schema.validate(req.body,{stripUnknown:true}); if(error) return res.status(400).json({error:error.details[0].message}); const out=await supabase.from('book').insert(value).select().single(); if(out.error) return res.status(400).json({error:out.error.message}); res.status(201).json(out.data); });
export default router;

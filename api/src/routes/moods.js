import express from 'express';
import { supabase } from '../lib/supabase.js';
const router = express.Router();
router.get('/', async (req,res)=>{ const {data,error}=await supabase.from('mood').select('*').order('name'); if(error) return res.status(400).json({error:error.message}); res.json(data); });
router.get('/:moodId/recommendations', async (req,res)=>{ const {data,error}=await supabase.from('book_mood').select('book:book_id(*)').eq('mood_id',req.params.moodId); if(error) return res.status(400).json({error:error.message}); res.json(data.map(x=>x.book)); });
export default router;

const express=require('express');
const cors=require('cors');
const axios=require('axios');

const app=express();
app.use(cors());
app.use(express.json());

app.post('/leetcode',async (req, res) =>
{
  try
  {
    const response=await axios.post('https://leetcode.com/graphql',req.body,{headers:{'Content-Type':'application/json'}});
    res.json(response.data);
  } 
  catch(error)
  {
    res.status(500).json({error:'Failed to fetch from LeetCode'});
  }
});

app.listen(3000,()=>console.log('Server Started'));

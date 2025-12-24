import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';


export default function Products(){
const [products,setProducts] = useState([]);
const [q,setQ] = useState('');


useEffect(()=>{ fetchProducts(); },[]);


const fetchProducts = async(query='')=>{
const { data } = await api.get(`/products${query?`?q=${encodeURIComponent(query)}`:''}`);
setProducts(data);
};


return (
<div className="container">
<div style={{display:'flex',gap:8, marginBottom:16}}>
<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products..." style={{flex:1,padding:8}}/>
<button className="btn" onClick={()=>fetchProducts(q)}>Search</button>
</div>
<div className="grid products">
{products.map(p=> (
<div className="card" key={p._id}>
<img src={p.image} alt={p.name} style={{width:'100%',height:160,objectFit:'cover',borderRadius:8}}/>
<h3 style={{margin:'10px 0'}}>{p.name}</h3>
<p style={{fontWeight:700}}>R {p.price}</p>
<Link to={`/product/${p._id}`} className="btn primary" style={{marginTop:8}}>View</Link>
</div>
))}
</div>
</div>
);
}
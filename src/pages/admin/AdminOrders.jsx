import React, { useEffect, useState } from 'react';
import api from '../../services/api';


export default function AdminOrders(){
const [orders, setOrders] = useState([]);
const load = () => api.get('/api/orders').then(({data}) => setOrders(data));
useEffect(() => { load(); }, []);


const update = async (id, status) => { await api.put(`/api/orders/${id}/status`, { status }); load(); };


return (
<div>
<h3>Orders</h3>
{orders.map(o => (
<div key={o._id} className="card" style={{marginBottom:'1rem'}}>
<div className="card-body">
<div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
<div>
<strong>#{o._id.substring(0,6)}</strong> — {o.user?.name} — {new Date(o.createdAt).toLocaleString()}
<div className="badge">{o.status}</div>
</div>
<select className="input" value={o.status} onChange={e=> update(o._id, e.target.value)}>
<option value="pending">pending</option>
<option value="paid">paid</option>
<option value="shipped">shipped</option>
<option value="delivered">delivered</option>
<option value="cancelled">cancelled</option>
</select>
</div>
<ul>
{o.orderItems.map((i, idx) => (
<li key={idx}>{i.name} × {i.qty} @ R{i.price}</li>
))}
</ul>
<div>Total: <strong>R{o.totalPrice}</strong></div>
</div>
</div>
))}
</div>
);
}
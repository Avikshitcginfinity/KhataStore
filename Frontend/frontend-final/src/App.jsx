import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';

function App() {
  const [page, setPage] = useState(1);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetch('https://khatastore-dbbnd5cehnh4ehdq.centralindia-01.azurewebsites.net/api/customers')
      .then(res => res.json())
      .then(data => {
          setCustomers(data);
      })
      .catch(err => console.error("Error fetching customers:", err));
  }, []);

  const handleNext = () => {
    setPage(2);
    fetch('https://khatastore-dbbnd5cehnh4ehdq.centralindia-01.azurewebsites.net/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error("Error fetching items:", err));
  };

  const addToCart = (item, qty) => {
     let newCart = [...cart];
     let found = false;
     for(let i = 0; i < newCart.length; i++) {
         if(newCart[i].itemId === item.id) {
             newCart[i].quantity += parseInt(qty);
             found = true;
         }
     }
     if(!found) {
         newCart.push({
             itemId: item.id, name: item.name, price: item.price, quantity: parseInt(qty)
         });
     }
     setCart(newCart);
  };

  const generateBill = () => {
     fetch('https://khatastore-dbbnd5cehnh4ehdq.centralindia-01.azurewebsites.net/api/invoice', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ customerId: selectedCustomer.id, items: cart })
     }).then(res => res.json())
       .then(data => {
            setInvoice(data);
            setPage(3);
       })
       .catch(err => console.error("Error generating bill:", err));
  };

  const downloadPDF = () => {
    const element = document.getElementById('invoice-capture');
    const opt = {
      margin: 0.5,
      filename: `KhataStore_Invoice_${invoice.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="app-container">
      <h1>
        KhataStore Billing
      </h1>
      
      {page === 1 && (
        <div>
          <h3 className="peach-heading">Select a Customer</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '30px 0' }}>
            {customers.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <input
                  type="radio"
                  name="customerRadio"
                  style={{ transform: 'scale(1.5)', cursor: 'pointer', margin: '0 16px 0 8px' }}
                  onChange={() => setSelectedCustomer(c)}
                /> 
                <label style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600', cursor: 'pointer' }}>
                  {c.name}
                </label>
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={handleNext} disabled={!selectedCustomer}>
            Continue to Items
          </button>
        </div>
      )}

      {page === 2 && (
        <div>
          <h3 className="peach-heading">Add Items for {selectedCustomer?.name}</h3>
          
          <div className="table-responsive">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>Rs. {item.price}</td>
                    <td>
                      <div className="action-cell">
                        <input type="number" id={`qty-${item.id}`} defaultValue="1" min="1" className="qty-input" />
                        <button className="btn-add" onClick={() => {
                          const qty = document.getElementById(`qty-${item.id}`).value;
                          addToCart(item, qty);
                        }}>Add</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="cart-box">
              <h4>Current Cart</h4>
              {cart.length === 0 ? <p className="empty-cart">No items added yet</p> : (
                  <ul className="cart-list">
                    {cart.map((c, index) => (
                       <li key={index}>
                         <span>{c.name}</span>
                         <span>x{c.quantity}</span>
                       </li>
                    ))}
                  </ul>
              )}
          </div>
          
          <button className="btn-primary" onClick={generateBill} disabled={cart.length === 0}>
            Generate Final Bill
          </button>
        </div>
      )}

      {page === 3 && invoice && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          
          <div id="invoice-capture" className="invoice-template">
            
            <div className="invoice-header">
              <div>
                <h2 style={{ margin: 0, color: '#000', fontSize: '24px' }}>KhataStore</h2>
                <div style={{ fontSize: '14px', color: '#555' }}>Delhi, India</div>
                <div style={{ fontSize: '14px', color: '#555' }}>GSTIN: 22AAAAA0000A1Z5</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h1 style={{ margin: 0, color: '#e11d48', fontSize: '28px', letterSpacing: '0px' }}>KhataStore</h1>
              </div>
            </div>

            <div className="invoice-title">INVOICE</div>

            <div className="invoice-meta">
              <div>
                <strong>Bill To:</strong><br />
                {selectedCustomer.name}<br />
                Local Customer
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>Invoice No.:</strong> {invoice.id}<br />
                <strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}
              </div>
            </div>

            <div className="table-responsive">
              <table className="invoice-table-pdf">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Item name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Price/ Unit</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((c, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{c.name}</td>
                      <td>{c.quantity}</td>
                      <td>Pcs</td>
                      <td>₹ {c.price.toFixed(2)}</td>
                      <td>₹ {(c.price * c.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="2">Total</td>
                    <td>{cart.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td></td>
                    <td></td>
                    <td>₹ {invoice.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="invoice-footer">
              <div className="footer-left">
                <strong>INVOICE AMOUNT IN WORDS</strong>
                <div className="grey-bg">
                  Rupees {(invoice.totalAmount * 1.18).toFixed(2)} Only
                </div>
                <strong>TERMS AND CONDITIONS</strong>
                <div className="grey-bg">
                  Thanks for doing business with us !
                </div>
              </div>
              
              <div className="footer-right">
                <div className="footer-row">
                  <span>GST (18%)</span>
                  <span>₹ {(invoice.totalAmount * 0.18).toFixed(2)}</span>
                </div>
                <div className="footer-row footer-grand-total">
                  <span>Total</span>
                  <span>₹ {(invoice.totalAmount * 1.18).toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>

          <button className="btn-secondary" onClick={downloadPDF}>
            DOWNLOAD AS PDF
          </button>

          <button className="btn-primary" onClick={() => window.location.reload()}>
            START NEW BILL
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
using System.Collections.Generic;

namespace BathroomStore
{
    public class InvoiceRequest
    {
        public int CustomerId { get; set; } 
        public List<CartItem>? Items { get; set; }
    }
}
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BathroomStore 
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
    }

    public class Item
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public double Price { get; set; }
    }

    public class CartItem
    {
        [Key]
        public int Id { get; set; }
        public int ItemId { get; set; }
        public string? Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        
        public int InvoiceId { get; set; } 
    }

    public class Invoice
    {
        [Key]
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public List<CartItem>? Items { get; set; }
        public double TotalAmount { get; set; }
    }
    
}
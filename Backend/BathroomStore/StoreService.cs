using System.Collections.Generic;
using System.Linq;
using BathroomStore;

namespace BathroomApp.Services
{
    public class StoreService
    {
        private readonly AppDbContext _context;

        public StoreService(AppDbContext context)
        {
            _context = context;
        }

        public List<Customer> GetAllCustomers()
        {
            return _context.Customers.ToList();
        }

        public List<Item> GetAllItems()
        {
            return _context.Items.ToList();
        }

        public Invoice GenerateInvoice(int customerId, List<CartItem> cartItems)
        {
            // Calculate total
            double totalAmount = cartItems.Sum(item => item.Price * item.Quantity);

            // Create the new invoice
            var invoice = new Invoice
            {
                CustomerId = customerId,
                TotalAmount = totalAmount,
                Items = cartItems 
            };

            // Save to SQL Server
            _context.Invoices.Add(invoice);
            _context.SaveChanges(); 

            return invoice;
        }
    }

}
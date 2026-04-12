using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.DTOs
{
        public class CreatePaymentDTO
        {
            public int UserId { get; set; }
            public int? ReservationId { get; set; }
            public decimal Amount { get; set; }
        }
}

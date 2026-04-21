using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.DTOs
{
    public class UpdatePaymentStatusDTO
    {
        public int PaymentId { get; set; }
        public string Status { get; set; } = null!;
    }
}

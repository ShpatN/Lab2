using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PrishtinaNights.Core.DTOs
{
    public class CreateReservationDTO
    {
        public int UserId { get; set; }
        public int VenueId { get; set; }
        public int? TableId { get; set; }
        public int? EventId { get; set; }
        public DateTime ReservationDate { get; set; }
        public int NumberOfPeople { get; set; }
        public string? SpecialRequests { get; set; }
    }
}

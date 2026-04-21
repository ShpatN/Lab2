using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class TicketTypeService : ITicketTypeService
    {
        private readonly ITicketTypeRepository _ticketTypeRepository;
        private readonly IEventRepository _eventRepository;

        public TicketTypeService(ITicketTypeRepository ticketTypeRepository, IEventRepository eventRepository)
        {
            _ticketTypeRepository = ticketTypeRepository;
            _eventRepository = eventRepository;
        }

        public async Task<IEnumerable<TicketTypeDTO>> GetAllAsync()
        {
            var ticketTypes = await _ticketTypeRepository.GetAllAsync();

            return ticketTypes.Select(t => new TicketTypeDTO
            {
                Id = t.Id,
                EventId = t.EventId,
                Name = t.Name,
                Price = t.Price,
                Quantity = t.Quantity,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                CreatedBy = t.CreatedBy,
                UpdatedBy = t.UpdatedBy
            });
        }

        public async Task<TicketTypeDTO?> GetByIdAsync(int id)
        {
            var ticketType = await _ticketTypeRepository.GetByIdAsync(id);
            if (ticketType == null) return null;

            return new TicketTypeDTO
            {
                Id = ticketType.Id,
                EventId = ticketType.EventId,
                Name = ticketType.Name,
                Price = ticketType.Price,
                Quantity = ticketType.Quantity,
                CreatedAt = ticketType.CreatedAt,
                UpdatedAt = ticketType.UpdatedAt,
                CreatedBy = ticketType.CreatedBy,
                UpdatedBy = ticketType.UpdatedBy
            };
        }

        public async Task<TicketTypeDTO> CreateAsync(CreateTicketTypeDTO dto)
        {
            var eventExists = await _eventRepository.GetByIdAsync(dto.EventId);
            if (eventExists == null)
                throw new Exception("Event not found.");

            var entity = new TicketType
            {
                EventId = dto.EventId,
                Name = dto.Name,
                Price = dto.Price,
                Quantity = dto.Quantity,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _ticketTypeRepository.CreateAsync(entity);

            return new TicketTypeDTO
            {
                Id = created.Id,
                EventId = created.EventId,
                Name = created.Name,
                Price = created.Price,
                Quantity = created.Quantity,
                CreatedAt = created.CreatedAt,
                UpdatedAt = created.UpdatedAt,
                CreatedBy = created.CreatedBy,
                UpdatedBy = created.UpdatedBy
            };
        }

        public async Task<TicketTypeDTO?> UpdateAsync(int id, UpdateTicketTypeDTO dto)
        {
            var existing = await _ticketTypeRepository.GetByIdAsync(id);
            if (existing == null) return null;

            var eventExists = await _eventRepository.GetByIdAsync(dto.EventId);
            if (eventExists == null)
                throw new Exception("Event not found.");

            existing.EventId = dto.EventId;
            existing.Name = dto.Name;
            existing.Price = dto.Price;
            existing.Quantity = dto.Quantity;
            existing.UpdatedAt = DateTime.UtcNow;

            var updated = await _ticketTypeRepository.UpdateAsync(existing);
            if (updated == null) return null;

            return new TicketTypeDTO
            {
                Id = updated.Id,
                EventId = updated.EventId,
                Name = updated.Name,
                Price = updated.Price,
                Quantity = updated.Quantity,
                CreatedAt = updated.CreatedAt,
                UpdatedAt = updated.UpdatedAt,
                CreatedBy = updated.CreatedBy,
                UpdatedBy = updated.UpdatedBy
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _ticketTypeRepository.DeleteAsync(id);
        }
    }
}
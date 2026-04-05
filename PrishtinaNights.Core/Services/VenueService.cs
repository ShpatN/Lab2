using PrishtinaNights.Core.DTOs;
using PrishtinaNights.Core.Models;
using PrishtinaNights.Core.Repositories.Interfaces;
using PrishtinaNights.Core.Services.Interfaces;

namespace PrishtinaNights.Core.Services
{
    public class VenueService : IVenueService
    {
        private readonly IVenueRepository _venueRepository;

        public VenueService(IVenueRepository venueRepository)
        {
            _venueRepository = venueRepository;
        }

        public async Task<IEnumerable<VenueDto>> GetAllAsync()
        {
            var venues = await _venueRepository.GetAllAsync();

            return venues.Select(v => new VenueDto
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                Address = v.Address,
                City = v.City,
                OwnerId = v.OwnerId,
                IsActive = v.IsActive,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt,
                CreatedBy = v.CreatedBy,
                UpdatedBy = v.UpdatedBy
            });
        }

        public async Task<VenueDto?> GetByIdAsync(int id)
        {
            var v = await _venueRepository.GetByIdAsync(id);

            if (v == null) return null;

            return new VenueDto
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                Address = v.Address,
                City = v.City,
                OwnerId = v.OwnerId,
                IsActive = v.IsActive,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt,
                CreatedBy = v.CreatedBy,
                UpdatedBy = v.UpdatedBy
            };
        }

        public async Task<VenueDto> CreateAsync(CreateVenueDto dto)
        {
            var venue = new Venue
            {
                Name = dto.Name,
                Description = dto.Description,
                Address = dto.Address,
                City = dto.City,
                OwnerId = dto.OwnerId,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _venueRepository.AddAsync(venue);

            return new VenueDto
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                Address = created.Address,
                City = created.City,
                OwnerId = created.OwnerId,
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<VenueDto?> UpdateAsync(int id, UpdateVenueDto dto)
        {
            var exists = await _venueRepository.GetByIdAsync(id);
            if (exists == null) return null;

            exists.Name = dto.Name;
            exists.Description = dto.Description;
            exists.Address = dto.Address;
            exists.City = dto.City;
            exists.OwnerId = dto.OwnerId;
            exists.IsActive = dto.IsActive;
            exists.UpdatedAt = DateTime.UtcNow;

            var updated = await _venueRepository.UpdateAsync(exists);

            if (updated == null) return null;

            return new VenueDto
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                Address = updated.Address,
                City = updated.City,
                OwnerId = updated.OwnerId,
                IsActive = updated.IsActive,
                CreatedAt = updated.CreatedAt,
                UpdatedAt = updated.UpdatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _venueRepository.DeleteAsync(id);
        }
    }
}
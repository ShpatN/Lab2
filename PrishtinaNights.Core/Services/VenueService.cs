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

        private static void EnsureOwnerOrAdmin(Venue venue, int actingUserId, bool isAdmin)
        {
            if (isAdmin) return;
            if (venue.OwnerId != actingUserId)
                throw new ForbiddenException("You can only manage venues you own.");
        }

        public async Task<IEnumerable<VenueDTO>> GetAllAsync(VenueSearchQueryDTO? query = null)
        {
            var venues = await _venueRepository.GetAllAsync(query);

            return venues.Select(v => new VenueDTO
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                Address = v.Address,
                City = v.City,
                Category = v.Category,
                OwnerId = v.OwnerId,
                IsActive = v.IsActive,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt,
                CreatedBy = v.CreatedBy,
                UpdatedBy = v.UpdatedBy
            });
        }

        public async Task<VenueDTO?> GetByIdAsync(int id)
        {
            var v = await _venueRepository.GetByIdAsync(id);

            if (v == null) return null;

            return new VenueDTO
            {
                Id = v.Id,
                Name = v.Name,
                Description = v.Description,
                Address = v.Address,
                City = v.City,
                Category = v.Category,
                OwnerId = v.OwnerId,
                IsActive = v.IsActive,
                CreatedAt = v.CreatedAt,
                UpdatedAt = v.UpdatedAt,
                CreatedBy = v.CreatedBy,
                UpdatedBy = v.UpdatedBy
            };
        }

        public async Task<VenueDTO> CreateAsync(CreateVenueDTO dto, int actingUserId, bool isAdmin)
        {
            var ownerId = isAdmin ? dto.OwnerId : actingUserId;

            var venue = new Venue
            {
                Name = dto.Name,
                Description = dto.Description,
                Address = dto.Address,
                City = dto.City,
                Category = string.IsNullOrWhiteSpace(dto.Category) ? "Lounge" : dto.Category.Trim(),
                OwnerId = ownerId,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _venueRepository.AddAsync(venue);

            return new VenueDTO
            {
                Id = created.Id,
                Name = created.Name,
                Description = created.Description,
                Address = created.Address,
                City = created.City,
                Category = created.Category,
                OwnerId = created.OwnerId,
                IsActive = created.IsActive,
                CreatedAt = created.CreatedAt
            };
        }

        public async Task<VenueDTO?> UpdateAsync(int id, UpdateVenueDTO dto, int actingUserId, bool isAdmin)
        {
            var exists = await _venueRepository.GetByIdAsync(id);
            if (exists == null) return null;

            EnsureOwnerOrAdmin(exists, actingUserId, isAdmin);

            exists.Name = dto.Name;
            exists.Description = dto.Description;
            exists.Address = dto.Address;
            exists.City = dto.City;
            exists.Category = string.IsNullOrWhiteSpace(dto.Category) ? exists.Category : dto.Category.Trim();
            exists.OwnerId = isAdmin ? dto.OwnerId : exists.OwnerId;
            exists.IsActive = dto.IsActive;
            exists.UpdatedAt = DateTime.UtcNow;

            var updated = await _venueRepository.UpdateAsync(exists);

            if (updated == null) return null;

            return new VenueDTO
            {
                Id = updated.Id,
                Name = updated.Name,
                Description = updated.Description,
                Address = updated.Address,
                City = updated.City,
                Category = updated.Category,
                OwnerId = updated.OwnerId,
                IsActive = updated.IsActive,
                CreatedAt = updated.CreatedAt,
                UpdatedAt = updated.UpdatedAt
            };
        }

        public async Task<bool> DeleteAsync(int id, int actingUserId, bool isAdmin)
        {
            var exists = await _venueRepository.GetByIdAsync(id);
            if (exists == null) return false;

            EnsureOwnerOrAdmin(exists, actingUserId, isAdmin);

            return await _venueRepository.DeleteAsync(id);
        }
    }
}
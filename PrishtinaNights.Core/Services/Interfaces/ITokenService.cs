using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PrishtinaNights.Core.Models;

namespace PrishtinaNights.Core.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateAccessToken(User user, List<string> roles, List<string> permissions);
        string GenerateRefreshToken();
    }
}
using Microsoft.AspNetCore.Mvc;
using TripPlannerService.Data;
using TripPlannerService.Models;
using TripPlannerService.DTOs;
using Microsoft.EntityFrameworkCore;

namespace TripPlannerService.Controllers;

[ApiController]
[Route("transport-option")]
public class TransportOptionController : ControllerBase
{
    private readonly TripDbContext _context;

    public TransportOptionController(TripDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TransportOptionDto dto)
    {
        var option = new TransportOption
        {
            Type = dto.Type,
            Company = dto.Company,
            Price = dto.Price
        };

        _context.TransportOptions.Add(option);
        await _context.SaveChangesAsync();

        return Ok(option);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var options = await _context.TransportOptions.ToListAsync();
        return Ok(options);
    }
}

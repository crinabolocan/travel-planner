using Microsoft.AspNetCore.Mvc;
using TripPlannerService.Data;
using TripPlannerService.DTOs;
using TripPlannerService.Models;
using Microsoft.EntityFrameworkCore;

namespace TripPlannerService.Controllers;

[ApiController]
[Route("destination")]
public class DestinationController : ControllerBase
{
    private readonly TripDbContext _context;

    public DestinationController(TripDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DestinationDto dto)
    {
        var destination = new Destination
        {
            Name = dto.Name,
            Country = dto.Country,
            Description = dto.Description
        };

        _context.Destinations.Add(destination);
        await _context.SaveChangesAsync();

        return Ok(destination);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var destinations = await _context.Destinations.ToListAsync();
        return Ok(destinations);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] DestinationDto dto)
    {
        var destination = await _context.Destinations.FindAsync(id);
        if (destination == null)
            return NotFound("Destination not found.");

        destination.Name = dto.Name;
        destination.Country = dto.Country;
        destination.Description = dto.Description;

        await _context.SaveChangesAsync();
        return Ok(destination);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var destination = await _context.Destinations.FindAsync(id);
        if (destination == null)
            return NotFound("Destination not found.");

        _context.Destinations.Remove(destination);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Destination deleted." });
    }

}

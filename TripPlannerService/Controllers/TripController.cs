using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlannerService.Data;
using TripPlannerService.DTOs;
using TripPlannerService.Models;

namespace TripPlannerService.Controllers;

[ApiController]
[Route("trip")]
[Authorize]
public class TripController : ControllerBase
{
    private readonly TripDbContext _context;

    public TripController(TripDbContext context)
    {
        _context = context;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateTrip([FromBody] TripDto tripDto)
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
            return Unauthorized();

        var trip = new Trip
        {
            Username = username,
            Destination = tripDto.Destination,
            StartDate = tripDto.StartDate.ToUniversalTime(), 
            EndDate = tripDto.EndDate.ToUniversalTime(),
            Transport = tripDto.Transport,
            Activities = tripDto.Activities
        };

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Trip created" });
    }

    [HttpGet("my-trips")]
    public async Task<IActionResult> GetTrips()
    {
        var username = User.Identity?.Name;
        if (string.IsNullOrEmpty(username))
            return Unauthorized();

        var trips = await _context.Trips
            .Where(t => t.Username == username)
            .ToListAsync();

        return Ok(trips);
    }
}

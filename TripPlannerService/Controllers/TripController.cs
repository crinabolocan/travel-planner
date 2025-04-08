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
        if (tripDto.StartDate >= tripDto.EndDate)
            return BadRequest("StartDate must be earlier than EndDate");

        if (string.IsNullOrWhiteSpace(tripDto.Destination))
            return BadRequest("Destination is required");

        if (string.IsNullOrWhiteSpace(tripDto.Transport))
            return BadRequest("Transport is required");

        var username = User.Identity?.Name;
        if (username == null)
            return Unauthorized();

        var trip = new Trip
        {
            Username = username,
            Destination = tripDto.Destination,
            StartDate = tripDto.StartDate.ToUniversalTime(),
            EndDate = tripDto.EndDate.ToUniversalTime(),
            Transport = tripDto.Transport,
            Activities = tripDto.Activities ?? new List<string>()
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

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrip(int id)
    {
        var username = User.Identity?.Name;
        if (username == null)
            return Unauthorized();

        var trip = await _context.Trips.FindAsync(id);
        if (trip == null || trip.Username != username)
            return NotFound("Trip not found or not yours");

        _context.Trips.Remove(trip);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Trip deleted" });
    }

}

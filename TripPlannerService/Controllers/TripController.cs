using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlannerService.Data;
using TripPlannerService.DTOs;
using TripPlannerService.Models;
using TripPlannerService.Services;

namespace TripPlannerService.Controllers;

[ApiController]
[Route("trip")]
[Authorize]
public class TripController : ControllerBase
{
    private readonly TripDbContext _context;
    private readonly IEmailService _emailService;

    public TripController(TripDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateTrip([FromBody] TripDto tripDto)
    {
        if (tripDto.StartDate >= tripDto.EndDate)
            return BadRequest("StartDate must be earlier than EndDate");

        if (tripDto.DestinationId <= 0)
            return BadRequest("DestinationId is required");

        if (tripDto.TransportOptionId <= 0)
            return BadRequest("Transport option is required");
        // fluent validator
        var username = User.Identity?.Name;
        if (username == null)
            return Unauthorized();

        var trip = new Trip
        {
            Username = username,
            DestinationId = tripDto.DestinationId,
            StartDate = tripDto.StartDate.ToUniversalTime(),
            EndDate = tripDto.EndDate.ToUniversalTime(),
            TransportOptionId = tripDto.TransportOptionId,
            Activities = tripDto.Activities ?? new List<string>()
        };

        _context.Trips.Add(trip);
        await _context.SaveChangesAsync();
        await _emailService.SendTripCreatedEmail(username, tripDto.DestinationId.ToString(), trip.StartDate);

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
            .Include(t => t.Destination)
            .Include(t => t.Reviews)
            .Include(t => t.TransportOption)
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

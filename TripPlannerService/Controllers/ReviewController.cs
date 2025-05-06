using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TripPlannerService.Data;
using TripPlannerService.DTOs;
using TripPlannerService.Models;

namespace TripPlannerService.Controllers;

[ApiController]
[Route("review")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly TripDbContext _context;

    public ReviewController(TripDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> AddReview([FromBody] ReviewDto dto)
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        var trip = await _context.Trips.FindAsync(dto.TripId);
        if (trip == null) return NotFound("Trip not found");
        if (trip.Username != username) return Forbid("You are not allowed to review this trip");

        var review = new Review
        {
            Username = username,
            TripId = dto.TripId,
            Comment = dto.Comment,
            Rating = dto.Rating
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(review);
    }

    [HttpGet("/trip/{tripId}/reviews")]
    public async Task<IActionResult> GetReviewsForTrip(int tripId)
    {
        var reviews = await _context.Reviews
            .Where(r => r.TripId == tripId)
            .ToListAsync();

        return Ok(reviews);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(int id)
    {
        var username = User.Identity?.Name;
        if (username == null) return Unauthorized();

        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound("Review not found");

        if (review.Username != username)
            return Forbid("You are not allowed to delete this review");

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return NoContent();
    }


}

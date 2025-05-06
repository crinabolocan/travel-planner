using Microsoft.AspNetCore.Mvc;
using TripPlannerService.Data;
using TripPlannerService.DTOs;
using TripPlannerService.Models;

namespace TripPlannerService.Controllers;

[ApiController]
[Route("feedback")]
public class FeedbackController : ControllerBase
{
    private readonly TripDbContext _context;

    public FeedbackController(TripDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackDto dto)
    {
        var feedback = new Feedback
        {
            Category = dto.Category,
            Rating = dto.Rating,
            Agree = dto.Agree,
            Message = dto.Message
        };

        _context.Feedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Feedback received." });
    }
}

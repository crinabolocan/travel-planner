namespace TripPlannerService.DTOs;

public class FeedbackDto
{
    public string Category { get; set; } = string.Empty;
    public string Rating { get; set; } = string.Empty;
    public bool Agree { get; set; }
    public string Message { get; set; } = string.Empty;
}

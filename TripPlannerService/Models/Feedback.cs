namespace TripPlannerService.Models;

public class Feedback
{
    public int Id { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Rating { get; set; } = string.Empty;
    public bool Agree { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
}

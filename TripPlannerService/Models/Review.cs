namespace TripPlannerService.Models;

public class Review
{
    public int Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public int TripId { get; set; }
    public Trip? Trip { get; set; }

    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
}

namespace TripPlannerService.Models;

public class Trip
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Destination { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string Transport { get; set; } = string.Empty;
    public List<string> Activities { get; set; } = new();
}

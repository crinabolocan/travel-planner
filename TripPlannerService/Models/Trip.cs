namespace TripPlannerService.Models;

public class Trip
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;

    public int DestinationId { get; set; }
    public Destination? Destination { get; set; }

    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public int TransportOptionId { get; set; }
    public TransportOption? TransportOption { get; set; }

    public List<string> Activities { get; set; } = new();
    public List<Review> Reviews { get; set; } = new();
}


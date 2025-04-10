namespace TripPlannerService.DTOs;

public class TripDto
{
    public int DestinationId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int TransportOptionId { get; set; }
    public List<string> Activities { get; set; } = new();
}

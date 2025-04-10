// DTOs/ReviewDto.cs
namespace TripPlannerService.DTOs;

public class ReviewDto
{
    public int TripId { get; set; }
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; }
}

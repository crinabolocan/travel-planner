namespace TripPlannerService.DTOs
{
    public class TransportOptionDto
    {
        public string Type { get; set; } = string.Empty;

        public string Company { get; set; } = string.Empty;

        public decimal Price { get; set; }
    }
}

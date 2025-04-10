namespace TripPlannerService.Models
{
    public class TransportOption
    {
        public int Id { get; set; }

        public string Type { get; set; } = string.Empty;

        public string Company { get; set; } = string.Empty;

        public decimal Price { get; set; }

        public ICollection<Trip> Trips { get; set; } = new List<Trip>();
    }
}

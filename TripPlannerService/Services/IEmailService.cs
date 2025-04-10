namespace TripPlannerService.Services
{
    public interface IEmailService
    {
        Task SendTripCreatedEmail(string toEmail, string destination, DateTime startDate);
    }
}

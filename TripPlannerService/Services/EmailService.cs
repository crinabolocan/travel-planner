using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace TripPlannerService.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendTripCreatedEmail(string toEmail, string destination, DateTime startDate)
    {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse("noreply@travelplanner.com"));
        email.To.Add(MailboxAddress.Parse(toEmail));
        email.Subject = "Noua ta calatorie a fost creata!";

        email.Body = new TextPart("plain")
        {
            Text = $"Salut! Ai creat o calatorie catre {destination}, care incepe pe {startDate:dd.MM.yyyy}."
        };

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_config["Mail:SmtpHost"], 587, false);
        await smtp.AuthenticateAsync(_config["Mail:Username"], _config["Mail:Password"]);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);
    }
}

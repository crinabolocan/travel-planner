using FluentValidation;
using TripPlannerService.DTOs;

namespace TripPlannerService.Validators;

public class TripDtoValidator : AbstractValidator<TripDto>
{
    public TripDtoValidator()
    {
        RuleFor(x => x.StartDate)
            .LessThan(x => x.EndDate)
            .WithMessage("StartDate must be earlier than EndDate");

        RuleFor(x => x.DestinationId)
            .GreaterThan(0)
            .WithMessage("DestinationId is required");

        RuleFor(x => x.TransportOptionId)
            .GreaterThan(0)
            .WithMessage("Transport option is required");
    }
}

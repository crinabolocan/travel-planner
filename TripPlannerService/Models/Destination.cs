﻿namespace TripPlannerService.Models;

public class Destination
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public List<Trip> Trips { get; set; } = new();
}

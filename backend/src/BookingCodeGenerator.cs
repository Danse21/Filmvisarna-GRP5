namespace WebApp;

public static class BookingCodeGenerator
{
  private static readonly Random random = new Random();


  private static readonly string chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

  public static string Generate(int length = 8)
  {
    var code = new string(
      Enumerable.Range(0, length)
      .Select(_ => chars[random.Next(chars.Length)])
      .ToArray()
    );
    Log("Generated booking code:", code);

    return $"RC- {code}";
  }
}
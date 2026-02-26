namespace WebApp;

//Bokningkod generator
//Skapar unik bokningsrefersens till varje bokning
//inte kopplat till något än

public static class BookingCodeGenerator
{
  private static readonly Random random = new Random();
  // "static readonly" betyder att den skapas en gång när klassen laddas
  // och sen ändras den aldrig.
  // Random är en befintlig klass i C# som generera slumpade tal.

  private static readonly string chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  // Tecknen som kan ingå i bokningskoden.

  public static string Generate(int length = 8)
  // Metoden som genererar en bokningskod.

  {
    var code = new string(
      Enumerable.Range(0, length)
      .Select(_ => chars[random.Next(chars.Length)])
      .ToArray()
    );
    // koden byggs tecken för tecken med hjälp av LINQ
    // Enumerable.Range(0, length) skapar en sekvens: [0, 1, 2, ..., length-1]
    // Det är bara ett sätt att säga "gör detta 'length' antal gånger".
    // .Select(_ => ...) omvandlar varje tal i sekvensen till ett slumpmässigt tecken.
    // Understrecket "_" betyder att vi inte bryr oss om själva talet,
    // vi vill bara köra koden 'length' gånger, alltså 8.
    // chars[random.Next(chars.Length)] väljer ett slumpmässigt tecken
    // ur teckensträngen. random.Next(n) ger ett tal mellan 0 och 30-1.
    // new string(...ToArray()) sätter ihop alla tecken till en sträng.
    Log("Generated booking code:", code);

    return $"RC- {code}";
  }
}
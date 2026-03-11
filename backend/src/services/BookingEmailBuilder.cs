using QRCoder;
namespace WebApp;


public static class BookingEmailBuilder
{
private static byte[] GenerateQr(string content)
{
    var generator = new QRCodeGenerator();
    var data = generator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);

    var qrCode = new PngByteQRCode(data);
    return qrCode.GetGraphic(10);
}
    public static void SendBookingEmail(
    string email,
    string bookingRef,
    string movieTitle,
    int ageLimit,
    DateTime startTime,
    string screenName,
    IEnumerable<string> selectedSeats,
    int adultCount,
    int childCount,
    int seniorCount,
    decimal totalPrice
)

    {
        // Läs template
        var templatePath = Path.Combine(
            AppContext.BaseDirectory,
            "..","..","..",
            "templates",
            "bookingEmail.html"
        );

        string template = File.ReadAllText(templatePath);

        // Format seats
        var formattedSeats = new List<string>();

        foreach (var seatCode in selectedSeats)
        {
            var parts = seatCode.Split('-');

            int row = int.Parse(parts[0]);
            int seat = int.Parse(parts[1]);

            formattedSeats.Add($"Rad {row} – Stol {seat}");
        }

        string seatList = string.Join(", ", formattedSeats);

        // Replace placeholders
        template = template.Replace("{{seatList}}", seatList);
        template = template.Replace("{{adultCount}}", adultCount.ToString());
        template = template.Replace("{{childCount}}", childCount.ToString());
        template = template.Replace("{{seniorCount}}", seniorCount.ToString());
        template = template.Replace("{{totalPrice}}", totalPrice.ToString());
        template = template.Replace("{{bookingCode}}", bookingRef);

        // Temporärt tills vi lägger filmdata
       template = template.Replace("{{movieTitle}}", movieTitle);
template = template.Replace("{{ageLimit}}", ageLimit.ToString());

template = template.Replace("{{showDate}}", startTime.ToString("yyyy-MM-dd"));
template = template.Replace("{{showTime}}", startTime.ToString("HH:mm"));

template = template.Replace("{{screenName}}", screenName);




template = template.Replace("{{childPrice}}", "");
template = template.Replace("{{adultPrice}}", "");
template = template.Replace("{{seniorPrice}}", "");


        // Skicka mail
byte[] qrBytes = GenerateQr(bookingRef);
EmailService.SendEmail(email, template, qrBytes);

    }
}
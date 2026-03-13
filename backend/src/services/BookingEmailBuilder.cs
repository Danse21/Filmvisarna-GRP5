using QRCoder;
using System.Collections;
using System.Globalization;
// Omvandlare för jag vet inte vilken datatyp jag får i stringen och en omvandlare för datum till svenska och Qr kod builder
namespace WebApp;

public static class BookingEmailBuilder
{

   
    // QR generator
   
    private static byte[] GenerateQr(string content)
    {
        var generator = new QRCodeGenerator();
        var data = generator.CreateQrCode(content, QRCodeGenerator.ECCLevel.Q);

        var qrCode = new PngByteQRCode(data);
        return qrCode.GetGraphic(10);
    }


    // Main email builder
 
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
        template = template.Replace("{{totalPrice}}", totalPrice.ToString("0.00", CultureInfo.InvariantCulture));
        template = template.Replace("{{bookingCode}}", bookingRef);

        template = template.Replace("{{movieTitle}}", movieTitle);
        template = template.Replace("{{ageLimit}}", ageLimit.ToString());

        template = template.Replace("{{showDate}}", startTime.ToString("yyyy-MM-dd"));
        template = template.Replace("{{showTime}}", startTime.ToString("HH:mm"));

        template = template.Replace("{{screenName}}", screenName);

        template = template.Replace("{{childPrice}}", "");
        template = template.Replace("{{adultPrice}}", "");
        template = template.Replace("{{seniorPrice}}", "");


        // Generate QR
        byte[] qrBytes = GenerateQr(bookingRef);


        // Send mail
        EmailService.SendEmail(email, template, qrBytes);
    }


    
    // "Adapter" that fetches movie + showtime data
    // and converts seats from dynamic → string
   
    public static void SendBookingEmailFromShowtime(
        string email,
        string bookingRef,
        int showtimeId,
        string screenName,
        object selectedSeats,
        int adultCount,
        int childCount,
        int seniorCount,
        decimal totalPrice
    )
    {

     // Fetch showtime
var showtime = SQLQueryOne(
    "SELECT movie_id, start_time FROM showtime WHERE id = @id",
    new { id = showtimeId }
);

if (showtime == null)
    throw new Exception("Showtime not found for booking email");


// Fetch movie
var movie = SQLQueryOne(
    "SELECT title, age_limit FROM movie WHERE id = @id",
    new { id = showtime.movie_id }
);

if (movie == null)
    throw new Exception("Movie not found for booking email");


// Extract values
string movieTitle = movie.title;
int ageLimit = Convert.ToInt32(movie.age_limit);
DateTime startTime = Convert.ToDateTime(showtime.start_time);


        // Convert seats → List<string>
        var seatStrings = new List<string>();

        foreach (var seat in (IEnumerable)selectedSeats)
        {
            seatStrings.Add(seat.ToString());
        }


        // Call main email builder
        SendBookingEmail(
            email,
            bookingRef,
            movieTitle,
            ageLimit,
            startTime,
            screenName,
            seatStrings,
            adultCount,
            childCount,
            seniorCount,
            totalPrice
        );
    }

}
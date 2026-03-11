using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace WebApp;

public static class EmailService
{

    // Skapar vår funktion som skickar email med 3 parametrar.
 public static void SendEmail(string to, string htmlBody, byte[] qrBytes)
    {
        // Sätt path - för att hitta db-config.json
        var configPath = Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "db-config.json"
      );
        // Läser in filen "db-config.json"
        var configJson = File.ReadAllText(configPath);
        // Gör om den inlästa filen "db-config.json" till json-format
        var config = JSON.Parse(configJson);
        


        // Plockar ut konfigurationen från "db-config.json"
        string smtpServer = config.smtpServer;
        int smtpPort = Convert.ToInt32(config.smtpPort);
        string emailUsername = config.emailUsername;
        string emailPassword = config.emailPassword;

 
var builder = new BodyBuilder();

// HTML-version  var builder = new BodyBuilder();
        builder.HtmlBody = htmlBody;
        builder.TextBody = @"
RetroCinema Bokningsbekräftelse

Om HTML-mailet inte visas korrekt kan du använda bokningsnumret i kassan.

Tack för ditt besök!
RetroCinema
";

        var image = builder.LinkedResources.Add("qrcode.png", qrBytes);
        image.ContentId = "qrcode";

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(emailUsername));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = "RetroCinema - Bokningsbekräftelse";
        message.Body = builder.ToMessageBody();

        using (var client = new SmtpClient())
        {
            client.Connect(smtpServer, smtpPort, false);
            client.Authenticate(emailUsername, emailPassword);
            client.Send(message);
            client.Disconnect(true);
        }
    }
}


/*
EMAIL TEMPLATE PLACEHOLDERS

Film & Visning
{{movieTitle}}     -> Filmens titel
{{ageLimit}}       -> Åldersgräns
{{showDate}}       -> Datum för visningen
{{showTime}}       -> Starttid (ev. även sluttid)
{{screenName}}     -> Salong / Screen
{{seatList}}       -> Lista med platser (ex: "Rad 4 – Stol 38, 39, 40")

Biljetter
{{childCount}}     -> Antal barnbiljetter
{{childPrice}}     -> Pris per barnbiljett

{{adultCount}}     -> Antal vuxenbiljetter
{{adultPrice}}     -> Pris per vuxenbiljett

{{seniorCount}}    -> Antal pensionärsbiljetter
{{seniorPrice}}    -> Pris per pensionärsbiljett

Pris
{{totalPrice}}     -> Totalt pris för bokningen

Bokning
{{bookingCode}}    -> Bokningsnummer / bokningskod

QR
{{qrImageUrl}}     -> URL eller base64-bild till QR-kod
*/

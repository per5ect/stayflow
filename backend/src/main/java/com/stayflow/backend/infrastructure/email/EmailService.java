package com.stayflow.backend.infrastructure.email;

import com.stayflow.backend.domain.payment.Payment;
import com.stayflow.backend.domain.reservation.Reservation;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationCode(String to, String code) {
        String content = "<h2>Verify your email</h2>"
                + "<p>Your verification code:</p>"
                + "<div style='font-size:32px;font-weight:bold;color:#2563eb;'>" + code + "</div>"
                + "<p>This code expires in <b>15 minutes</b>.</p>";
        sendEmail(to, "StayFlow - Email Verification", content);
    }

    public void sendReservationApproved(String to, String apartmentTitle, String landlordMessage) {
        String content = "<h2>Reservation Approved! 🎉</h2>"
                + "<p>Your reservation for <b>" + apartmentTitle + "</b> has been approved!</p>"
                + "<p><b>Message from landlord:</b> " + landlordMessage + "</p>";
        sendEmail(to, "StayFlow - Reservation Approved", content);
    }

    public void sendReservationDeclined(String to, String apartmentTitle, String landlordMessage) {
        String content = "<h2>Reservation Declined</h2>"
                + "<p>Unfortunately your reservation for <b>" + apartmentTitle
                + "</b> has been declined.</p>"
                + "<p><b>Message from landlord:</b> " + landlordMessage + "</p>"
                + "<p>Please try other available apartments on StayFlow.</p>";
        sendEmail(to, "StayFlow - Reservation Declined", content);
    }

    public void sendPaymentReceiptToRenter(String to, Payment payment) {
        Reservation reservation = payment.getReservation();
        String content = "<h2>Payment Receipt 🧾</h2>"
                + "<p><b>Receipt Number:</b> " + payment.getReceiptNumber() + "</p>"
                + "<p><b>Transaction ID:</b> " + payment.getTransactionId() + "</p>"
                + "<p><b>Date:</b> " + payment.getPaidAt() + "</p>"
                + "<hr/>"
                + "<h3>Booking Details</h3>"
                + "<p><b>Check-in:</b> " + reservation.getCheckIn() + "</p>"
                + "<p><b>Check-out:</b> " + reservation.getCheckOut() + "</p>"
                + "<hr/>"
                + "<h3>Payment Details</h3>"
                + "<p><b>Total Amount:</b> $" + payment.getAmount() + "</p>"
                + "<p><b>Paid with:</b> " + payment.getCardBrand()
                + " ending in " + payment.getCardLastFour() + "</p>";
        sendEmail(to, "StayFlow - Payment Receipt", content);
    }

    public void sendPaymentReceiptToLandlord(String to, Payment payment) {
        Reservation reservation = payment.getReservation();
        String content = "<h2>New Booking Payment 💰</h2>"
                + "<p><b>Receipt Number:</b> " + payment.getReceiptNumber() + "</p>"
                + "<p><b>Date:</b> " + payment.getPaidAt() + "</p>"
                + "<hr/>"
                + "<h3>Booking Details</h3>"
                + "<p><b>Renter:</b> " + reservation.getRenter().getFirstName()
                + " " + reservation.getRenter().getLastName() + "</p>"
                + "<p><b>Check-in:</b> " + reservation.getCheckIn() + "</p>"
                + "<p><b>Check-out:</b> " + reservation.getCheckOut() + "</p>"
                + "<hr/>"
                + "<h3>Payment Details</h3>"
                + "<p><b>Total Amount:</b> $" + payment.getAmount() + "</p>"
                + "<p><b>Platform Commission (10%):</b> $" + payment.getCommission() + "</p>"
                + "<p><b>Your Payout (90%):</b> $" + payment.getLandlordPayout() + "</p>";
        sendEmail(to, "StayFlow - New Booking Payment", content);
    }

    private void sendEmail(String to, String subject, String content) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(buildHtmlTemplate(subject, content), true);
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    private String buildHtmlTemplate(String title, String content) {
        return "<html>"
                + "<body style='font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;'>"
                + "<div style='max-width:500px;margin:auto;background:#fff;padding:30px;"
                + "border-radius:10px;box-shadow:0 0 10px rgba(0,0,0,0.1);'>"
                + "<h1 style='color:#2563eb;font-size:24px;'>StayFlow</h1>"
                + "<hr style='border:1px solid #e5e7eb;'/>"
                + content
                + "<hr style='border:1px solid #e5e7eb;margin-top:30px;'/>"
                + "<p style='font-size:12px;color:#6b7280;'>"
                + "© 2025 StayFlow. All rights reserved.</p>"
                + "</div>"
                + "</body>"
                + "</html>";
    }
}
import nodemailer from "nodemailer";
import { documentsRepo } from "@/lib/db/repositories";

async function getAccessToken() {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || JSON.stringify(data));
  }
  return data.access_token;
}

async function sendGraphMail({ to, subject, message, attachmentBase64, attachmentName }) {
  const token = await getAccessToken();

  const attachments = attachmentBase64
    ? [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: attachmentName || "document.pdf",
          contentType: "application/pdf",
          contentBytes: attachmentBase64,
        },
      ]
    : [];

  const payload = {
    message: {
      subject,
      body: { contentType: "Text", content: message },
      toRecipients: [{ emailAddress: { address: to } }],
      attachments,
    },
    saveToSentItems: true,
  };

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${process.env.EMAIL_FROM}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.error?.message || JSON.stringify(errorData));
  }
}

export async function POST(request) {
  try {
    const { to, subject, message, attachmentBase64, attachmentName, templateId, templateName, values } =
      await request.json();

    if (!to || !subject) {
      return Response.json(
        { error: "กรุณาระบุผู้รับและหัวข้อ" },
        { status: 400 }
      );
    }

    // If Microsoft Graph API credentials are set, use Microsoft Graph
    if (process.env.CLIENT_ID && process.env.CLIENT_SECRET && process.env.TENANT_ID) {
      await sendGraphMail({ to, subject, message, attachmentBase64, attachmentName });
      await documentsRepo.create({
        name: attachmentName || "NDA.pdf",
        templateId: templateId || "nda",
        templateName: templateName || "NDA",
        sentTo: to,
        values: values || {},
      });
      return Response.json({ success: true, provider: "Microsoft Graph" });
    }

    // Fallback: Gmail via Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const attachments = attachmentBase64
        ? [
            {
              filename: attachmentName || "document.pdf",
              content: Buffer.from(attachmentBase64, "base64"),
              contentType: "application/pdf",
            },
          ]
        : [];

      await transporter.sendMail({
        from: `"Document Generator" <${process.env.GMAIL_USER}>`,
        to,
        subject,
        text: message,
        attachments,
      });

      await documentsRepo.create({
        name: attachmentName || "NDA.pdf",
        templateId: templateId || "nda",
        templateName: templateName || "NDA",
        sentTo: to,
        values: values || {},
      });

      return Response.json({ success: true, provider: "Nodemailer (Gmail)" });
    }

    return Response.json(
      { error: "ไม่พบการตั้งค่าอีเมลในระบบ (.env)" },
      { status: 500 }
    );
  } catch (error) {
    console.error("send-email error:", error);
    return Response.json(
      { error: error.message || "ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}

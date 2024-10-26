import { INotificationModuleService } from '@medusajs/types';
import { Modules } from '@medusajs/utils';

function generateTemplate(body: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Medusa Email</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 20px;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333;
    }
    p {
      line-height: 1.6;
      color: #555;
    }
    a {
      color: #007bff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Medusa</h1>
    </header>
    <main>
      ${body}
    </main>
    <footer>
      <p>Sincerely,<br>The Medusa Team</p>
    </footer>
  </div>
</body>
</html>
`;
}

export async function sendEmail({ to, subject, body }: { to: string; subject: string; body: string }, container: any) {
  const notificationModuleService: INotificationModuleService = container.resolve(Modules.NOTIFICATION);

  try {
    await notificationModuleService.createNotifications({
      to,
      channel: 'email',
      template: generateTemplate(body),
      data: { subject },
    });
    console.log('Email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

type ResetPasswordTemplateArgs = {
  appName: string;
  userName: string;
  url: string;
};

export function renderResetPasswordHtml({
  appName,
  userName,
  url,
}: ResetPasswordTemplateArgs): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset your password</title>
  <style>
    :root {
      --email-bg: #F0F0FF;
      --email-card: #FFFFFF;
      --email-fg: #080616;
      --email-muted: #162E93;
      --email-border: #C8C8F0;
      --email-primary: #2F2FE4;
      --email-on-primary: #FFFFFF;
      --email-surface: #E8E8FF;
    }

    body { margin: 0; padding: 0; background: var(--email-bg); color: var(--email-fg); font-family: Arial, sans-serif; }
    .wrap { max-width: 560px; margin: 0 auto; padding: 40px 16px; }
    .card { background: linear-gradient(180deg, var(--email-card) 0%, var(--email-surface) 100%); border: 1px solid var(--email-border); border-radius: 16px; padding: 28px; }
    h1 { margin: 0 0 12px; font-size: 22px; font-weight: 600; }
    p { margin: 0 0 14px; line-height: 1.6; color: var(--email-muted); }
    .btn { display: inline-block; padding: 12px 20px; background: var(--email-primary); color: var(--email-on-primary) !important; text-decoration: none; border-radius: 999px; font-weight: 600; }
    .mono { margin-top: 14px; padding: 12px; background: var(--email-bg); border: 1px solid var(--email-border); border-radius: 10px; word-break: break-all; color: var(--email-fg); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace; font-size: 12px; }
    .small { font-size: 12px; color: var(--email-muted); margin-top: 18px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <p style="margin:0 0 8px; color:var(--email-muted);">${appName}</p>
      <h1>Reset your password</h1>
      <p>Hello, <strong style="color:var(--email-fg);">${userName}</strong>. We received a request to reset your password.</p>
      <p><a class="btn" href="${url}">Reset password</a></p>
      <p class="small">If the button doesn’t work, copy and paste this link:</p>
      <div class="mono">${url}</div>
      <p class="small">If you didn’t request a password reset, you can ignore this email.</p>
    </div>
  </div>
</body>
</html>`;
}

